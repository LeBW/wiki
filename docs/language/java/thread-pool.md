# Java 线程池
线程是不能够重复启动的，创建或者销毁线程存在一定的开销，所以利用线程池技术来**提高系统资源利用效率，并简化线程管理**，已经是非常成熟的选择。

首先我们来看看 Java 并发类库提供的线程池有哪几种？分别有什么特点？

通常开发者都是利用 Executors 提供的通用线程池创建方法（静态方法），去创建不同配置的线程池，主要区别在于不同的 ExecutorService 类型或者不同的初始参数。
> 例如 `Executors.newCachedThreadPool()` 可用创建一个缓存线程池。

Executors 目前提供了 5 种不同的线程池创建配置：
* `newCachedThreadPool()`，它是一种用于处理大量短时间工作任务的线程池，具有几个鲜明特点：它会试图缓存线程并重用，当无缓存线程可用时，就会创建新的工作线程；如果线程的闲置时间超过 60 s，则被终止并移除缓存；长时间闲置时，这种线程池，不会消耗什么资源。其内部使用 SynchronousQueue 作为工作队列。
* `newFixedThreadPool(int nThread)`，重用指定数目的线程，背后使用的是无界的工作队列（LinkedBlockingQueue），任何时候最多有 nThread 个工作线程是活动的。这意味着，如果任务数量超过了活动队列数目，将在工作队列中等待空闲线程出现；如果有工作线程退出，将会有新的工作线程被创建，以补足指定的数目 nThread。
* `newSingleThreadExecutor()`，它的特点在于工作线程数目被限制为 1，操作一个无界的工作队列，所以它保证了所有任务的都是被顺序执行，最多会有一个任务处于活动状态，并且不允许使用者改动线程池实例，因此可以避免其改变线程数目。
* `newSingleThreadScheduledExecutor() 和 newScheduledThreadPool(int corePoolSize)`，创建的是个 ScheduledExecutorService，可以进行定时或周期性的工作调度，区别在于单一工作线程还是多个工作线程。
* `newWorkStealingPool(int parallelism)`，这是一个经常被人忽略的线程池，Java 8 才加入这个创建方法，其内部会构建ForkJoinPool，利用Work-Stealing算法，并行地处理任务，不保证处理顺序。

## 线程池的设计和结构
在大多数情况下，使用 Executors 提供的 5 个静态方法就足够了，但是仍可能需要直接利用 ThreadPoolExecutor 等构造函数创建，这就要求我们对线程构造方式有进一步的了解，我们需要明白线程池的设计和结构。

首先我们来看看 Executor 框架的基本组成，参考下面的类图。

![executor](./Executor.png)

首先从整体上把握一下各个类型的主要设计目的：
* Executor 是一个基础的接口，其初衷是将任务提交和任务执行细节解耦，这一点可以体会其定义的唯一方法。
```java
void execute(Runnable commmand);
```
Executor 的设计是源于 Java 早期线程 API 使用的教训，开发者在实现应用逻辑时，被太多线程创建、调度等不相关细节所打扰。就像我们进行 HTTP 通信，如果还需要自己操作 TCP 握手，开发效率低下，质量也难以保证。
* ExecutorService 则更加完善，不仅提供 service 的管理功能，比如 shutdown 方法，也提供了更为全面的提交任务机制，如返回 Future 而不是 void 的 submit 方法。
```java
<T> Future<T> submit(Callable<T> task);
```
> 注意，这个例子输入的是 Callable，它解决了 Runnable 无法返回结果的困扰。
* Java 标准类库提供了几种基础实现，比如 ThreadPoolExecutor、ScheduledThreadPoolExecutor、ForkJoinPool。这些线程池的设计特点在于其高度的可调节性和灵活性，以尽量满足复杂多变的实际应用场景，我会进一步分析其构建部分的源码，剖析这种灵活性的源头。
* Executors 则从简化使用的角度，为我们提供了各种方便的静态工厂方法。

下面从源码的角度，分析线程池的设计和实现，这里主要围绕最基础的 ThreadPoolExecutor 源码。
> ThreadPoolExecutor 源码。ScheduledThreadPoolExecutor 是 ThreadPoolExecutor 的扩展，主要是增加了调度逻辑，如想深入了解，你可以参考相关教程。而 ForkJoinPool 则是为 ForkJoinTask 定制的线程池，与通常意义的线程池有所不同。

这部分内容很晦涩，罗列概念也不利于理解，所以配合一些示意图来说明。在现实应用中，理解应用与线程池的交互和线程池的内部工作原理，可以参考下图

![executor-service](./ExecutorService.png)

* 工作队列负责存储用户提交的各个任务。这个工作队列，可以是容量为 0 的 SynchronousQueue(在 newCachedThreadPool 中使用)，也可以是像固定大小线程池（newFixedThreadPool）中一样使用 LinkedBlockingQueue。
```java
private final BlockingQueue<Runnable> workQueue;
```
* 内部的线程池，这是指保持工作线程的集合，线程池需要在运行过程中管理线程创建、销毁。例如，对于带缓存的线程，当任务压力过大时，线程池会创建新的工作线程；当业务压力褪去时，线程池会闲置一段时间（默认 60s）后结束线程。
```java
private final HashSet<Worker> workers = new HashSet<>();
```

线程池的工作线程被抽象为静态内部类 Worker，基于 AQS 实现。
* ThreadFactory 提供上面所需要的创建线程逻辑
* 如果任务提交时被拒绝，比如线程池已经处于 SHUTDOWN 状态，需要为其提供处理逻辑，Java 标准库提供了类似ThreadPoolExecutor.AbortPolicy等默认实现，也可以按照实际需求自定义。

从上面的分析，就可以看出线程池的几个基本组成部分，一起都体现在线程池的构造函数中，从字面我们就可以大概猜测到其用意：
* corePoolSize，所谓的核心线程数，可以大致理解为长期驻留的线程数目（除非设置了 allowCoreThreadTimeOut）。对于不同的线程池，这个值可能会有很大区别，比如 newFixedThreadPool 会将其设置为 nThreads，而对于 newCachedThreadPool 则是为 0。
* maximumPoolSize，顾名思义，就是线程不够时能够创建的最大线程数。同样进行对比，对于 newFixedThreadPool，当然就是 nThreads，因为其要求是固定大小，而 newCachedThreadPool 则是 Integer.MAX_VALUE。
* keepAliveTime 和 TimeUnit，这两个参数指定了额外的线程能够闲置多久，显然有些线程池不需要它。
* workQueue，工作队列，必须是 BlockingQueue。

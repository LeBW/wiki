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

![executor](./executor.png)

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

未完待续。


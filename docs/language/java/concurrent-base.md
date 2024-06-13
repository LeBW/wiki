# Java 并发基础
首先，我们要明白一个问题，为什么要使用并发编程，即：为什么要使用多线程呢？

这个问题我们从计算机底层来探讨一下：
* 在单核时代，多线程主要是为了提高 CPU 和 IO 设备的综合利用率。举个例子：当只有一个线程的时候会导致 CPU 计算时，IO 设备空闲；进行 IO 操作时，CPU 空闲。当有两个线程时就不一样了，当一个线程执行 CPU 计算时，另一个线程可以进行 IO 操作，这样两个的利用率就可以在理想情况下达到 100% 了。
* 在多核时代，多线程还可以用来提高 CPU 利用率。举个例子：假如我们要计算一个复杂的任务，我们只用一个线程的话，CPU 只会有一个核心被用到，而创建多个线程就可以让多个 CPU 核心被利用到，这样就提高了 CPU 的利用率。

总之，并发编程的目的就是为了能提高程序的执行效率和运行速度。但是并发编程并不总是能够提高程序运行速度的，而且并发编程可能会遇到很多问题，比如：
* 安全性问题。线程安全性非常复杂，因为多个线程中的执行顺序是不可预测的，所以很容易造成 竞态条件（Race Condition）。这种时候，开发者需要使用 Java 中的各种同步机制来协同这种共享数据的访问。
* 活跃性问题：包括死锁，饥饿，以及活锁。
* 性能问题：在多线程程序中，如果出现频繁的上下文切换操作，将代码极大的开销：保存和恢复执行上下文，丢失局部性，并且 CPU 时间将更多花在线程调度而不是线程运行上。

## Thread
顾名思义，Thread 就是线程类。Thread 类实现了 Runnable 接口。首先我们来讲讲 Java 中 Thread 和操作系统中线程的关系。
### green threads 和 native threads
green threads 是一种由运行环境或虚拟机（VM）调度，而不是由本地底层操作系统调度的线程。绿色线程并不依赖底层的系统功能，模拟首先了多线程的运行，这种线程的管理调配发生在用户空间而不是内核空间，所以它们可以在没有原生线程支持的环境中工作。

在 Java 1.1 中，绿色线程（至少在 Solaris）是 JVM 中使用的唯一一种线程模型。 由于绿色线程和原生线程比起来在使用时有一些限制，随后的 Java 版本中放弃了绿色线程，转而使用 native threads。

在 Java 1.2 以后，Linux 中的 JVM 是基于 `pthread` 实现的。**所以，现在的 Java 中线程的本质，其实就是操作系统中的线程。**

### Thread 的生命周期和状态
Java 中的 Thread 在运行的生命周期中只可能处于下面 6 种状态中的一种

![thread-state-table](./thread-state-table.png)

Java 线程状态变更图如下所示：

![thread-state](./thread-state.png)

> 由于操作系统隐藏 Java 虚拟机（JVM）中的 READY 和 RUNNING 状态，因此它只能看到 RUNNABLE 状态。所以 Java 系统一般把这两个状态统称为 RUNNABLE 状态。另外，无论是 Waiting，Time Waiting 还是 Blocked，在操作系统中都是对应着 waiting（等待）状态。

> 需要注意，BLOCKED、WAITING、TIMED_WAITING 都会使线程进入暂停状态，其中 BLOCKED 仅在使用 synchoronized 关键词时会使用到，而其他的锁（例如 ReentrantLock）都会使线程进入 WAITING 状态（因为底层用到的是 AQS，AQS 底层用到的是 LockSupport）

> 另外，需要注意 BLOCKED、WAITING 都是用来控制线程间同步或等待情况而定义的状态而设定的，它与我们平时在说 I/O 时的阻塞不是一回事。换句话说，当线程在调用阻塞IO（例如 SocketInputStream.read）的时候，虽然我们会说线程进入了阻塞，但是其实它在 JVM 线程的层面仍然是 RUNNABLE 状态，只不过在操作系统的角度来看进入了等待 IO 的状态，因此不会占用 CPU。

### Runnable
`Runnable` 是 Java 并发中最基本的接口，可以理解为任务的意思，其中只有一个方法 `run()`。任何一个想要被线程执行的实例类，都需要实现这个接口。
```java
public abstract void run();
```
### Thread 的关键字段和方法
在 Thread 类中，有一些比较关键的属性，例如
```java
public class Thread implements Runnable {
    private volatile String name;    // 表示 Thread 的名字
    private int priority;  // 指定线程的优先级（最大值为 10，最小值是 1，默认值是 5）
    private boolean daemon; // 表示线程是否是 守护线程
    private Runnable target; // 表示要执行的任务
}
```
* priority：新创建的线程，会和它的父线程有相同的优先级
* daemon：当且仅当新创建的线程的父线程是守护线程时，它自己才是守护线程。

#### yield()
`yield()` 会给线程调度器一个暗示：我的工作做的差不多了，可以让别的线程使用 CPU 了。

注意这只是一个暗示，没有任何保证它会被采纳。另外，它只能让步给其他**具有相同优先级**的线程。

#### join()
一个线程可以在其他线程之上调用 join() 方法，其效果是等待一段时间直到第二个线程结束后才继续执行。

例如某个线程在另一个线程 t 上调用 `t.join()`，此线程将会被挂起进入 WAITING 状态，直到目标线程 t 结束才恢复。

也可以在 join() 上带一个超时参数，这样如果目标线程在这段时间到期时害没有接受的话，join() 方法总能返回（线程回到 RUNNABLE 状态）

当 JVM 启动时，会有一个非守护线程（main 函数）。JVM 进程会持续运行，直到发生以下任一种情况：
1. 当前 Runtime 执行 `exit` 方法后，并且 security manager 允许了 exit，进程就会结束。
2. 所有的非守护线程结束后（无论是 return，还是抛出了超出 run 方法的异常），进程就会结束。

创建可执行的进程一般有两种方式：1. 继承 Thread。 2. 实现 Runnable 接口，然后传入 Thread。

例如第一种，通过继承 Thread：
```java
class PrimeThread extends Thread {
    long minPrime;
    PrimeThread(long minPrime) {
        this.minPrime = minPrime;
    }

    public void run() {
        // compute primes larger than minPrime
         . . .
    }
}
```
然后是第二种，通过实现 Runnable 类，然后传入 Thread
```java
class PrimeRun implements Runnable {
    long minPrime;
    PrimeRun(long minPrime) {
        this.minPrime = minPrime;
    }

    public void run() {
        // compute primes larger than minPrime
         . . .
    }
}
PrimeRun p = new PrimeRun(143);
new Thread(p).start();
```

## Executor
Executor 可以用来管理 Thread 对象，从而简化并发编程。有关知识详见 [Java 线程池](./thread-pool.md)

## Callable 和 Future
上面讲到了 Runnable，是执行工作的独立单位，但是 Runnable 的缺点是不返回任何值。如果我们希望任务在完成时能够返回一个值，那么可以实现 Callable 接口而不是 Runnable 接口。在 Java SE5 中引入了 Callable 接口，它是一种具有类型参数的泛型，它的类型参数表示的是从方法 call（）(注意不是 run（）了）中返回的值，并且必须使用 `ExecutorService.submit()` 方法调用它。
```java
@FunctionalInterface
public interface Callable<V> {
    /**
     * Computes a result, or throws an exception if unable to do so.
     *
     * @return computed result
     * @throws Exception if unable to compute a result
     */
    V call() throws Exception;
}
```

上面说到必须要用到 `ExecutorService.submit()` 对 Callable 进行调用，其返回结果就是一个 Future，该接口如下：
```java
public interface ExecutorService extends Executor {
    ...
    /**
     * Submits a value-returning task for execution and returns a
     * Future representing the pending results of the task. The
     * Future's {@code get} method will return the task's result upon
     * successful completion.
     *
     * <p>
     * If you would like to immediately block waiting
     * for a task, you can use constructions of the form
     * {@code result = exec.submit(aCallable).get();}
     *
     * <p>Note: The {@link Executors} class includes a set of methods
     * that can convert some other common closure-like objects,
     * for example, {@link java.security.PrivilegedAction} to
     * {@link Callable} form so they can be submitted.
     *
     * @param task the task to submit
     * @param <T> the type of the task's result
     * @return a Future representing pending completion of the task
     * @throws RejectedExecutionException if the task cannot be
     *         scheduled for execution
     * @throws NullPointerException if the task is null
     */
    <T> Future<T> submit(Callable<T> task);
}
```
## Object.wait() 和 Object.notify()
在 Java 中，`Object.wait` 和 `Object.notify()`（或 `Object.notifyAll()`) 是一对用于线程间通信的底层机制。
> 注意，这些方法只能在同步代码块或方法中调用，即这些方法的调用必须在对应对象的 synchronized 块或方法内部，因为它们依赖于监视器锁（Monitor Lock）来提供线程间的通信能力和同步控制。（如果在非 synchronized 代码块中使用 wait 或 notify，会抛出异常

这个机制基于 object 对象内置的监视器锁，实现了基本的线程间同步原语。
> 需要注意的是，`wait()` 和 `notify()` 的底层实现都是依赖于 JVM，它们都是 native 方法。


### wait 干了什么
当一个线程调用某对象的 `wait()` 方法时，该线程就会进入该对象的等待池（wait set）中，并且进入 WAITING 状态，释放对该对象的锁（暂时挂起），暂停执行，进入等待状态。

WAITING 状态的线程类似于下面这样
```
"t1" #11 prio=5 os_prio=31 tid=0x00007fe74a208800 nid=0x5fd3 in Object.wait() [0x000000030a19e000]
   java.lang.Thread.State: WAITING (on object monitor)
	at java.lang.Object.wait(Native Method)
	- waiting on <0x000000076ac166b0> (a concurrent.WaitAndNotifyTest$Packet)
	at java.lang.Object.wait(Object.java:502)
	at concurrent.WaitAndNotifyTest.lambda$main$0(WaitAndNotifyTest.java:19)
	- locked <0x000000076ac166b0> (a concurrent.WaitAndNotifyTest$Packet)
	at concurrent.WaitAndNotifyTest$$Lambda$1/1078694789.run(Unknown Source)
	at java.lang.Thread.run(Thread.java:748)
```


### notify 干了什么
当其他线程调用同一对象的 `notify()` 或 `notifyAll()` 时，它会唤醒该对象等待池中等待的一个或所有线程。需要注意的是，线程被唤起后，需要重新竞争锁，只有拿到锁之后，才能开始执行 `wait` 后面的代码。

为什么这么说呢，因为线程被唤醒后，可以理解为会从 `WAITING` 状态转变为 `BLOCKING` 状态，那么阻塞的到底是什么呢？其实就是当前 object 的监视器锁。因为 notify() 执行后，执行 notify() 的线程并不会立马释放对象的监视器锁，而是需要在离开 synchoronized 代码块之后，才会真正释放监视器锁，而只有释放了监视器锁之后，被唤醒的线程才有机会拿到锁。
> 简单总结一句话，就是 notify() 做的不是让线程进入执行状态，而是将它“唤醒”至 BLOCKING 状态，让它有资格去竞争锁

为了验证这一点，我做了一个简单的测试，两个线程 t1 和 t2，其中 t1 进入 wait 状态，t2 执行 notify，在执行 notify 后，利用自循环，不退出 synchorinized ，从而观察 t1 的状态，最后发现为：
```
"t1" #11 prio=5 os_prio=31 tid=0x00007fb01287f800 nid=0x7427 in Object.wait() [0x000000030f75a000]
   java.lang.Thread.State: BLOCKED (on object monitor)
	at java.lang.Object.wait(Native Method)
	- waiting on <0x000000076ac16578> (a concurrent.WaitAndNotifyTest$Packet)
	at java.lang.Object.wait(Object.java:502)
	at concurrent.WaitAndNotifyTest.lambda$main$0(WaitAndNotifyTest.java:19)
	- locked <0x000000076ac16578> (a concurrent.WaitAndNotifyTest$Packet)
	at concurrent.WaitAndNotifyTest$$Lambda$1/1078694789.run(Unknown Source)
	at java.lang.Thread.run(Thread.java:748)
```
确实是 BLOCKED 状态，这也验证了上面的猜想。


另外，通常建议在 wait() 调用的前后使用循环来检查条件，因为线程在被唤醒后仍然需要确认条件是否满足。

下面是一个简单的生产者-消费者的解决方案示例，说明 wait 和 notify 的实际用法
```java

public class Store {
    private int product = 0;

    public synchronized void produce() {
        while (product >= 1) {
            try {
                wait(); // 缓冲区满，则生产者线程等待
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        product++; // 生产产品
        System.out.println("Produced one product. Current products: " + product);
        notify(); // 唤醒在此对象监视器上等待的单个线程（例如，一个消费者线程）
    }

    public synchronized void consume() {
        while (product < 1) {
            try {
                wait(); // 缓冲区空，则消费者线程等待
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        product--; // 消费产品
        System.out.println("Consumed one product. Current products: " + product);
        notify(); // 唤醒在此对象监视器上等待的单个线程（例如，一个生产者线程）
    }
}
```
在这个例子中，生产者方法（produce()）和消费者方法（consume()）都是同步方法，保证了同一时刻只有一个线程可以执行其中的代码。当产品数量达到一定条件时（例如，在这个案例中为大于等于 1 个时），生产者就会调用 wait 方法暂停生产并释放锁，等待消费者消费产品。

反过来，当消费者在缓冲区为空时，会通过调用 wait 来等待生产者生产。总之，通过调用 notify 方法，生产者和消费者可以互相唤醒对方继续执行。

当然，这种通过 wait 和 notify 实现的通信机制，虽然在某些场合非常有用，但是用起来非常复杂，容易出错。因此，在实际开发中，更推荐使用 Java 推荐的高级并发工具，例如 BlockingQueue、Semaphore、CountDownLatch、CyclicBarrier 等，他们能提供更简洁、更高效、更安全的线程间通信方式。

## 面试常问
### 为什么我们启动线程时需要调用 start()，而不是直接调用 run()？

首先，new 一个 thread 后，线程进入了新建状态。调用 start（）方法后，会使该线程进入就绪状态，这时候当线程分配到时间片后就可以运行了，这是真正的多线程工作。

如果我们直接执行 run 方法，其实只是把 run 方法当成 main 线程下的普通方法去执行，并不是在某个线程种执行它，所以并不是多线程工作。

总结： 调用 start 方法方可启动线程并使线程进入就绪状态，而 run 方法只是 thread 的一个普通方法调用，还是在主线程里执行。

### 死锁，活锁，饥饿 分别是什么意思
死锁：指两个或两个以上的进程（或线程）在执行过程中，因争夺资源而造成的一种互相等待的现象，若无外力作用，它们都将无法推进下去。

产生死锁的四个必要条件：
* 互斥条件：所谓互斥就是线程在某一时刻独占资源
* 请求与保持条件：指的是线程因请求资源而暂停时，不会放弃已获得的资源
* 不剥夺条件：进程已获得资源，在未使用完之前，不能强行剥夺。
* 循环等待条件：若干进程之间形成一种头尾相接的循环等待资源关系。

活锁：任务或者执行者没有被阻塞，由于某些特定条件没有被满足，导致一直重复尝试，失败，尝试，失败。在并发应用程序中，通过等待随机长度的时间和回退可以有效避免活锁的发生。

饥饿：一个或者多个线程因为种种原因无法获得所需要的资源，导致一直无法执行的状态。

### `Thread.sleep()` 和 `Object.wait()` 方法的区别和共同点？

**共同点**
* 两者都可以暂停线程的运行，使线程进入 WAITING（或 TIMED_WAITING）状态。

**不同点**
* 两者最主要的区别是：sleep 方法不会释放锁（monitor），而 wait 方法释放了锁（monitor）。
* wait 方法通常被用于线程间交互/通信，sleep 通常用于暂停执行。
* wait 方法被调用后，线程不会自动苏醒，需要别的线程调用同一个对象上的 notify() 方法，或者直接调用 notifyAll() 方法。（notify()会随机苏醒目标对象上等待的某个线程，而 notifyAll() 会苏醒目标对象上所有的线程）。而 sleep 方法执行完毕后，线程会自动苏醒。
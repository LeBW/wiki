# 同步问题

## 线程同步
### 锁
用于限制多线程对共享资源的访问。

锁的原理实现
* 中断关闭与开启。（只适用于单处理器情形）
* 有read-modify-write功能的指令（例如test-and-set, compare-and-swap, etc）。

### 信号量（Semaphore）
PV操作。

生产者消费者模型
```
* mutex = 0
* fullBuffer = 0
* emptyBuffer = numBuffers.
* 注意P操作顺序很重要：必须先对Buffer进行P操作再对mutex进行P操作，防止死锁。
...
```

信号量比锁的功能更丰富，但是：
* 有时使人迷惑，双重功能性（既可以作为锁，也可以作为限制条件）
* 例如，在以上生产者消费者模型中，P的顺序很重要，但是这没有很明显地表现出来。

所以提出概念更清楚的方法：用Lock作为互斥的实现，用Condition Variables作为条件限制的实现。（Monitors）

### Monitor（Lock and Condition Variables)
* `Mutex Lock: m`
* `Condition Variables: c `
    * `wait(c, m) `
        1. 释放互斥锁m
        2. 在`c`的队列中，将此线程从`running-queue`转移到`wait-queue`
        3. 进入`sleep`状态。（等待其他线程的`signal`或者`broadcast`）
        4. 被唤醒后，重新拿回互斥锁`m`，函数结束。
    * `signal(c)`
        * 把`c`的`wait-queue`中的一个线程变成`ready`状态。通常在释放锁之前进行。
    * `broadcast(c)`
        * 将`c`的`wait-queue`中所有线程唤醒，清空`wait-queue`
    * 需要注意的是`condition variables`总是和`mutex lock`配合使用，`mutex lock`用来确保对condition variable的访问是同步的。
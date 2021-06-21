# Java IO
IO 一直是软件开发中的核心部分之一，伴随着海量数据增长和分布式系统的发展，IO 扩展能力愈发重要。幸运的是，Java 平台 IO 机制经过不断完善，虽然在某些方面仍有不足，但已经在实践中证明了其构建高扩展性应用的能力。

我们来看看 Java 中有哪些 IO 方式。

## BIO
首先，有传统的 `java.io` 包，它基于流模式实现，提供了我们最熟知的一些 IO 功能，例如 File 抽象，输入输出流等。交互方式是同步、阻塞的方式，也就是说，在读取输入流或者写入输出流时，在读，写动作完成之前，线程会一直阻塞在那里，它们之间的调用是可靠的线性顺序（所以也被成为 Blocking IO，BIO）。

`java.io` 的好处是代码比较简单，直观，缺点则是 IO 效率和扩展性存在局限性，容易成为应用性能的瓶颈。

很多时候，人们会把 `java.net` 下提供的部分网络 API，比如 Socket，ServerSocket，HttpURLConnection 也归类到同步阻塞 IO 类库，因为网络通信同样是 IO 行为。

我们首先回忆一下传统的服务器端同步阻塞 IO 处理的经典编程模型：
```java
ExecutorService executor = Excutors.newFixedThreadPollExecutor(100);//线程池
ServerSocket serverSocket = new ServerSocket();
serverSocket.bind(8088);
while(!Thread.currentThread.isInturrupted()){//主线程死循环等待新连接到来
    Socket socket = serverSocket.accept();
    executor.submit(new ConnectIOnHandler(socket));//为新的连接创建新的线程
}

class ConnectIOnHandler extends Thread{
    private Socket socket;
    public ConnectIOnHandler(Socket socket){
       this.socket = socket;
    }
    public void run(){
      while(!Thread.currentThread.isInturrupted()&&!socket.isClosed()){ //死循环处理读写事件
          String someThing = socket.read()....//读取数据
          if(someThing!=null){
             ......//处理数据
             socket.write()....//写数据
          }

      }
    }
}
```
这是一个经典的每连接每线程的模型，之所以用多线程，是因为 `socket.accept(), socket.read(), socket.write()` 三个主要函数都是同步阻塞的，当一个连接在处理 IO 时，系统是阻塞的，如果是单线程的话就必然挂死在那里；但是 CPU 是被释放出来的，就可以让 CPU 去处理更多的事情。其实这也是所谓多线程的本质：
1. 利用多核。
2. 当 IO 系统阻塞时，可以利用多线程使用 CPU 资源。

现在的多线程一般都使用线程池，可以让线程的创建和回收成本相对较低。在活动连接数不是特别高（小于单机 1000）时，这种模型是比较不错的，可以让每个连接专注于自己的 IO，并且编程模型简单，也不用过多考虑系统的过载，限流等问题。线程池本身是一个天然的漏斗，可以缓冲一些系统处理不了的连接或请求。

不过，这个模型最本质的问题在于，严重依赖线程。但是线程是很“贵”的资源，主要表现在：
1. 线程的创建和销毁成本较高。在 Linux 这样的操作系统中，线程的创建和销毁都是重量级的系统函数。
2. 线程本身占用较大内存，像 Java 的线程栈，一般至少分配 512K ~ 1M 的空间，如果系统中的线程数目过千，恐怕整个 JVM 的内存都会被吃掉一半。
3. 线程切换的成本较高。操作系统发生线程切换的时候，需要保存线程的上下文，然后执行系统调用（用户态-内核态-用户态）。如果线程数过多，可能执行线程切换的时间甚至会大于线程执行的时间，这时候带来的表现往往是系统负载偏高，CPU sy 使用率特别高（超过 20%），导致系统进入几乎不可用的状态。
4. 容易造成锯齿状的系统负载。因为系统负载是用活动线程数或 CPU 核心数，一旦线程数目高但是外部网络环境不是很稳定，就容易造成大量请求的结果同时返回，激活大量阻塞线程从而导致系统负载压力突然增大。

所以，当面对十万甚至百万级连接时，传统的 BIO 模型是无能为力的。随着移动端应用的兴起和各种网络游戏的盛行，百万级长连接日趋普遍，此时，必然需要一种更高效的 IO 处理模型。下面我们就看看 NIO。
## NIO
在 Java 1.4 中引入了 NIO 框架（`java.nio` 包，Non-Blocking I/O，在 Java 中也叫 New I/O），提供了 Channel、Selector、Buffer 等新的抽象，可以构建多路复用的、同步非阻塞 IO 程序，同时提供了更接近操作系统底层的高性能数据操作方式。

很多刚接触NIO的人，第一眼看到的就是Java相对晦涩的API，比如：Channel，Selector，Socket什么的；然后就是一坨上百行的代码来演示NIO的服务端Demo……瞬间头大有没有？

我们不管这些，抛开现象看本质，先分析下NIO是怎么工作的。

所有的系统 IO 都分为两个阶段：等待就绪和操作。举例来说，读函数，分为系统等待可读和真正的读；同理，写函数分为等待网卡可以写和真正的写。

需要说明的是等待就绪的阻塞是不使用 CPU 的，是在“空等”；而真正的读写操作的阻塞是使用 CPU 的，真正在“干活”。而且这个过程非常快，属于 memory copy，带宽通常在 1GB/s 级别以上，可以理解为基本不耗时。

下面是几种常见 IO 模型的对比：
![io-comparison](./io-comparison.jpg)

以 `socket.read()` 为例：
* 传统的 BIO 里，如果 TCP RecvBuffer 里没有数据，函数会一直阻塞，直到收到数据，返回读到的数据。
* 在 NIO 中，如果 TCP RecvBuffer 有数据，就把数据从网卡读到内存，并且返回给用户；反之直接返回 0，永远不会阻塞。
* 在 最新的 AIO 中会更进一步，不但等待就绪是非阻塞的，就连数据从网卡道内存的过程也是异步的。

换句话说，BIO 里用户最关心“我要读”；NIO 里用户最关心“我可以读了”；AIO 中用户最关心的是 “读完了”。

NIO 一个重要的特点就是：socket 主要的读，写，注册和接收函数，在等待就绪阶段都是非阻塞的，真正的 IO 操作是同步阻塞的（消耗 CPU 但性能非常高）。

## AIO
第三，在 Java 1.7 中，NIO 有了进一步的改进，也就是 NIO 2，引入了异步非阻塞的 IO 方式，也有很多人叫它 AIO（Asynchronous IO）。异步 IO 操作基于事件和回调机制，可以简单理解为，应用操作直接返回，而不会阻塞在那里，当后台处理完成，操作系统会通知相应线程进行后续工作。
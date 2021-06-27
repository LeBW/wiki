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

### NIO 的主要组成部分
首先，熟悉一下 NIO 的主要组成部分：
* Buffer，高效的数据容器，除了布尔类型，所有原始数据类型都有相应的 Buffer 实现。
* Channel，类似在 Linux 操作系统上看到的文件描述符，在 NIO 中被用来支持批量式 IO 操作的一种抽象。
> File 或者 Socket，通常被认为是比较高层次的抽象，而 Channel 则是更加操作系统底层的一种抽象，这也使得 NIO 得以充分利用现代操作系统底层机制，获得特定场景的性能优化，例如，DMA（Direct Memory Access）等。不同层次的抽象是相互关联的，我们可以通过 Socket 获取 Channel，反之亦然。 
* Selector，是 NIO 实现多路复用的基础，它提供了一种高效的机制，可以检测到注册在 Selector 上的多个 Channel 中，是否有 Channel 处于就绪状态，进而实现了单线程对多 Channel 的高效管理。Selector 同样是基于底层操作系统，不同模式，不同版本都存在区别。例如，在最新的代码库里，Linux 上依赖于 epoll，Windows 上 NIO2（AIO）模式则是依赖于 iocp。
* Charset，提供 Unicode 字符串定义，NIO 也提供了相应的编解码器等。例如，通过下面的方式进行字符串到 ByteBuffer 的转换：`Charset.defaultCharset().encode("Hello world!"));`

在极客时间上，作者给出了一个使用 NIO 的例子:
```java
public class NIOServer extends Thread {
    public void run() {
        try (Selector selector = Selector.open();
             ServerSocketChannel serverSocket = ServerSocketChannel.open();) {// 创建Selector和Channel
            serverSocket.bind(new InetSocketAddress(InetAddress.getLocalHost(), 8888));
            serverSocket.configureBlocking(false);
            // 注册到Selector，并说明关注点
            serverSocket.register(selector, SelectionKey.OP_ACCEPT);
            while (true) {
                selector.select();// 阻塞等待就绪的Channel，这是关键点之一
                Set<SelectionKey> selectedKeys = selector.selectedKeys();
                Iterator<SelectionKey> iter = selectedKeys.iterator();
                while (iter.hasNext()) {
                    SelectionKey key = iter.next();
                   // 生产系统中一般会额外进行就绪状态检查
                    sayHelloWorld((ServerSocketChannel) key.channel());
                    iter.remove();
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    private void sayHelloWorld(ServerSocketChannel server) throws IOException {
        try (SocketChannel client = server.accept();) {
            client.write(Charset.defaultCharset().encode("Hello world!"));
        }
    }
   // 省略了与前面类似的main
}
```
这个非常精简的样例掀开了 NIO 多路复用的面纱，我们可以分析下主要步骤和元素：
* 首先，通过 Selector.open() 创建一个 Selector，作为类似调度员的角色。
* 然后，创建一个 ServerSocketChannel，并且向 Selector 注册，通过指定 SelectionKey.OP_ACCEPT，告诉调度员，它关注的是新的连接请求。注意，为什么我们要明确配置非阻塞模式呢？这是因为阻塞模式下，注册操作是不允许的，会抛出 IllegalBlockingModeException 的异常。
* Selector 阻塞在 select 方法。当有 Channel 发生接入请求，就会被唤醒。
* 在 sayHelloWorld 方法中，通过 SocketChannel 和 Buffer 进行数据操作，在本例中是发送了一段字符串。

可以看到，NIO 是利用了单线程轮询事件的机制，通过高效地定位就绪的 Channel，来决定做什么，仅仅 select 阶段是阻塞的，可以有效避免大量客户端连接时，频繁线程切换带来的问题，应用的扩展能力有了非常大的提高。

### 如何结合事件模型使用 NIO 同步非阻塞性质
回忆 BIO 模型，之所以需要多线程，是因为在进行 I/O 操作的时候，一是没有办法知道到底能不能写、能不能读，只能”傻等”，即使通过各种估算，算出来操作系统没有能力进行读写，也没法在 `socket.read()` 和 `socket.write()`函数中返回，这两个函数无法进行有效的中断。所以除了多开线程另起炉灶，没有好的办法利用 CPU。

NIO 的读写函数可以立即返回，这就给我们不开线程利用 CPU 的最好机会：如果一个连接不能读写（`socket.read()` 返回 0 或者 `socket.write` 返回 0），我们可以把这件事记下来，记录的方式通常是在 Selector 上注册标记位，然后切换到其他就绪的连接（channel）进行读写。

下面具体看看如何利用事件模型单线程处理所有 IO 请求：

NIO 的事件主要有几个：读就绪、写就绪、有新连接到来。

首先，我们首先需要注册这几个事件到来的时候所对应的处理器，然后在合适的时候告诉事件选择器：我对这个事件感兴趣
* 对于写操作，就是写不出去的时候对写事件感兴趣。
* 对于读操作，就是完成连接和系统没有办法承载新读入的数据时。
* 对于 accept，一般是服务器刚启动的时候。
* 对于 connect，一般是 connect 事件失败需要重连或者直接异步调用 connect 的时候。

其次，我们需要用一个死循环选择就绪的事件（这里会执行系统调用，Linux 2.6 之前是 select，poll，2.6 之后 是 epoll，Windows 是 IOCP），还会阻塞的等待新事件到来。
新事件到来的时候，会在 selector 上标记注册位，标识可读，可写或有连接到来。

注意，select 是阻塞的，无论是通过操作系统的通知（epoll）还是不停的轮询（select，poll），这个函数是阻塞的。所以我们可以放心大胆地在一个 `while (true)` 里面调用这个函数而不用担心 CPU 空转。

所以我们的程序大概模样是：
```java
interface ChannelHandler{
    void channelReadable(Channel channel);
    void channelWritable(Channel channel);
}

class Channel{
    Socket socket;
    Event event;//读，写或者连接
}

//IO线程主循环:
class IoThread extends Thread {
    public void run() {
        Channel channel;
        while (channel = Selector.select()) {//选择就绪的事件和对应的连接
            if (channel.event == accept) {
                registerNewChannelHandler(channel);//如果是新连接，则注册一个新的读写处理器
            }
            if (channel.event == write) {
                getChannelHandler(channel).channelWritable(channel);//如果可以写，则执行写事件
            }
            if (channel.event == read) {
                getChannelHandler(channel).channelReadable(channel);//如果可以读，则执行读事件
            }
        }
    }
    Map<Channel，ChannelHandler> handlerMap;//所有channel的对应事件处理器
}
```

这个程序很简单，也是最简单的 Reactor 模式；注册所有感兴趣的事件处理器，单线程轮询就绪事件，执行事件处理器。

### 优化线程模型
由上面的示例我们大概可以总结出 NIO 是怎么解决掉线程的瓶颈并处理海量连接的：
NIO 由原来的阻塞读写（占用线程）变成了单线程轮询事件，找到可以进行读写的网络描述符进行读写。除了事件的轮询是阻塞的（没有可干的事情时必须要阻塞），剩余的 IO 操作都是纯 CPU 操作，没有必要开启多线程。

并且由于线程的节约，连接数大的时候因为线程的切换带来的问题也随之解决，进而为处理海量连接提供了可能性。

单线程处理 IO 的效率的确非常高，没有线程切换，只是拼命的读，写，选择事件。但是现在的处理器，多是多核处理器，如果能够利用多核心进行 IO，无疑会对效率有更大的提升。

仔细分析一下我们需要的线程，其实主要包括以下几种：
1. 事件分发器，单线程选择就绪的事件。
2. IO 处理器，包括 connect，read，write 等，这种纯 CPU 操作，一般开启 CPU 核心个线程就可以。
3. 业务线程，在处理完 IO 后，业务一般还会有自己的业务逻辑，有的还会需要其他的阻塞IO，如 DB 操作，RPC 等。**只要有阻塞，就需要单独的线程。**

Java 的 Selector 对于 Linux 系统来说，还有一个致命的限制：同一个 channel 的 select 不能被并发调用。因此，如果有多个 IO 线程，必须保证：**一个 socket 只能属于一个 IoThread，而一个 IoThread 可以管理多个 socket。**

另外，连接的处理和读写的处理通常可以选择分开，这样对于海量连接的注册和读写就可以分发。虽然 `read()` 和 `write()` 是比较高效无阻塞的函数，但毕竟会占用 CPU，如果面对更高的并发则无能为力。

![nio-model](./nio-model.png)

通过上面的分析，可以看出 NIO 在服务端对于解放线程，优化 I/O 和处理海量连接方面，确实有自己的用武之地。那么在客户端上，NIO 又有什么使用场景呢?

常见的客户端BIO+连接池模型，可以建立n个连接，然后当某一个连接被I/O占用的时候，可以使用其他连接来提高性能。
但多线程的模型面临和服务端相同的问题：如果指望增加连接数来提高性能，则连接数又受制于线程数、线程很贵、无法建立很多线程，则性能遇到瓶颈。

### 每连接顺序请求的 Redis
对于 Redis 来说，由于服务端是全局串行的，能够保证同一连接的所有请求与返回顺序一致。这样可以使用单线程 + 队列，把请求数据缓冲。然后 pipeline 发送，返回 future；然后 channel 可读时，直接在队列中把 future 取回来，done() 就可以了。

伪代码如下：
```java
class RedisClient Implements ChannelHandler{
    private BlockingQueue CmdQueue;
    private EventLoop eventLoop;
    private Channel channel;
    class Cmd {
        String cmd;
        Future result;
    }
    public Future get(String key){
        Cmd cmd= new Cmd(key);
        queue.offer(cmd);
        eventLoop.submit(new Runnable(){
            List list = new ArrayList();
            queue.drainTo(list);
            if(channel.isWritable()){
                channel.writeAndFlush(list);
            }
        });
    }
    public void ChannelReadFinish(Channel channel，Buffer Buffer){
        List result = handleBuffer();//处理数据
        //从cmdQueue取出future，并设值，future.done();
    }
    public void ChannelWritable(Channel channel){
        channel.flush();
    }
}
```

这样做，可以充分利用 pipeline 来提高 IO 能力，同时获取异步处理能力。

### 多连接短连接的 HttpClient
类似于竞对抓取的项目，往往需要建立无数的 HTTP 短连接，然后抓取，然后销毁，当需要单机抓取上千网站，线程数又受到限制的时候，该怎么保证性能呢？

这里就可以尝试 NIO，单线程进行连接，写，读操作。如果连接，读，写操作系统没有办法处理，简单的注册一个事件，等待下次循环就好了。

如何存储不同的请求/响应呢？由于http是无状态没有版本的协议，又没有办法使用队列，好像办法不多。比较笨的办法是对于不同的socket，直接存储socket的引用作为map的key。

### 常见的 RPC 框架，如 Thrift，Dubbo
这种框架内部一般维护了请求的协议和请求号，可以维护一个以请求号为key，结果的result为future的map，结合NIO+长连接，获取非常不错的性能。

## AIO
第三，在 Java 1.7 中，NIO 有了进一步的改进，也就是 NIO 2，引入了异步非阻塞的 IO 方式，也有很多人叫它 AIO（Asynchronous IO）。异步 IO 操作基于事件和回调机制，可以简单理解为，应用操作直接返回，而不会阻塞在那里，当后台处理完成，操作系统会通知相应线程进行后续工作。AIO 实现看起来是类似这样：
```java
AsynchronousServerSocketChannel serverSock = AsynchronousServerSocketChannel.open().bind(sockAddr);
serverSock.accept(serverSock, new CompletionHandler<>() { //为异步操作指定CompletionHandler回调函数
    @Override
    public void completed(AsynchronousSocketChannel sockChannel, AsynchronousServerSocketChannel serverSock) {
        serverSock.accept(serverSock, this);
        // 另外一个 write（sock，CompletionHandler{}）
        sayHelloWorld(sockChannel, Charset.defaultCharset().encode
                ("Hello World!"));
    }
  // 省略其他路径处理方法...
});
```

鉴于其编程要素（如 Future、CompletionHandler 等），我们还没有进行准备工作，这里先与上面 NIOServer 的例子进行概念性的对比：
* 基本抽象很相似，AsynchronousServerSocketChannel 对应上面例子中的 ServerSocketChannel；AsynchronousSocketChannel 则对应 SocketChannel。
* 业务逻辑的关键在于，通过指定 CompletionHandler 回调接口，在 accept/read/write 等关键节点，通过事件调用机制，这是非常不同寻常的一种编程思路。

### Proactor 与 Reactor
上面说的这种，其实是 Proactor 模型。
一般情况下，I/O 复用机制需要事件分发器（event dispatcher）。 事件分发器的作用，即将那些读写事件源分发给各读写事件的处理者，就像送快递的在楼下喊: 谁谁谁的快递到了， 快来拿吧！开发人员在开始的时候需要在分发器那里注册感兴趣的事件，并提供相应的处理者（event handler)，或者是回调函数；事件分发器在适当的时候，会将请求的事件分发给这些handler或者回调函数。

涉及到事件分发器的两种模式称为：Reactor 和 Proactor。 Reactor 模式是基于同步 I/O 的，而 Proactor 模式是和异步 I/O 相关的。
* 在 Reactor 模式中，事件分发器等待某个事件或者可应用或个操作的状态发生（比如文件描述符可读写，或者是 socket 可读写），事件分发器就把这个事件传给事先注册的事件处理函数或者回调函数，由后者来做实际的读写操作。
* 而在 Proactor 模式中，事件处理者（或者代由事件分发器发起）直接发起一个异步读写操作（相当于请求），而实际的工作是由操作系统来完成的。发起时，需要提供的参数包括用于存放读到数据的缓存区、读的数据大小或用于存放外发数据的缓存区，以及这个请求完后的回调函数等信息。事件分发器得知了这个请求，它默默等待这个请求的完成，然后转发完成事件给相应的事件处理者或者回调。举例来说，在 Windows 上事件处理者投递了一个异步 IO 操作（称为overlapped 技术），事件分发器等 IO Complete 事件完成。这种异步模式的典型实现是基于操作系统底层异步 API 的，所以我们可称之为“系统级别”的或者“真正意义上”的异步，因为具体的读写是由操作系统代劳的。

举个例子，将有助于理解 Reactor 与 Proactor 二者的差异，以读操作为例（写操作类似）：

在 Reactor 模式中实现读：
* 注册读就绪事件和相应的事件处理器。
* 事件分发器等待事件。
* 事件到来，激活分发器，分发器调用事件对应的处理器。
* 事件处理器完成实际的读操作，处理读到的数据，注册新的事件，然后返还控制权。

在 Proactor 模式中实现读：
* 处理器发起异步读操作（注意，操作系统必须支持异步 IO）。在这种情况下，处理器无视 IO 就绪事件，它关注的是完成事件。
* 事件分发器等待操作完成事件。
* 在分发器等待过程中，操作系统利用并行的内核线程执行实际的读操作，并将结果存储在用户自定义的缓存区，最后通知事件分发器读操作完成。
* 事件分发器呼唤处理器。
* 事件处理器处理用户自定义缓冲区中的数据，然后启动一个新的异步操作，并将控制权返回事件分发器。

可以看出，两个模式的相同点，都是对某个 I/O 事件的事件通知（即告诉某个模块，这个I/O操作可以进行或已经完成)。在结构上，两者也有相同点：事件分发器负责提交IO操作（异步)、查询设备是否可操作（同步)，然后当条件满足时，就回调 handler；不同点在于，异步情况下（Proactor)，当回调handler时，表示I/O操作已经完成；同步情况下（Reactor)，回调handler时，表示I/O设备可以进行某个操作（can read 或 can write)。




# 参考
[美团技术 - Java NIO 浅析](https://tech.meituan.com/2016/11/04/nio.html)
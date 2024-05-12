# Jetty
这里以 Jetty 8.2 为例，介绍 Jetty 的模型。

Jetty 的架构如下图所示

![Jetty](./jetty.png)

Jetty 的主类是 `org.eclipse.jetty.server.Server`. 看一下里面的关键字段和方法
```java
public class Server extends HandlerWrapper implements Attributes
{
    // Server 使用的线程池
    private ThreadPool _threadPool;
    // connector 是用来接受 HTTP 请求的连接器（一个 Server 可以有多个 connector，可以理解为能够监听多个端口，但是他们是共用一个线程池的）
    private Connector[] _connectors;

    // 构造方法，port代表需要监听的端口
    public Server(int port)
    {
        setServer(this);

        Connector connector=new SelectChannelConnector();
        connector.setPort(port);
        setConnectors(new Connector[]{connector});
    }

    @Override
    protected void doStart() throws Exception {
        ...
    }
```

从上面的关键信息可以看出，如果要开启一个 Jetty 服务器，可以使用类似以下的写法
```java
Server server = new Server(8080);
server.start();
```


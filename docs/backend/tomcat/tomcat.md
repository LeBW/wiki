# Tomcat

* Tomcat是一个完全由Java实现的Web服务器，也就是说，它的作用是使一些页面、文件等能够通过网络供他人访问，与Nginx，Apache HTTP Server一样，都属于Web Server。
* 与Nginx，apache HTTP Server等相比，Tomcat能够动态生成资源并且返回至客户端，而Nginx等只能够将静态资源提供给客户端。
* Tomcat是利用Java程序来动态生成资源并且返回至客户端的。其中所运用的技术叫做Java Servlet，以及由此衍生出来的Java Server Pages（JSP）技术，也就是说，我们可以将Tomcat看作支持运行Servlet/JSP应用程序的容器（Container）。
* Tomcat运行于JVM之上，它和其他的HTTP服务器一样，绑定IP地址并监听TCP端口，同时还包含以下职责
    * 管理Servlet应用程序的生命周期。
    * 将URL映射到指定的Servlet进行处理。
    * 与Servlet合作处理HTTP请求——Tomcat根据原始HTTP请求生成HTTPServletRequest对象并传递给相应的Servlet进行处理，Servlet处理完成后将HTTPServletResponse返回给Tomcat，Tomcat利用该Response生成原始HTTP Response返回给客户端。
* 虽然Tomcat也是Web服务器，但通常它仍然会和Nginx配合在一起使用，其原因主要如下
    * 动静态资源分离——运行Nginx的反向代理功能分发请求：例如将所有动态资源请求交给Tomcat，而静态资源请求直接由Nginx返回到浏览器，这样可以减轻Tomcat的压力。
    * 负载均衡——Nginx拥有负载均衡功能，当业务压力增大时，可以启动多个Tomcat实例，然后利用Nginx的负载均衡功能将请求通过相应的策略分发到不同的实例。
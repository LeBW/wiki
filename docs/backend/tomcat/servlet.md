# Servlet
## 思维导图
Servlet的知识点可以用以下思维导图概括.
![servlet-knowledge](./servlet-knowledge.png).

## Servlet介绍
* 一个 Servlet 是在Web容器里运行的一个小型java程序。
* Servlet从Web客户端接受请求并产生回复，一般来说是通过HTTP协议进行通信。
* Servlet API 存在于 `javax.servlet` 包中，声明了相关方法；而在包 `javax.servlet.http` 中则定义了与HTTP有关的 Servlet 方法，例如 HttpServlet，HttpFilter，HttpSession，Cookie 等。

## Servlet生命周期
在Servlet的生命周期中，有三个重要的方法，分别是
 * `public void init(ServletConfig config);`
 * `public void service(ServletRequest req, ServletResponse res);`
 * `public vod destroy();`。
 
 每一个Servlet都应该实现这三个方法，这三个方法会在特定的时候被Servlet容器进行调用（这里的Sevlet容器，一般来说会是Web容器，比如Tomcat等）。

* Web容器在对Servlet进行实例化后，会调用它的init函数，对其进行一些必要的初始化操作。只有init函数成功执行后，这个Servlet才能开始进行处理请求的工作。
* 初始化操作完成后，这个servlet实例就可以开始进行请求处理了。每一个请求（Request）都会在一个单独的线程中进行处理。对于每一个请求，Web容器会调用相应Servlet的`service()`方法进行处理。值得注意的时，由于web容器往往会让servlet在多线程环境下并发处理请求，因此开发者需要注意共享资源等的访问。
* 最后，当Servlet容器决定将某个servlet退出服务时，会执行它的`destroy()`方法。只有当所有线程中该servlet的`service()`方法都执行完毕后，才能执行`destroy`方法。一般来说，这个方法可以用来释放资源，并且做一些状态持久化的操作。

一个典型的使用场景
1. 用户通过HTTP请求访问一个URL。
    * 浏览器产生一个HTTP请求
    * 请求被发送到合适的服务器
2. HTTP请求被Web服务器接受，转发至相应的Servlet容器。
    * 容器将该请求转发至相应的servlet
    * 该servlet被加载至容器的内存中
3. 容器触发servlet的init方法
    * 只有servlet首次被加载至内存中的时候，需要执行init方法。
    * 可以通过`servletConfig`传递参数，从而让servlet配置自己
4. 容器执行servlet的service方法。
    * 该方法用来处理HTTP请求
    * servlet读取HTTP请求的数据，并产生一个Response返会。
5. 该servlet保留在容器内存中，能够继续处理收到的HTTP请求。
    * 每个request都会触发相应servlet的service函数。
6. 在某个时刻，容器可能会决定将servlet从其内存中卸载。
    * 不同的servlet容器可能有不同的算法。
7. 卸载前，容器首先会调用servlet的destroy方法，用以释放资源，以及进行必要的持久化等操作。
8. 卸载后，为该servlet分配的内存以及相应对象，可以被GC进行回收了。

## ServletConfig

## ServletContext

## Request

## Response

## Cookie

## Session

## Filter
Java类实现了Filter接口，就被称为过滤器。Filter接口内有三个方法：
1. `void init(FilterConfig var1) throws ServletException`;
2. `void  doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException,ServletException`;
3. `void destroy()`; 

其中主要的方法为doFilter(). FilterChain为一个接口，里面又定了doFilter方法，其原因是：过滤器不仅有一个，在Java中使用了链式结构管理过滤器，把所有过滤器放在一个链式结构内。上一个过滤器在doFilter方法中调用chian的doFilter方法，以执行下一个过滤器（如果没有过滤器了，则执行目标资源）。

过滤器的执行顺序：
* 过滤器的执行顺序是看web.xml文件中mapping的先后顺序的。如果放在注解中配置，则比较urlPattern的字符串优先级。
* 过滤器是“嵌套”执行的。假设现在有Filter1，Filter2，那么执行顺序为：

<center>过滤器1开始执行 -> 过滤器2开始执行 -> 执行目标资源 -> 过滤器2执行完毕 -> 过滤器1执行完毕</center>

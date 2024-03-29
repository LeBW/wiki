# HTTP

## Cookie
* 浏览器访问服务器，如果服务器需要记录该用户的状态，就使用Response向浏览器发送一个Cookie，浏览器会把Cookie保存起来，当浏览器再次访问服务器的时候，会在请求头部放入该Cookie。
* Cookie对象为key-value形式，同时包含其他属性。
* Cookie不可跨域。浏览器判断一个网址能否操作另一个网站的Cookie依据是域名。
* Cookie的属性
    * Max-Age：代表cookie失效的时间，单位为秒。 
        * 如果值为正数，浏览器会把cookie写入硬盘，在MaxAge结束前登陆该网站时cookie都是有效的；
        * 如果值为负数，则该cookie是临时性的，存在内存中，仅在本次会话中有效，关闭浏览器后该cookie就失效了。
        * 如果值为0，表示删除该cookie。
    * Domain：决定运行访问Cookie的域名。形式为”.domain”.
        * 默认情况下，Cookie是不能跨域名的，即使是同一级域名，不同二级域名也不能交接，例如颁发给www.google.com‘的Cookie不会在访问 www.image.google.com时被带上。
        * 若希望一级域名相同的网页Cookie互相访问，需要用到domain属性，例如在以上例子中，若将cookie的domain属性设置为”.google.com”，那么只要一级域名是”google.com”的网页都可以使用该Cookie。
    * Path：决定允许访问Cookie的路径。
        * 默认情况下，Cookie在该域名下所有URL都可以使用。
        * 设置path属性后，只允许符合该path的URL可以使用。例如将path设置为”/path”后，只有”/path”开头的URL才能使用该Cookie。
    * Comment: 描述该Cookie的作用。当浏览器需要把Cookie呈现给用户看时，该属性会发挥作用。
    * secure：boolean变量。默认为false。当设为true时，该Cookie只会在安全协议下才会使用，例如HTTPS协议。
    * HttpOnly：boolean变量。默认为false。当为true时，该Cookie不能被脚本所使用了。也就是浏览器的document对象中看不到该cookie了，使该cookie不能被脚本所使用。提升了网页的安全性。
* 修改Cookie：当Response中set-cookie的cookie名称与已有cookie相同时，新的cookie会覆盖旧的cookie。
    * 注意：新建的Cookie除了value和max-age外所有的属性都要与原Cookie相同，否则浏览器会视为不同的Cookie，不予覆盖。

## Session

* Session是另一种记录浏览器状态的机制。不同的是Cookie保存在浏览器中，Session的具体内容保存在服务器中。
* Session比Cookie使用更方便，可以解决Cookie解决不了的事情（Session 可以存储对象，Cookie只能存储字符串）。
* Session是何时被创建的：
    * 用户第一次访问服务器中的Servlet实例，并且Servlet中调用了HttpServletRequest.getSession()这样的语句时，Session会被创建。
    * 用户第一次访问jsp等动态资源时，如果没有显式地使用<%@page session=“false”%>，jsp就会在被编译成Servlet时自动创建Session。
    * 访问html等静态资源时，Session不会被创建。
* Session生成后，只要用户继续访问该Servlet，Servlet就会更新该Session最后被访问的时间，无论是否对Session进行读写，都认为Session活跃了一次。
* 由于也越来越多的用户访问该Servlet，因此Session会越来越多。Session的默认超时时间时30分钟。也就是当某Session30分钟没有活跃时，会被自动销毁。
* Session的实现原理：
    * Session创建完毕后，会产生一个Session ID。服务器将Session ID设置为Cookie，名为JSSESIONID，传送给浏览器。浏览器下次访问该资源时会带上该Cookie，服务器根据Cookie值来读取相应的Session。
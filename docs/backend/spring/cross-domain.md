# 同源政策与跨域
浏览器安全的基石是“同源策略”（same-origin policy）。在理解跨域问题之前，先看看同源策略。

## 同源策略
同源策略是由 Netscape 公司在 1995 年引入浏览器的。目前，所有浏览器都实行这个政策。

最初，它的含义是指：A网页设置的 Cookie，B网页不能打开，除非这两个网页同源。所谓同源指的是“三个相同”。
* 协议相同
* 域名相同
* 端口相同

举例来说，`http://www.example.com/dir/page.html` 这个网址，它的协议是 `http://`, 域名是 `www.example.com`，端口是 `80`。它的同源情况如下：
* `http://www.example.com/dir2/other.html` 同源
* `http://example.com/dir/other.html` 不同源，域名不同
* `http://v2.www.example.com/dir/other.html` 不同源，域名不同
* `http://www.example.com:81/dir/other.html` 不同源，端口不同

同源政策的目的是为了保证用户的信息安全，防止恶意网站窃取数据。

设想一种情况，A网站是一家银行，用户登录之后，又去浏览其他网站。如果其他网站可以阅读A网站的 Cookie，会发生很严重的事故。

因此，“同源政策”是必须的，否则 Cookie 可以共享，互联网就毫无安全可言了。

### 限制范围

随着互联网的快速发展，同源政策越来越严格。目前，如果非同源，共有三种行为受到限制：
* Cookie，LocalStorage 和 IndexDB 无法读取。
* DOM 无法获得。
* AJAX 请求不能发送。

这些限制是必要的。但是有些情况下，这些限制会导致不方便，合理的用途也会受到影响。下面我们看看如何规避这些限制。

### Cookie
首先看看 Cookie。Cookie 是服务器写入浏览器的一小段信息，只有同源网页才能共享。但是，当两个网页的一级域名相同，只是二级域名不同时，浏览器允许通过设置`document.domain`来共享 Cookie。

另外，服务器也可以在设置 Cookie 的时候，指定 Cookie 的所属域名为一级域名，例如 `.example.com`。
```
Set-Cookie: key=value; domain=.example.com; path=/
```
这样的话，二级域名和三级域名不用做任何设置，都可以读取这个 Cookie。

> 注意，在 Set-Cookie 时，`domain` 属性是可选的。如果没有指定它，那么默认是当前 URL 的域名，并且子域名是不包括的；如果指定了它，那么所有子域名都是包括在内的。

另外，以上方法仅适用于 Cookie 的共享，不适用于 LocalStorage 和 IndexDB。其他方法可参阅 [这里](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html).

### CORS
同源政策规定，AJAX 只能发送给同源的网址，否则报错。如果我们需要给不同源的网址发送 AJAX 请求，可以使用 跨站资源分享（Cross-Origin Resource Sharing，CORS）。它是 W3C 标准，是解决跨源AJAX请求的根本解决方案。

CORS 需要服务器和浏览器同时支持。对于浏览器端，整个 CORS 通信过程都由浏览器自动完成，不需要用户参与。对于开发者来说，CORS 通信与同源的 AJAX 通信没有差别，代码完全相同。浏览器一旦发现 AJAX 请求是跨源的，就会自动添加一些附加的头部信息，有时还会多出一次附加的请求，但用户不会有感觉。

因此，实现 CORS 的关键是服务器。只要服务器实现了 CORS 接口，并且浏览器支持，就可以跨源通信。

#### 两种请求
浏览器将 CORS 请求分为两类：简单请求（Simple Request）和非简单请求（not-so-simple request).

如果同时满足以下两大条件，就属于简单请求。
```
(1) 请求方法是以下三种之一：
* HEAD
* GET
* POST
(2) HTTP 头信息不超出以下几种字段：
* Accept
* Accept-Language
* Content-Language
* Last-Event-ID
* Content-Type: 仅限于三个值 application/x-www-form-urlencoded, multipart/form-data, text/plain
```
凡是不同时满足以上两个条件，就属于非简单请求。浏览器对简单请求和非简单请求的处理是不一样的。

##### 简单请求
对于简单请求，浏览器的策略是直接发送 CORS 请求。具体来说，浏览器会在请求的头部信息中添加一个 Origin 字段。

下面一个例子，就是一个简单请求，浏览器发现这个 AJAC 是一个简单请求，就自动在头部信息中添加 Origin 字段。
```http
GET /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```
上面的头信息中，Origin 字段用来说明，本次请求来自哪个源（协议+域名+端口）。服务器会根据这个值，来决定是否同意这次请求。

如果 Origin 指定的源，不在许可范围内，服务器会返回一个正常的HTTP回应。浏览器发现，这个回应的头部信息中没有包含 `Access-Control-Allow-Origin`字段，就知道服务器不支持 CORS 或者 该请求的Origin不在服务器的允许范围内，因此浏览器抛出一个错误，被 `XMLHttpRequest`的`onerror`回调函数捕获。

如果 Origin 指定的源，在许可范围内，服务器返回的响应，会多出几个头信息字段：
```http
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
Content-Type: text/html; charset=utf-8
```
上面的头部信息中，有三个与 CORS 有关，都以 `Access-Control-`开头。

`Access-Control-Allow-Origin`字段是必须的，它的值要么是请求时 Origin 的值，要么是一个`*`，表示接受任何域名的请求。

`Access-Control-Allow-Credentials`是可选的。它的值是布尔值，表示是否允许发送 Cookie。默认情况下，Cookie 不包含在 CORS 请求中。设为 `true` 后，即表示服务器明确许可，Cookie 可以包含在请求中，一起发送给服务器。这个值只能被设为 true，如果服务器不要浏览器发送 Cookie，删除该字段即可。

`Access-Control-Expose-Headers`是可选的。对于一般的 CORS 请求，`XMLHttpRequest`的`getResponseHeader()`方法只能拿到6个基本字段：`Cache-Control`, `Content-Language`, `Content-Type`, `Expires`, `Last-Modified`, `Pragma`。如果想拿到其他字段，就必须在`Access-Control-Expose-Headers`字段中指定。例如上面的例子中，`getResponseHeader('FooBar')`就可以返回`FooBar`字段的值。

另外，上面提到 CORS 请求默认不发送 Cookie 和 HTTP 认证信息。如果要把 Cookie 发送给服务器，一方面要服务器同意，指定 `Access-Control-Allow-Credentials`为`true`，另一发面，开发者也必须在 AJAX 请求中打开 withCredentials 属性：
```javascript
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

否则，即使服务器同意发送 Cookie，浏览器也不会发送。或者，服务器要求设置 Cookie，浏览器也不会处理。

需要注意的是，如果要发送 Cookie，`Access-Control-Allow-Origin`的值就不能设为 `*`，而必须指定明确的，与请求网页一致的域名。同时，Cookie 依然遵循同源策略，只有用服务器域名设置的 Cookie 才会上传，其他域名的 Cookie 不会上传，且（跨域）原网页代码中的`document.cookie`也无法读取服务器域名下的Cookie。

##### 非简单请求
非简单请求是那种对服务器有特殊要求的请求，比如请求方法是 `PUT` 或 `DELETE`，或者 `Content-Type`字段的类型是 `application-json`。

对于非简单请求，浏览器会在正式通信之前，增加一次 HTTP 查询请求，被称为 预检请求（preflight）。

浏览器首先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 HTTP 动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的 `XMLHttpRequest` 请求，否则就报错。

下面是一段浏览器的 Javascript 脚本：
```javascript
var url = 'http://api.alice.com/cors';
var xhr = new XMLHttpRequest();
xhr.open('PUT', url, true);
xhr.setRequestHeader('X-Custom-Header', 'value');
xhr.send();
```

上面代码中，HTTP请求的方法是 PUT，而且发送了一个自定义头部信息 `X-Custom-Header`。

浏览器发现，这是一个非简单请求，于是发出一个预检请求，要求服务器确认可以这样请求。下面是这个预检请求的HTTP头信息.
```http
OPTIONS /cors HTTP/1.1
Origin: http://api.bob.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.alice.com
Accept-Language: en-US
Connetion: keep-alive
User-Agent: ...
```
预检请求用的请求方法是 OPTIONS，表示这个请求是用来询问的。头信息里，关键字段是 Origin，表示请求来自哪个源。

除了 Origin，请求中还有两个特殊字段：
* `Access-Control-Request-Method`字段是必须的，用来列出浏览器的 CORS 请求会用到哪些方法。
* `Access-Control-Request-Headers`字段是可选的，是一个逗号分割的字符串，指定浏览器 CORS 请求还会额外发送的头部字段。

服务器收到预检请求后，检查了 `Origin`, `Access-Control-Request-Method`, `Access-Control-Request-Headers`三个字段后，如果确认允许跨域请求，就可以作出回应。
```http
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```
上面的 HTTP 回应中，关键的是 `Access-Control-Allow-Origin`字段，表示 `http://api.bob.com` 可以请求该数据。其他字段意义同理。

一旦服务器通过了预检请求，以后浏览器每次发送正常的 CORS 请求，就都跟简单请求一样，会有一个 `Origin` 头信息字段。服务器的回应，也都会有一个 `Access-Control-Allow-Origin` 头信息字段。

总结，CORS 与 JSONP 的目的相同，但是比 JSONP 更强大。

JSONP 只支持 GET 请求，CORS 支持所有类型的 HTTP 请求。JSONP 的优势在于支持老式游览器，以及可以向不支持 CORS 的网站请求数据。

Spring 中已经实现了 CORS 相关功能，配置即可。

## 参考资料
[跨域资源共享 CORS 详解 - 阮一峰](http://www.ruanyifeng.com/blog/2016/04/cors.html)
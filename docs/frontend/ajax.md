# Ajax
Ajax(Asynchronous Javascript and XML) 异步Javascript和XML，主要作用是使客户端在不必刷新整个浏览器的情况下，与服务器进行异步通讯的技术。

## XMLHttpRequest
XMLHttpRequest对象是Ajax中最重要的一个对象。浏览器首先把请求发送到XMLHttpRequest异步对象中，异步对象对请求进行封装，然后再发送给服务器。服务器并不是以转发的形式回应，而是以流的方式把数据返回给浏览器。

下面介绍该对象的方法和属性。
### 方法
`open(String method, String url, boolean asynch, String username, String password)`
* method指定提交方式（post，get）
* url指定请求发送的地址
* asynch指定是异步还是同步，true表示异步，false表示同步
* username, password是可选参数，在http认证时会用到。

`setRequestHeader(String header, String value)`
* 设置请求头部。

`send(content)`
* 发送请求给服务器。如果是get方式，不需要填参数；如果是post，要把提交的内容填上去。

### 属性
* `onreadystatechange`: 请求状态改变时的事件触发器（`readyState`变化时会调用此方法），一般用于指定回调函数。
* `readyState`：代表请求的状态，数字类型。有5个状态：
    * 0: 未初始化
    * 1: open方法成功调用后
    * 2: 服务器已经应答客户端的请求
    * 3: 交互中。HTTP头部已经接受，响应数据尚未接受
    * 4: 数据接收完成。
* `responseText`: 服务器返回的文本内容。
* `responseXML`：服务器返回的兼容DOM的XML内容。
* `status`：服务器返回的状态码。
* `statusText`：服务器返回的状态码的文本信息。
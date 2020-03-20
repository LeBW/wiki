# Mysql

## Mysql和SQLite区别
* SQLITE功能简约，小型化，追求最大磁盘效率
* MYSQL功能全面，综合化，追求最大并发效率。
如果只是单机上用的，数据量不是很大，需要方便移植或者需要频繁读/写磁盘文件的话，就用SQLite比较合适；如果是要满足多用户同时访问，或者是网站访问量比较大是使用MYSQL比较合适。

## Mysql 远程访问问题
1. 设置 `bind_address`。

首先要确保 `[mysqld]`中`bind_address` 参数设置为 `0.0.0.0`（或者直接注释掉这一行）。

在 Ubuntu 16.04 + Mysql 5.7 搭配中，该参数的配置位于 `/etc/mysql/mysql.conf.d/mysqld.cnf`中。

检查这一步做好的方法就是通过 `netstat -tunlp | grep mysql` 的方式来确认 `mysqld` 进程绑定的地址是 `0.0.0.0` 而不是 `127.0.0.1`。
 
2. 设置用户权限。

首先我们可以查看当前数据库中用户在不同IP地址下的访问情况。
```
mysql> use mysql;
Database changed
mysql> select host, user from user;
+-----------+------------------+
| host      | user             |
+-----------+------------------+
| localhost | debian-sys-maint |
| localhost | mysql.session    |
| localhost | mysql.sys        |
| localhost | root             |
+-----------+------------------+
```
以上信息说明，对于 root 用户，现在只能在 localhost 下访问。

现在假设我们要对 root 用户赋予所有所有IP下的访问权限，则可以在 Mysql 中运行以下命令
```
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'password';
```

接下来我们再通过以上命令查看用户的访问情况
```
mysql> select host,user from user;
+-----------+------------------+
| host      | user             |
+-----------+------------------+
| %         | root             |
| localhost | debian-sys-maint |
| localhost | mysql.session    |
| localhost | mysql.sys        |
| localhost | root             |
+-----------+------------------+
```
证明 root 用户 已经可以在外部所有IP下进行访问了。
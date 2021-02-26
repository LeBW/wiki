# Mysql

## Mysql和SQLite区别
* SQLITE功能简约，小型化，追求最大磁盘效率
* MYSQL功能全面，综合化，追求最大并发效率。
如果只是单机上用的，数据量不是很大，需要方便移植或者需要频繁读/写磁盘文件的话，就用SQLite比较合适；如果是要满足多用户同时访问，或者是网站访问量比较大是使用MYSQL比较合适。

## 对比 InnoDB 和 MyISAM
InnoDB 和 MyISAM 是 MySQL 中常用的两种存储引擎。

InnoDB：InnoDB 是 MySQL 默认的事务性引擎，也是最重要和使用最广泛的存储引擎。它被设计成为大量的短期事务，短期事务大部分是正常提交的，很少被回滚。InnoDB 的性能与自动崩溃恢复的特性，使其在非事务存储需求中也非常流行。除非有特别的原因需要使用其他的存储引擎，否则应该优先考虑 InnoDB 引擎。

MyISAM：在 MySQL 5.5 及之前版本，MyISAM 是默认引擎。MyISAM 提供大量特性，包括全文索引，压缩，空间函数 等，但 MyISAM 不支持事务以及行级锁，而且一个毫无疑问的缺陷是崩溃后无法安全恢复。正是由于 MyISAM 的缘故，即使 MySQL 已经支持事务很长时间，很多人的概念里还认为 MySQL 不支持事务。尽管这样，MyISAM 并不是一无是处。对于只读的数据，或者表比较小，可以忍受修复操作，依然可以使用 MyISAM。

总结几个区别：
1. InnoDB 支持事务，MyISAM 不支持事务。**这是 MySQL 将默认存储引擎从 MyISAM 变成 InnoDB 的重要因素**。
2. InnoDB 支持外键，MyISAM 不支持。对一个包含外键的 InnoDB 表转换为 MyISAM 会失败。
3. InnoDB 是聚簇索引，而 MyISAM 是非聚簇索引。聚簇索引的文件放在主键索引的叶子结点上，因此 InnoDB 必须要有主键，而且通过主键索引效率很高。而 MyISAM 是非聚簇索引，数据文件和索引是分离的，索引保存的是数据文件的指针，主键索引和辅助索引是独立的。
4. InnoDB 不保存表的具体行数，执行 `select count(*) from table` 时需要全表扫描，而 MyISAM 用一个变量保存了整个表的行数，执行上述语句只需要读出该变量即可，很快。
5. InnoDB 的最小锁粒度是行级锁；MyISAM 是表级锁，一个更新语句会锁住整张表，导致其他查询和更新都会被阻塞，因此并发访问受限，**这也是 MySQL 将默认存储引擎换成 InnoDB 的重要原因**。

再看看如何选择：
1. 是否要支持事务。如果需要支持事务，请选择 InnoDB。
2. 如果表中绝大多数操作都是只读查询，可以考虑 MyISAM；如果既有读写也挺频繁，请使用 InnoDB。
3. 系统崩溃后，MyISAM 恢复更难，能否接受这一一点。
4. MySQL 5.5 后 InnoDB 已经成为 MySQL 的默认引擎（之前是 MyISAM），说明其优势是有目共睹的。如果不知道用什么存储引擎，就用 InnoDB。

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
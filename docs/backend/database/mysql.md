# Mysql

## Mysql和SQLite区别
* SQLITE功能简约，小型化，追求最大磁盘效率
* MYSQL功能全面，综合化，追求最大并发效率。
如果只是单机上用的，数据量不是很大，需要方便移植或者需要频繁读/写磁盘文件的话，就用SQLite比较合适；如果是要满足多用户同时访问，或者是网站访问量比较大是使用MYSQL比较合适。
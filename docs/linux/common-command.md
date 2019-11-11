# Linux常用命令

## 查看文件（目录）大小

### ls
```bash
ls -lh filename 
```
* `-l`表示每个文件（目录）显示一行
* `-h`表示使用 human readable 的形式输出。
* 不可用于查看目录大小。

### du
```bash
du -sh filename/directory name
```
* `-s`表示只显示概要（也就是说当参数是目录的时候，不显示子目录信息）
* `-h`表示使用 human readable 的形式输出。
* 可用于查看文件和目录的大小。


## sed 命令
Sed是一个用于修改文件的特殊编辑器。如果你想要写一个程序来改变一个文件，sed是一个很合适的工具。

### s子命令
Sed含有几个命令，其中最常用的是s命令，用于字符替换。 `sed 's/old/new' `。

例如把文件中的`day`换成`night`可以使用如下命令

```bash
# 输入为文件old，输出到文件new
sed s/day/night/ <old >new 
# 输入为echo输出的值，输出到控制台
echo 'day' | sed 's/day/night/'
# Output: night
```

> 分隔符也可以使用`_ : | `等，特别是当你要替换的字符里包含`/`时，那就必须使用其他的分隔符了。

> 注意在使用分隔符的时候，必须包含**三个**，少一个都不行。

### 支持正则表达式
sed命令支持正则表达式，-r参数可以使其支持扩展的正则表达式(extended regular expressions)
&用来指代寻到的pattern。(Mac OS上是-E）.
```bash
$ echo '123 abc' | sed -r 's/[0-9]+/(&)/'
(123) abc
```

### 全局替换
`/g`用于全局替换。Sed在默认情况下只会对**每一行**的第一次配对成功的字符串进行替换。在替换的最后加上/g可以使所有匹配的字符串被替换.
```bash
$ echo 'abc abc' | sed 's/abc/123/'
123 abc
$ echo 'abc abc' | sed 's/abc/123/g'
123 123
```
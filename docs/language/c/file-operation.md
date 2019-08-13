# 文件操作

## 文件打开
`FILE *fp = fopen(const char *path, const char *mode); `

* path: 文件路径
* mode：文件打开方式
    * r: 文本文件，只读
    * r+: 文本文件，读+写
    * w: 文本文件，写（会清空所有内容）
    * w+：文本文件，读+写（会清空所有内容）
    * a: 文本文件，尾部添加内容。
    * a+: 文本文件，尾部添加内容+读。
    * 所有模式可添加'b'，代表二进制形式读取文件。

## 文件读写
* `int fgetc(FILE *stream)  读取下一个字符，结尾时返回EOF`
* `getchar() = getc(stdin)`
* `char *fgets(char *s, int size, FILE *stream)`
    * 从stream中读取最多（size-1）个字符，并存入s中。读取过程会在以下两种情况后提前结束：
        * 遇见EOF文件结尾
        * 遇见换行符（换行符也会被读入）
    * 然后会在s的下一位自动添加'\0'作为字符串结束符。
* `int fscanf(FILE *stream, const char *format, …)`
    * 与scanf类似，从stream中读取字符，直到遇到空格、回车等结束。
    * 注意空格，回车等不会被读入，而是直接替换成'\0'，代表字符串的结束。
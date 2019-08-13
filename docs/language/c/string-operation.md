# 字符串操作

* 字符串表示： `char[], char*`,以`\0`作为结束符。

## strcpy与strncp
* `strcpy(char *dest, char *src)`，将src字符串复制到dest中（包括`\0`).
* `strncpy(char *dest, char *src, size_t n`,将src字符串的前n位复制到dest中。
    * 当n<=len(src)时，需要手动在dest[n]处赋值`\0`，以添加字符串结束符。
    * 当n>len(src)时，src之外的地方会全部赋值`\0`.
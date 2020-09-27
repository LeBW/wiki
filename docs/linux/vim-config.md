# Vim 配置
好用的Vim配置，详见 Github [amix/vimrc](https://github.com/amix/vimrc).

## yaml配置
为了使`yaml`配置更舒适，添加 `~/.vimruntime/my_configs.vim`文件，在其中添加
```
autocmd FileType yaml setlocal ts=2 sts=2 sw=2 expandtab
```
使缩进从4格变成两格。
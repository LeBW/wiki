# 进程间通信
进程间通信，这里介绍常用的 6 种。

## 1. 管道/匿名管道（Pipe）
* 管道是半双工，数据只能向一个方向流动；双方需要互相通信时，需要建立起两个管道。
* 只能用于具有亲缘关系的进程（父子进程或者兄弟进程）之间。
* 管道对于两端通信的进程来说就只是一种文件，一种不属于文件系统仅存在内存中的“伪文件”。
* 管道的通信方式为：写端每次都将数据写入管道缓冲区的 末尾 ，而读端每次都从管道缓冲区的 头部 读出数据。

管道的实质是内核利用 环形队列 的数据结构在 内核缓冲区 中的一个实现，默认设置大小为4K，可以通过 `ulimit -a` 命令查看。由于利用 环形队列 进行实现，读和写的位置都是自动增长的，不能随意改变，一个数据只能被读取一次，读取后数据就会从缓冲区中移除。当缓冲区读空或者写满时，有一定的规则控制相应的读进程或者写进程进入等待队列，当空的缓冲区有新数据写入或者满的缓冲区有数据读出来时，就唤醒等待队列中的进程继续读写。

### 管道的使用
```c
int pipe(int pipefd[2]);  // 成功，返回 0；失败，返回 -1，并设置 errno
```

函数调用成功返回 `r/w` 两个文件描述符。无需 open，但需手动 close。规定：fd[0] → r； fd[1] → w，就像 0 对应标准输入，1对应标准输出一样。向管道文件读写数据其实是在读写内核缓冲区。

管道创建成功后，创建该管道的进程（父进程）同时掌握着管道的读端和写端。那么如何实现父子间通信呢？通常可以采用如下步骤：
1. 父进程调用pipe函数创建管道，得到两个文件描述符 fd[0]、fd[1] 指向管道的读端和写端。
2. 父进程调用fork创建子进程，那么子进程也有两个文件描述符指向同一管道。
3. 父进程关闭管道读端，子进程关闭管道写端。父进程可以向管道中写入数据，子进程将管道中的数据读出。由于管道是利用环形队列实现的，数据从写端流入管道，从读端流出，这样就实现了进程间通信。


## 2. 命名管道（FIFO）
FIFO 常被称为命名管道，以区分管道(pipe)。管道(pipe)只能用于“有血缘关系”的进程间。但通过 FIFO，不相关的进程也能交换数据。

命名管道不同于匿名管道之处在于它提供了一个路径名与之关联，以命名管道的文件形式存在于文件系统中，这样，即使与命名管道的创建进程不存在亲缘关系的进程，只要可以访问该路径，就能够彼此通过命名管道相互通信，因此，通过命名管道不相关的进程也能交换数据。值的注意的是，命名管道严格遵循先进先出(first in first out),对匿名管道及有名管道的读总是从开始处返回数据，对它们的写则把数据添加到末尾。它们不支持诸如lseek()等文件定位操作。命名管道的名字存在于文件系统中，内容存放在内存中。

### 命名管道的使用

```c
int mkfifo(const char *pathname, mode_t mode); // 成功，返回 0；失败，返回 -1，设置 errno
```

一旦使用 `mkfifo` 创建了一个FIFO，就可以使用open打开它，常见的文件I/O函数都可用于 fifo。如：close、read、write、unlink等。

具体的代码例子可以见参考资料。

## 3. 信号（SIGNAL）
* 信号是 Linux 系统中用于进程间互相通信或者操作的一种机制，信号可以在任何时候发给某一进程，而无需知道该进程的状态。
* 如果该进程当前并未处于执行状态，则该信号就有内核保存起来，直到该进程回复执行并传递给它为止。
* 如果一个信号被进程设置为阻塞，则该信号的传递被延迟，直到其阻塞被取消是才被传递给进程。

Linux 种常用的信号：
1. SIGHUP：用户从终端注销，所有已启动进程都将收到该进程。系统缺省状态下对该信号的处理是终止进程。
2. SIGINT：程序终止信号。程序运行过程中，按`Ctrl+C`键将产生该信号。
3. SIGQUIT：程序退出信号。程序运行过程中，按`Ctrl+\`键将产生该信号。
4. SIGBUS 和 SIGSEGV：进程访问非法地址。
5. SIGFPE：运算中出现致命错误，如除零操作、数据溢出等。
6. SIGKILL：用户终止进程执行信号。shell下执行`kill -9 pid`发送该信号。
7. SIGTERM：结束进程信号。shell下执行`kill pid`发送该信号。
8. SIGALRM：定时器信号。
9. SIGCLD：子进程退出信号。如果其父进程没有忽略该信号也没有处理该信号，则子进程退出后将形成僵尸进程。
可以使用 `kill -l` 查看当前系统可用信号有哪些.

信号是软件层次上对中断机制的一种模拟，是一种异步通信方式。信号可以在用户空间进程和内核之间直接交互，内核可以利用信号来通知用户空间的进程发生了哪些系统事件，信号事件主要有两个来源：
1. 硬件来源：用户按键输入 Ctrl+C 退出、硬件异常如无效的存储访问等。
2. 软件终止：终止进程信号、其他进程调用 kill 函数、软件异常产生信号。

信号的生命周期和处理过程如下图所示:
1. 信号被某个进程产生，并设置此信号传递的对象（一般为对应进程的pid），然后传递给操作系统。
2. 操作系统将根据接受进程的设置（是否阻塞）而选择性的发送给接受者，如果接收者阻塞该信号（且该信号是可以被阻塞的），操作系统将暂时保留该信号，而不传递（如果对应进程已经退出，则丢弃该信号）；如果对应进程没有阻塞，操作系统将传递该信号。
3. 目的进程接受到此信号后，将根据当前进程对此信号设置的预处理方式，暂时终止当前代码的执行，保护上下文（主要包括临时寄存器数据，当前程序位置以及当前 CPU 的状态），转而执行中断处理程序，执行完成后回复到中断的位置。当然，对于抢占式内核，在中断返回时还将引起新的调度。

![signal-handle](./signal-handle.png)

## 4. 信号量
信号量是一个计数器，用于多进程对共享数据的访问，信号量的意图在于进程间同步。这种通信方式主要用于解决与同步相关的问题，避免资源竞争引起的错误。

为了获得共享资源，进程需要执行以下操作：
1. 测试控制该资源的信号量。
2. 若此信号量的值为正，则进程可以使用该资源。在这种情况下，进程将会信号量值减 1，表示它使用了一个资源单位。
3. 否则，若此信号量的值为 0，则进程进入休眠状态，直到该信号量的值大于0. （进程被唤醒后，返回步骤 1）。

当进程不在使用由一个信号量控制的共享资源时，该信号量值增1。如果有进程正在休眠等待此信号量，则唤醒它们。

当使用信号量时，首先通过 `semget` 来获取一个信号量 ID：
```c
#include<sys/sem.h>
int semget(key_t key, int nsems, int flag);
```

然后可以通过 `semctl` 或者 `semop` 来对信号量进行操作：
```c
int semctl(int semid, int semnum, int cmd, ... /* union semun arg*/);  
int semop(int semid, struct sembuf semoparray[], size_t nops);
```

## 5. 消息队列
消息队列是消息的链表，具有特定的格式，存放在内存中，并由消息队列标识符进行标志。管道和消息队列的通信数据都是先进先出的原则。与管道（无名管道：只存在于内存中的文件；有名管道：存在于实际的磁盘介质或文件系统）不同的是，消息队列存放在内核中，只有在内核重启（即操作系统重启）或者显示删除一个消息队列时，该消息队列才会被真正的删除。消息队列可以实现消息的随机查询，消息不一定要以先进先出的顺序进行读取，也可以按消息的类型进行读取，比 FIFO 更加灵活。消息队列克服了信号承载信息量少，管道只能承载无格式字节流以及缓冲区大小受限等缺陷。

消息队列常用的几个函数如下：
```c
#include<sys/msg.h>
int msgget(key_t key, int flag);  

int msgsnd(int msqid, const void *ptr, size_t nbytes, int flag);  

ssize_t msgrcv(int msqid, void *ptr, size_t nbytes, long type, int flag);
```
其中 `msgget` 用于打开或创建一个消息队列，`msgsnd` 用于向队列中发送消息，`msgrcv` 用于从队列中接受消息。
## 6. socket
套接字（Socket）主要用于在客户端和服务器之间通过网络进行通信。套接字是支持 TCP/IP 网络通信的基本操作单元，可以看作是不同主机之间的进程进行双向通信的特点，简单的说就是通信双方的一种约定，用套接字中的相关函数来完成通信过程。（当然，Unix Domain Socket 是不通过网络进行通信的）。

## 7. 共享内存
使得多个进程可以访问同一块内存空间，不同进程可以及时看到对方进程中对共享内存中数据的更新。这种方式需要依靠某种同步操作，如互斥锁和信号量等。

因为数据不需要在客户进程和服务器进程之间复制，所以这是最快的 IPC。在多个进程同步访问一个给定存储区时，若服务器进程正在将数据放入存储区，则在它做完之前，客户进程不应该去取这些数据。
这里我们可以使用信号量来进行同步共享存储访问。

与共享内存相关的系统调用有：
```c
#include<sys/shm.h>
int shmget(key_t key, size_t size, int flag);  // 获得一个共享内存标识符

int shmctl(int shmid, int cmd, struct shmid_ds *buf);  // 可以对共享内存进行多种操作

void *shmat(int shmid, const void *addr, int flag);  // 创建完共享内存后，进程可以通过调用 shmat 来将其连接到自己的地址空间中

int shmdt(const void *addr); // 当对共享存储段的操作已经结束时，调用 shmdt 函数与该段分离，但这并不会删除标识符及其相关的数据结构(直至某个进程（一般是服务器进程）调用shmctl特地删除它为止)

```

# 参考
[进程间通信 （IPC） 方法总结 (一)](https://www.cnblogs.com/joker-wz/p/11000489.html)
# Java 类加载
一个类的完整生命周期如下：
![class-lifecycle](./class-lifecycle.png)

其中前面三个为类加载过程。
一般来说，我们把 Java 的类加载过程分为三个主要步骤：加载、链接、初始化。具体行为在《Java虚拟机规范》中有非常详细的定义。

## 一、加载
首先是加载阶段（Loading），它是 Java 将字节码数据从不同数据源读取到 JVM 中，并映射为 JVM 认可的数据结构（Class 对象），这里的数据源可以是各种各样的形态，如 jar 文件，class 文件，甚至是网络数据源等。
如果输入数据不是 ClassFile 结构，则会抛出 ClassFormatError。

加载过程主要完成三件事情：
1. 通过全类名获取定义此类的二进制字节流。
2. 将字节流所代表的静态存储结构转换为方法区的运行时数据结构。
3. 在内存中生成一个代表该类的 Class 对象，作为方法区这些数据的访问入口。

一个非数组类的加载阶段（加载阶段获取类的二进制字节流的动作）是可控性最强的阶段，这一步我们可以去完成还可以自定义类加载器去控制字节流的获取方式（重写一个类加载器的 loadClass() 方法）。数组类型不通过类加载器创建，它由 Java 虚拟机直接创建。

类加载器、双亲委派模型非常重要，在后面单独介绍。

## 二、链接
第二阶段是链接（Linking），这是核心的步骤，简单说是把原始的类定义信息平滑地转化入 JVM 运行的过程中。这里可进一步细分为三个步骤：验证（Verification），准备（Preparation），解析（Resolution）。

### 验证
验证（Verification），这是虚拟机安全的重要保障，JVM 需要验证字节信息是符合 Java 虚拟机规范的，否则就被认为是 VerifyError，这样就防止了恶意信息或者不合规的信息危害 JVM 的运行，验证阶段有可能触发更多 class 的加载。

![verification](./verification.png)

### 准备
准备（Preparation）阶段是正式为类变量分配内存并设置类变量初始值的阶段，这些内存都将在**方法区**中分配，对于该阶段有以下几点要注意：
1. 这时候进行内存分配的仅包括类变量（Class Variables，即静态变量，被 `static` 修饰的变量，只与类相关，因为被成为类变量），而不包括实例变量。实例变量会在对象实例化时随着对象一块分配在 Java 堆中。
2. 从概念上讲，类变量所使用的内存都应该在**方法区**中进行分配。不过有一点需要注意：JDK 7 之前，HotSpot 使用永久代来实现方法区时，实现是完全符合这种逻辑概念的。而在 JDK 7 之后，HotSpot 已经把原本放在永久代中的 字符串常量池，静态变量等移动到堆中，这时候类变量会随着 Class 对象一起存放在 Java 堆中。
3. 这里所设置的初始值“通常情况”下是数据类型的默认值（如 0，0L，null，false 等），比如我们定义了 `public static int value = 111`，那么 value 变量在准备阶段的初始值就是 0 而不是 111（初始化阶段才会赋值为 111）。特殊情况：比如给 value 变量添加了 final 关键字 `public static final int value = 111`，那么准备阶段就会被赋值为 111.

### 解析
解析（Resolution）阶段是虚拟机将常量池内的**符号引用**替换为**直接引用**的过程。解析动作主要针对类或接口、字段、类方法、接口方法、方法类型、方法句柄和调用限定符 7 类符号引用进行。

符号引用就是一组符号来描述目标，可以是任何字面量。直接引用就是直接指向目标的指针、相对偏移量或一个间接定位到目标的句柄。在程序实际运行时，只有符号引用是不够的，举个例子：在程序执行方法时，系统需要明确知道这个方法所在的位置。Java 虚拟机为每个类都准备了一张方法表来存放类中所有的方法。当需要调用一个类的方法的时候，只要知道这个方法在方法表中的偏移量就可以直接调用该方法了。通过解析操作符号引用就可以直接转变为目标方法在类中方法表的位置，从而使得方法可以被调用。

综上，解析阶段是虚拟机将常量池内的符号引用替换为直接引用的过程，也就是得到类或者字段、方法在内存中的指针或者偏移量。

## 三、初始化
初始化阶段是执行初始化方法 `<clinit> ()` 方法的过程，是类加载的最后一步，这一步 JVM 才开始真正执行类中定义的 Java 程序代码(字节码)。

> `<clint>()` 方法是编译之后自动生成的。

对于 `<clinit> ()` 方法的调用，虚拟机会自己确保其在多线程环境中的安全性。因为 `<clinit> ()` 方法是带锁线程安全，所以在多线程环境下进行类初始化的话可能会引起多个进程阻塞，并且这种阻塞很难被发现。

对于初始化阶段，虚拟机严格规范了有且只有 5 种情况下，必须对类进行初始化(只有主动去使用类才会初始化类)：

1. 当遇到 new 、 getstatic、putstatic 或 invokestatic 这 4 条直接码指令时，比如 new 一个类，读取一个静态字段(未被 final 修饰)、或调用一个类的静态方法时。
    * 当 jvm 执行 new 指令时会初始化类。即当程序创建一个类的实例对象。
    * 当 jvm 执行 getstatic 指令时会初始化类。即程序访问类的静态变量(不是静态常量，常量会被加载到运行时常量池)。
    * 当 jvm 执行 putstatic 指令时会初始化类。即程序给类的静态变量赋值。
    * 当 jvm 执行 invokestatic 指令时会初始化类。即程序调用类的静态方法。
2. 使用 `java.lang.reflect` 包的方法对类进行反射调用时如 `Class.forname("...")`, `newInstance()` 等等。如果类没初始化，需要触发其初始化。
3. 初始化一个类，如果其父类还未初始化，则先触发该父类的初始化。
4. 当虚拟机启动时，用户需要定义一个要执行的主类 (包含 main 方法的那个类)，虚拟机会先初始化这个类。
5. MethodHandle 和 VarHandle 可以看作是轻量级的反射调用机制，而要想使用这 2 个调用， 就必须先使用 findStaticVarHandle 来初始化要调用的类。
6. (补充) 当一个接口中定义了 JDK8 新加入的默认方法（被 default 关键字修饰的接口方法）时，如果有这个接口的实现类发生了初始化，那该接口要在其之前被初始化。

## 卸载
卸载类即该类的 Class 对象被 GC。

卸载类需要满足 3 个要求:
1. 该类的所有的实例对象都已被 GC，也就是说堆不存在该类的实例对象。
2. 该类没有在其他任何地方被引用
3. 该类的类加载器的实例已被 GC

所以，在 JVM 生命周期内，由 jvm 自带的类加载器加载的类是不会被卸载的。但是由我们自定义的类加载器加载的类是可能被卸载的。

只要想通一点就好了，jdk 自带的 `BootstrapClassLoader, ExtClassLoader, AppClassLoader` 负责加载 jdk 提供的类，所以它们(类加载器的实例)肯定不会被回收。而我们自定义的类加载器的实例是可以被回收的，所以使用我们自定义加载器加载的类是可以被卸载掉的。

## 类加载器总结
JVM 中内置了三个重要的 ClassLoader，除了 BootstrapClassLoader，其他类加载器均由 Java 实现，并继承于 `java.lang.ClassLoader`：
1. BootstrapClassLoader（启动类加载器）：最顶层的加载类，由 C++ 实现，负责加载 `%JAVA_HOME%/lib` 目录下的 jar 包和类或者被 `-Xbootclasspath` 参数指定的路径中的所有类。
2. ExtensionClassLoader（扩展类加载器）：主要负责加载目录 `%JRE_HOME%/lib/ext` 目录下的 jar 包和类，或被 `java.ext.dirs` 系统变量所指定的路径下的 jar 包。
3. AppClassLoader（应用程序类加载器）：面向我们用户的类加载器，主要负责加载当前应用 classpath 下的所有 jar 包和类。

## 双亲委派模型
每一个类都有一个它的对应的类加载器。系统中的 ClassLoader 在协同工作时会默认使用双亲委派模型。即在类加载的过程中，系统会首先判断当前类是否被加载过。已经被加载的类会直接返回，否则才尝试加载。加载的时候，首先会把该请求委派给其父类加载器的 `loadClass()` 处理，因此所有的请求最终都应该传送到顶层的启动类加载器 `BootstrapClassLoader`中。当父类加载器无法处理时，才由自己来处理。
> 当父类加载器为 null 时，会使用启动类加载器 BootstrapClassLoader 来处理。

![classloader](./classloader.png)

每个类加载都有一个父类加载器，我们可以通过下面的程序来验证。

```java
public class ClassLoaderDemo {
    public static void main(String[] args) {
        System.out.println("ClassLodarDemo's ClassLoader is " + ClassLoaderDemo.class.getClassLoader());
        System.out.println("The Parent of ClassLodarDemo's ClassLoader is " + ClassLoaderDemo.class.getClassLoader().getParent());
        System.out.println("The GrandParent of ClassLodarDemo's ClassLoader is " + ClassLoaderDemo.class.getClassLoader().getParent().getParent());
    }
}
```

Output
```
ClassLodarDemo's ClassLoader is sun.misc.Launcher$AppClassLoader@18b4aac2
The Parent of ClassLodarDemo's ClassLoader is sun.misc.Launcher$ExtClassLoader@1b6d3586
The GrandParent of ClassLodarDemo's ClassLoader is null
```

`AppClassLoader`的父类加载器为 `ExtClassLoader`，`ExtClassLoader` 的父类加载器为 null，null 并不代表 `ExtClassLoader` 没有父类加载器，而是 `BootstrapClassLoader`。

其实这个双亲翻译的容易让别人误解，我们一般理解的双亲都是父母，这里的双亲更多地表达的是“父母这一辈”的人而已，并不是说真的有一个 Mother ClassLoader 和一个 Father ClassLoader 。另外，类加载器之间的“父子”关系也不是通过继承来体现的，是由“优先级”来决定。官方 API 文档对这部分的描述如下:
> The Java platform uses a delegation model for loading classes. The basic idea is that every class loader has a "parent" class loader. When loading a class, a class loader first "delegates" the search for the class to its parent class loader before attempting to find the class itself.

双亲委派模型的实现代码非常简单，逻辑非常清晰，集中在 `java.lang.ClassLoader` 的 `loadClass` 方法中，相关代码如下：
```java
private final ClassLoader parent; 
protected Class<?> loadClass(String name, boolean resolve)
        throws ClassNotFoundException
    {
        synchronized (getClassLoadingLock(name)) {
            // 首先，检查请求的类是否已经被加载过
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                long t0 = System.nanoTime();
                try {
                    if (parent != null) {//父加载器不为空，调用父加载器loadClass()方法处理
                        c = parent.loadClass(name, false);
                    } else {//父加载器为空，使用启动类加载器 BootstrapClassLoader 加载
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                   //抛出异常说明父类加载器无法完成加载请求
                }
                
                if (c == null) {
                    long t1 = System.nanoTime();
                    //自己尝试加载
                    c = findClass(name);

                    // this is the defining class loader; record the stats
                    sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                    sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                    sun.misc.PerfCounter.getFindClasses().increment();
                }
            }
            if (resolve) {
                resolveClass(c);  // 对类执行链接动作（类加载过程中的第二步）
            }
            return c;
        }
    }
```

双亲委派模型保证了 Java 程序的稳定运行，可以避免类的重复加载（JVM 区分不同类的方式不仅仅根据类名，相同的类文件被不同的类加载器加载产生的是两个不同的类），也保证了 Java 的核心 API 不被篡改。如果没有双亲委派模型，而是每个类加载器加载自己的话，就会出现一些问题，比如我们编写一个称为 `java.lang.Object` 类的话，那么程序运行的时候，系统就会出现多个不同的 `Object` 类。

我们可以自定义加载器的话，继承 ClassLoader 即可：
* 如果我们不想打破双亲委派模型，就重写 ClassLoader 类中的 findClass() 方法即可，无法被父类加载器加载的类最终会通过这个方法被加载
* 但是，如果想打破双亲委派模型，则需要重写 loadClass() 方法


# 参考
[极客时间 - 请介绍类加载过程，什么是双亲委派模型](https://time.geekbang.org/column/article/9946)

[JavaGuide - 类加载过程](https://snailclimb.gitee.io/javaguide/#/docs/java/jvm/%E7%B1%BB%E5%8A%A0%E8%BD%BD%E8%BF%87%E7%A8%8B)
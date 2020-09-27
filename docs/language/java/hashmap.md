# HashMap
HashMap 是常用的用于存储 key-value 键值对数据的一个集合，底层是基于对 Map 的接口实现。每一个键值对又叫 Entry（Node），这些 Entry（Node） 分散的存储在一个由 <数组，链表，红黑树> 组成的集合中，其中 key 和 value 都支持`null`.
* HashMap 与 HashTable 作用基本相同，除了「HashMap 不是线程安全的，并且允许`null`值」

## 核心成员变量
``` java
// 默认的HashMap table 数组大小 16
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16

// 数组最大值，2^30 
static final int MAXIMUM_CAPACITY = 1 << 30;

// 默认的负载因子
static final float DEFAULT_LOAD_FACTOR = 0.75f;

// 链表转换为红黑树的节点最小个数（当链表长度大于等于8时会从链表转变为红黑树）
static final int TREEIFY_THRESHOLD = 8;

// 红黑树经过remove后节点个数小于等于该值时 从红黑树蜕变为链表
static final int UNTREEIFY_THRESHOLD = 6;

// HashMap的数组，是Node类型的，初始值为null
transient Node<K,V>[] table;

// 在迭代器中使用，可依次遍历Hashmap的节点
transient Set<Map.Entry<K,V>> entrySet;

// HashMap的节点个数
transient int size;

// HashMap的修改次数，主要用在fail-fast中
transient int modCount;

// HashMap阀值，当size超过阀值时进行扩容操作，一般情况下阀值 = 数组的长度 * 负载因子
int threshold;

// 负载因子，默认是0.75f
final float loadFactor;
```

## 主要构造函数
```java
public HashMap(int initialCapacity, float loadFactor) {
    // 传入默认初始化的容量大小参数
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " +
                                           initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " +
                                           loadFactor);
    this.loadFactor = loadFactor;
    // 这里有个比较重要的方法tableSizeFor，根据 initialCapacity，返回一个合适的2的指数
    this.threshold = tableSizeFor(initialCapacity);
    // 注意这里 tableSizeFor 的返回值其实是 capacity，而不是 threshold，这里只是暂借 threshold 这个成员变量存一下（可以从后面的resize函数中印证）
}
```
上面用`tableSizeFor()`函数，来根据传入的 initialCapacity，找到一个「比它大的，同时是2的n次方」的数字。那么`tableSizeFor()`是如何实现的呢？看下面的代码
```java
static final int tableSizeFor(int cap) {
    int n = cap - 1;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
```
这里主要运用了位运算，其中`>>>`是无符号右移，`|=`是 或运算后赋值。
经过这几次或运算后，其实就是**把当前二进制位最大的1右边的0全部改成1**。最后再用它加1，就得到了一个2的n次方的数。

## 主要函数
首先看一下用于计算key的哈希值的函数`hash(Object key)`:
```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```
可以看见，这里将key的哈希值的高16位与低16位进行了异或运算，这是为了降低hash冲突。

再看一下`get(Object key)`相关函数，即如何根据`key`找到相应的`value`。
```java
public V get(Object key) {
    Node<K,V> e;
    return (e = getNode(hash(key), key)) == null ? null : e.value;
}

final Node<K,V> getNode(int hash, Object key) {
    Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (first = tab[(n - 1) & hash]) != null) {  // 注意这里，根据 (n - 1) & hash 来计算下标值
        if (first.hash == hash && // always check first node
            ((k = first.key) == key || (key != null && key.equals(k))))
            return first;
        if ((e = first.next) != null) {   // 到这里，说明first不匹配，需要往后找（链表或者红黑树）
            if (first instanceof TreeNode)
                return ((TreeNode<K,V>)first).getTreeNode(hash, key);  // 说明已经是红黑树结构，要调用getTreeNode来匹配节点
            do {  // 进入这里，说明还是链表结构，直接遍历匹配hash值即可。
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    return e;
            } while ((e = e.next) != null);
        }
    }
    return null;
}
```
可以看到，当`node`为链表时，直接遍历即可，较为简单。而当`node`为树节点的时候，就要调用TreeNode版本的getNode:`node.getTreeNode()`来进行节点匹配了。

...未完待续


## 面试常问
Q：为什么要把 capacity 设为 2的n次方 呢？并且扩容的时候，也是以2倍容量的形式进行扩容？

A：因为我们在根据哈希值`hash`取下标时，是用位运算 `hash & (len - 1)` ，其中`len`为2的幂，故`len-1`的二进制尾部全部是1，在进行与操作时，能够进行充分散列（并且等同于`hash % len`的取余操作）。

注意：用位运算计算哈希下标，是因为计算机在进行位运算时效率非常高。

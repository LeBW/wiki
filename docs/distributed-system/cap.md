# CAP定理
CAP 定理指出：对于一个分布式系统来说，不可能同时满足以下三点：

1. 一致性（Consistency）：每个读操作都能获取到最近一次写后的结果，等同于所有节点能访问到数据最新的副本。
2. 可用性（Avalability）：每次请求都能获取到一个正常的响应（此时不一定要最新）
3. 分区容错性（Partition tolerance）：即使节点之间的网络出现了分区（Partition）（也就是说节点之间的网络包出现了丢失或者延迟），系统仍然能够运转。

由于网络是不可靠的，所以在分布式系统中，一定会出现网络分区错误的情况。此时系统还是要运转，因此分布式系统必须满足分区容错性，也就是 CAP 中的 P。那么，在分布式系统中，当发生网络分区错误时，我们有两种选择：
1. 保C弃A：系统拒绝访问，避免出现数据不一致的情况，但此时就会出现系统可用性丧失。
2. 保A弃C：系统仍然接受访问返回结果，保证了可用性。但是此时由于网络分区错误，节点之间通信受阻，可能会出现数据不一致的情况。

因此 CAP 定理指出，在网络分区出现的情况下，分布式系统必须在一致性（C）和可用性（A）之间作出抉择。

## CAP & ACID
需要注意，CAP定理中的 Consistency 和 数据库事务 ACID 中的 Consistency 是不一样的。
* CAP 中的 Consistency 是 Atomic Consistency，是一致性模型中的一种。
* ACID 中的 Consistency 是指数据的完整性（data integrity）。在数据库中，数据完整性通常会通过一些规则进行实现，例如 字段不为空、字段为整数型、某字段是另一个表中的外键 等。

详情可见 [这里](http://blog.thislongrun.com/2015/03/the-confusing-cap-and-acid-wording.html)



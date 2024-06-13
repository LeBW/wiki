(window.webpackJsonp=window.webpackJsonp||[]).push([[90],{557:function(t,a,s){"use strict";s.r(a);var r=s(45),n=Object(r.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"string"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#string"}},[t._v("#")]),t._v(" String")]),t._v(" "),s("p",[t._v("这里来看看日常使用最多的字符串 String 类型。")]),t._v(" "),s("p",[t._v("首先，String 是 Java 语言中非常基础和重要的类，提供了构造和管理字符串的各种基本逻辑。它是典型的 Immutable 类，被声明成为 final class，所有属性也都是 final 的。由于它的不可变性，类似拼接，裁剪字符串等操作，都会产生新的 String 对象。由于字符串操作的普遍性，所以相关操作的效率往往对应用性能有明显影响。")]),t._v(" "),s("p",[t._v("StringBuffer 是为解决上面提到拼接产生太多中间对象的问题而提供的一个类，我们可以用 append 或者 add 方法，把字符串添加到已有序列的末尾或者指定位置。StringBuffer 本质是一个线程安全的可修改字符序列，它保证了线程安全，也随之带来了额外的性能开销，所以除非有线程安全的需要，不然还是推荐使用它的后继者，也就是 StringBuilder。")]),t._v(" "),s("p",[t._v("在实现上，StringBuffer 的线程安全是通过各种修改数据的方法都添加上 synchronized 关键字实现的，非常直白。其实，这种简单粗暴的方式，非常适合我们常见的线程安全类实现。")]),t._v(" "),s("p",[t._v("StringBuilder 是 Java 1.5 中新增的，在能力上和 StringBuffer 没有本质区别，但是它去掉了线程安全的部分，有效减小了开销，是绝大部分情况下进行字符串拼接的首选。")]),t._v(" "),s("p",[t._v("为了实现修改字符串的目的，StringBuffer 和 StringBuilder 底层都是利用可修改的（char，JDK 之后是 byte）数组，二者都继承了 AbstractStringBuilder，里面包含了基本操作，区别仅在于最终的方法是否加上了 synchronized。")]),t._v(" "),s("p",[t._v("另外，内部的数组设置为多大也是个问题。如果太小，拼接的时候可能要重新创建足够大的数组；如果太大，又会浪费空间。目前，在 AbstractStringBuilder的实现中，内部数组初始大小设置为构建时初始字符串长度加 16（这意味着，如果没有构建对象时输入最初的字符串，那么初始值就是 16）。我们如果确定拼接会发生非常多次，而且大概是可预计的，那么就可以指定合适的大小，避免很多次扩容的开销。扩容会产生多重开销，因为要抛弃原有数组，创建新的（可以简单认为是倍数）数组，还要进行 arraycopy。")]),t._v(" "),s("h2",{attrs:{id:"string-到底创建了几个对象"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#string-到底创建了几个对象"}},[t._v("#")]),t._v(" String 到底创建了几个对象？")]),t._v(" "),s("p",[t._v("面试经常会问 new String 时到底创建了几个对象。")]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),t._v(" s1 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"abc"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('// 创建了一个对象，"abc" 存在常量池中。')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),t._v(" s2 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"def"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('// 创建了两个对象，一个是 "def" 存在常量池中；一个是 s2 指向的存在堆中的“def”对象。')]),t._v("\n")])])])])}),[],!1,null,null,null);a.default=n.exports}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[84],{513:function(e,v,a){"use strict";a.r(v);var _=a(45),t=Object(_.a)({},(function(){var e=this,v=e.$createElement,a=e._self._c||v;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"同步问题"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#同步问题"}},[e._v("#")]),e._v(" 同步问题")]),e._v(" "),a("h2",{attrs:{id:"线程同步"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#线程同步"}},[e._v("#")]),e._v(" 线程同步")]),e._v(" "),a("h3",{attrs:{id:"锁"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#锁"}},[e._v("#")]),e._v(" 锁")]),e._v(" "),a("p",[e._v("用于限制多线程对共享资源的访问。")]),e._v(" "),a("p",[e._v("锁的原理实现")]),e._v(" "),a("ul",[a("li",[e._v("中断关闭与开启。（只适用于单处理器情形）")]),e._v(" "),a("li",[e._v("有read-modify-write功能的指令（例如test-and-set, compare-and-swap, etc）。")])]),e._v(" "),a("h3",{attrs:{id:"信号量-semaphore"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#信号量-semaphore"}},[e._v("#")]),e._v(" 信号量（Semaphore）")]),e._v(" "),a("p",[e._v("PV操作。")]),e._v(" "),a("p",[e._v("生产者消费者模型")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("* mutex = 0\n* fullBuffer = 0\n* emptyBuffer = numBuffers.\n* 注意P操作顺序很重要：必须先对Buffer进行P操作再对mutex进行P操作，防止死锁。\n...\n")])])]),a("p",[e._v("信号量比锁的功能更丰富，但是：")]),e._v(" "),a("ul",[a("li",[e._v("有时使人迷惑，双重功能性（既可以作为锁，也可以作为限制条件）")]),e._v(" "),a("li",[e._v("例如，在以上生产者消费者模型中，P的顺序很重要，但是这没有很明显地表现出来。")])]),e._v(" "),a("p",[e._v("所以提出概念更清楚的方法：用Lock作为互斥的实现，用Condition Variables作为条件限制的实现。（Monitors）")]),e._v(" "),a("h3",{attrs:{id:"monitor-lock-and-condition-variables"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#monitor-lock-and-condition-variables"}},[e._v("#")]),e._v(" Monitor（Lock and Condition Variables)")]),e._v(" "),a("ul",[a("li",[a("code",[e._v("Mutex Lock: m")])]),e._v(" "),a("li",[a("code",[e._v("Condition Variables: c")]),e._v(" "),a("ul",[a("li",[a("code",[e._v("wait(c, m)")]),e._v(" "),a("ol",[a("li",[e._v("释放互斥锁m")]),e._v(" "),a("li",[e._v("在"),a("code",[e._v("c")]),e._v("的队列中，将此线程从"),a("code",[e._v("running-queue")]),e._v("转移到"),a("code",[e._v("wait-queue")])]),e._v(" "),a("li",[e._v("进入"),a("code",[e._v("sleep")]),e._v("状态。（等待其他线程的"),a("code",[e._v("signal")]),e._v("或者"),a("code",[e._v("broadcast")]),e._v("）")]),e._v(" "),a("li",[e._v("被唤醒后，重新拿回互斥锁"),a("code",[e._v("m")]),e._v("，函数结束。")])])]),e._v(" "),a("li",[a("code",[e._v("signal(c)")]),e._v(" "),a("ul",[a("li",[e._v("把"),a("code",[e._v("c")]),e._v("的"),a("code",[e._v("wait-queue")]),e._v("中的一个线程变成"),a("code",[e._v("ready")]),e._v("状态。通常在释放锁之前进行。")])])]),e._v(" "),a("li",[a("code",[e._v("broadcast(c)")]),e._v(" "),a("ul",[a("li",[e._v("将"),a("code",[e._v("c")]),e._v("的"),a("code",[e._v("wait-queue")]),e._v("中所有线程唤醒，清空"),a("code",[e._v("wait-queue")])])])]),e._v(" "),a("li",[e._v("需要注意的是"),a("code",[e._v("condition variables")]),e._v("总是和"),a("code",[e._v("mutex lock")]),e._v("配合使用，"),a("code",[e._v("mutex lock")]),e._v("用来确保对condition variable的访问是同步的。")])])])])])}),[],!1,null,null,null);v.default=t.exports}}]);
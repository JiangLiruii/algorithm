Disruptor是一种内存消息队列, 是线程之前用于消息传递的队列. 基本上是最快的消息队列了.它hi如何左到高性能的? 底层依赖了哪些数据结构和算法?

基于循环队列的"生产者"- "消费者"

生产者生产数据放到中心储存容器, 消费者从中心储存容器中取出数据进行消费

实现中心储存容器最好的数据结构就是队列.支持先进先出, 保证顺序性. 队列的实现有两种, 一种是链表的链表队列, 一种是数组的数组队列. 
如果是需要一个 **无界队列**, 也就是说队列的大小支持无限大, 适合选用链表来不断的往下链接. 如果是一个**有界队列**, 那么数组就更适合, 队列满了之后, 生产者需要等待, 队列空了之后, 消费者需要等待.
有界队列比无界队列应用得更广泛一点, 毕竟都会有物理限制.
还有一种特殊的队列: **循环队列**, 这就是内存消息队列的雏形

下面是生产者消费者的代码:

```js
class Queue {
    constructor(len) {
        this.queue = Array(len)
        this.max_len = len
        this.head = 0
        this.tail = 0
    }
    add(data) {
        if (this.tail + 1 % this.max_len !== this.head) {
            this.queue[this.tail] = data
            this.tail = (this.tail + 1) % this.max_len
            return 1
        } else {
            return 0
        }
    } 
    get() {
        if (this.queue.length) {
            return this.queue.
        } else {
            return null
        }
    }
}
const queue = new Queue(10)
class Producer {
    produce(data) {
        if (queue.add(data)) {
            new Promise(res => setTimeout(res, 3000)).then(() => this.produce(data))
        }
    }
}
class Consumer {
    consumer() {
        const data = queue.get() !== null
        if (data !== null) {
            // Do sth
        } else {
            new Promise(res => setTimeout(res, 3000)).then(() => this.consumer())
        }
    }
}
```
实际上以上代码并不完善, 因为上述代码只支持一个生产者和一个消费者, 并不支持并发地往队列中写入数据或读取数据.因为
- 多个生产者写入的数据可能会互相覆盖
- 多个消费者可能读取重复的数据

![](/img/disruptor_1.jpg)

因为tail = tail+1 是在给queue[]赋值之后执行, 且不为原子操作, 很有可能两个线程同时走到这里, 线程1赋值之后还没能加1线程2就赋值了, 导致被覆盖.而且会导致tail的指针因为加了两次向后多走一位. 最简单的办法就是加锁, 但是加锁就相当于把并行改成串行了.

### 基于无锁的并发"生产者-消费者模式"

在Disruptor算法中, 生产者是往队列添加数据之前, 申请可用的空闲储存单元, 并且是批量的申请连续的n个储存单元, 当申请到之后, 后续往队列中添加元素就不用加锁了, 这个储存单元为该线程独享.消费者也类似, 申请连续的可读的储存单元, 申请到之后就不用枷锁了. 当然, 申请单元的时候一定是带锁的.

但是有个问题就是中间不能有空隙, 比如生产者A申请了3-6, 生产者B申请了7-9, 啊么3-6没有完全写入之前, 是访问不到7-9的数据的.


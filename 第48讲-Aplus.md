搜索: 如何用 A+搜索算法实现游戏中的寻路功能?

人物处于游戏地图中某个位置时, 鼠标点击距离较远的另外一个位置, 人物会自动绕过障碍物走过去. 这个功能如何实现?

这是一个典型的搜索问题: 人物起点-->当前位置, 人物终点-->鼠标点击位置. 需要在地图上找一条从起点到终点的路径, 这条路径需要绕过所有的障碍物, 还要走的不能太绕, 即走最短路径.

之前有说过使用 Dijkstra 来规划最短路径, 但是该算法之前已经说了比较耗时.在权衡路线质量和执行效率的情况下, 只需要寻求一个次优解就足够了.那么问题就转化为**如何寻求一条接近于最短路线的次优路线呢?**

## A+算法

Dijkstra 算法是盲目的, 他会遍历所有的邻接节点, 找到最小的那个, 然后再类似 BFS 的向下遍历.

![](/img/Dijkstra_short.jpeg)

比如上图就会先遍历 1,2,3, 跟从起点 s 到终点 t 的方向背道而驰. 是不是综合一下这个顶点距离终点可能还有多远考虑进去, 来判断哪个顶点该先出队列, 就可以避免跑偏了呢?

**启发函数(heuristic function)**: 当前顶点和终点的欧几里得距离, 记为h(i), 直线距离与路径长度是两个概念.
把从起点到当前顶点的路径长度记为 g(i)
**曼哈顿距离(Manhattan Distance)**: 欧几里得距离的改良, 不涉及平方和开根号, 两点之间横纵坐标的距离之和.
```js
function Manhattan(vertex1, vertex2) {
  return Math.abs(vertex1.x-vertex2.x)+Math.abs(vertex1.y-vertex2.y)
}
```

原来 Dijkstra 只单纯通过 g(i) 来估算最短路径长度, 现在加上 h(i), 即 f(i) = g(i)+h(i), f(i)被称为 **估价函数(evaluation function)**

实际上 A+算法就是对 Dijkstra 算法的简单改造, 引入了一个 **修正因子 h(i)**

```js
class PriorityQueue {
  constructor(v) {
    this.nodes = Array(v+1)
    for (let i = 0; i <= v; i ++) {
      const dist = Number.MAX_VALUE
      this.node[i] = new Vertex(i, dist)
    }
    this.count = v
  }
  poll() {
    this.count -= 1
    return this.node.unshift()
  }
  add(vertex) {
    this.count += 1
    this.node.push(vertex)
    heapify(this.node)
  }
  // 更新结点的值, 需要重新堆化, 重新符合小顶堆堆的定义
  update(vertex) {
    for (let i = 0; i < this.count; i ++) {
      if (this.node[i].id === vertex.id) {
        // 根据 f 而不是 dist 构建小顶堆
        this.node[i].f = vertex.f
      }
    }
    heapify(this.node) // 堆化函数详见最短路径
  }
  isEmpty() {
    return this.count == 0
  }
}
// 顶点
class Vertex {
  constructor(id, dist) {
    this.id = id;
    this.dist = dist;
    // 添加 f 加入曼哈顿距离
    this.f = 0;
    // 加入坐标以计算曼哈顿距离
    this.x = 0;
    this.y = 0;
  }
}
function dijkstra(s,t) {
  // 还原最短路径
  let predecessor = Array(this.v)
  // 保存顶点数组
  let vertexes = Array(v)
  // 保存是否进入过队列
  let inqueue = Array(v)
  for(let i = 0; i < v; i++) {
    vertexes[i] = new Vertex(i, Number.MAX_VALUE)
    inqueue[i] = false
  }
  let queue = new PriorityQueue(v);
  vertexes[s].dist = 0
  inqueue[s] = true
  queue.add(vertexes[s])
  while(!queue.isEmpty()) {
    let minVertex = queue.poll()
    if (minVertex.id === t) {
      // 走到终点即终止
      queue.clear();
      break;
    }
    for(let i = 0; i < this.adj.length; i ++) {
      const e = adj[minVertex][i]
      const nextVertex = vertexes[e.tid]
      if (minVertex.dist + e.worth < nextVertex.dist) {
        nextVertex.dist = minVertex.dist + e.worth
        nextVertex.f = minVertex.dist + e.worth + Manhattan(nextVertex, vertexes[t])
        predecessor[nextVertex.id] = minVertex.id
        if(inqueue(nextVertex.id)) {
          queue.update(nextVertex)
        } else {
          queue.add(nextVertex)
          inqueue[nextVertex.id] = true
        }
      }
    }
  }

  function print (s,t) {
    if (s === t) return;
    print(s, predecessor[t])
    console.log('->', t)
  }
  print(s, t);
}
```
因为不是最后 t 顶点出栈终止循环, 所以不一定路径一定是最短的, 但可以最快的找到一条相对比较近的路.

在游戏中通常是把整个地图划分成了一个一个小方块, 只能上下左右四个方向移动, 这样就可以把边的权值设为1, 就可以把地图抽象成一个有向图, 利用 A*算法实现自动寻路.

A* 算法属于启发式搜索算法, haiyou IDA* 算法, 蚁群算法, 遗传算法, 模拟退火算法等.

启发式算法利用估价函数, 避免跑偏, 贪心的朝最有可能到达终点的方向前进.达到线路质量和执行效率的平衡.



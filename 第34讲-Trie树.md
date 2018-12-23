# 如何实现搜索引擎搜索关键词提示功能

## Trie树
也叫字典树, 专门处理字符串匹配的树形数据结构, 用于解决在一组字符串中查找某个字符的问题.

假设有6个字符串: how hi her hello so see

![](/img/trie.jpg)

从上图可以看出, Trie树的本质是提取字符串之间公共的前缀部分, 将重复的前缀合在一起. 根节点不包含任何信息, 从根节点到红色节点的路径表示一条字符串(注意, 红色节点并不一定是叶子节点)

![](/img/trie_1.jpg)
![](/img/trie_2.jpg)

比如要查找字符串 her, 则为下列绿色的路径

![](/img/trie_3.jpg)

那么要查找he呢?注意, he在源字符串集中是没有的, 查找的过程会是下列的路径, 可以找到he, 但是最后一个节点e并不是红色节点, 所以判定为不能匹配任何字符

![](/img/trie_4.jpg)

## 如何用代码实现一棵trie树

主要有两个操作:
1. 将字符串集合构造成trie树
2. 在trie树中查找一个字符串

trie树是一个多叉树, 二叉树中是用左右子节点的指针来储存, 对于多叉树应该怎么储存呢?

通过下标与字符一一映射的数组

![](/img/trie_5.jpg)

假设字符只有26个字母, 可以创建长度为26的数组, 每个数组中的元素储存该字母对应的子节点.如上图. 在查找的时候便用待查找字符减去a的ASCII值作为索引去查找, 比如d-a=3, 那么就找对应节点数组TrieNode[3]. 翻译成代码:
```js
class TrieNode {
    constructor(data) {
        this.children_list = new Array(26)
        this.is_end_char = false
        for (let i = 0; i < 26; i ++) {
            this.children_list[i] = null
        }
        this.data = data
    }
}
class Trie {
    constructor() {
        this.root = new TrieNode('/')
    }
    insert(text) {
        let current_node = this.root;
        for (let i = 0; i < text.length; i ++) {
            const index = text[i].codePointAt(0) - 97;
            if (current_node.children_list[index] === null) {
                current_node.children_list[index] = new TrieNode(text[i])
                current_node.data = text[i]
            }
            current_node = current_node.children_list[index]
        }
        current_node.is_end_char = true;
    }
    find(text) {
        let current_node = this.root;
        for (let i = 0; i < text.length; i++) {
            const index = text[i].codePointAt(0) - 97;
            if (current_node.children_list[index] !== null) {
                current_node = current_node.children_list[index]
            }
            else {
                return false
            }
        }
        return current_node.is_end_char
    }
}

var a = new Trie()
a.insert('nihao')
a.insert('her')
a.insert('he')
a.find('he') // True
```

下面分析以下时间复杂度, 在插入过程中, 也就是构建Trie树的过程, 需要扫描所有的字符串, 时间复杂度为所有字符串长度的和O(n), 查询的效率就会很高了, 是O(m), m为查询的字符串长度.比如上例中构建的复杂度为5+3+2=10, 查询的复杂度为2

可以看出这是一种空间换时间的办法, 生成children_list数组中有很多没有用到的元素. 都为null, 上例的数组长度为26, 每个元素是8字节(指针),那么每个节点就会需要额外的26*8=208字节的数据, 这还只是包含26个字符的情况.如果包含大小写, 特殊字符, 那么会需要更多的储存空间.

是否有其他办法呢?可以使用有序数组, 即在插入的时候按顺序插入, 那么查找的时候二分查找, 复杂度会升高, 但是空间就会小很多. 也可以使用散列表, 但是就不能使用CPU的缓存了(不是连续储存的).
下列是散列表的实现方式
```js
class TrieNode {
    constructor(data) {
        this.children_list = {}
        this.is_end_char = false
        this.data = data
    }
}
class Trie {
    constructor() {
        this.root = new TrieNode('/')
    }
    insert(text) {
        let current_node = this.root;
        for (let i = 0; i < text.length; i ++) {
            debugger
            if (!current_node.children_list[text[i]]) {
                current_node.children_list[text[i]] = new TrieNode(text[i])
                current_node.data = text[i]
            }
            current_node = current_node.children_list[text[i]]
        }
        current_node.is_end_char = true;
    }
    find(text) {
        let current_node = this.root;
        for (let i = 0; i < text.length; i++) {
            if (current_node.children_list[text[i]]) {
                current_node = current_node.children_list[text[i]]
            }
            else {
                return false
            }
        }
        return current_node.is_end_char
    }
}

var a = new Trie()
a.insert('nihao')
a.insert('her')
a.insert('he')
a.find('he')
```

还有一种节省空间的方式就是进行**缩点优化**, 比如

![](/img/trie_6.jpg)

它需要在完成插入之后再遍历一遍整个Trie树, 然后将单个节点的后续节点都合并起来, 会增加部分的复杂度.

## Trie树与散列表红黑树的比较

笼统上讲, 这三者都可以归为数据查找的问题, 但是Trie树的数据查找特指的是再一组字符串中查找字符串的功能, 比较散列表和红黑树与Trie树的场景, Trie树表现并不好

1. Trie树包含的字符集不能太大, 否则浪费很多储存空间, 即使优化, 也要牺牲查询插入效率的代价
2. 要求前缀重合度比较高, 否则会有很多单节点, 浪费更多空间
3. 需要从0开始实现Trie树, 要保证没有bug的工程应用较难, 散列表和红黑树一般都有原生的数据结构
4. 每个节点是通过指针串起来的, 对缓存不友好, 性能也会降低一些

综合来看, Trie树并不适合字符串的精确匹配, 这种问题适合用散列表和红黑树来解决, 而是适合查找前缀匹配的字符串, 也就是最开始说的搜索关键字的那个问题

假设用户输入'h', 和'he', 会分别提示`hello, her, hi, how`和`hello, her`, 这是红黑树和散列表办不到的.

![](/img/trie_7.jpg)

现在假设有1w条数据, 要求它的字符集大小以及前缀重合度, 也就是如何判断是否适合用Trie树来解决该问题?
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
        this.char_list = new Array(26)
        this.is_end_char = false
        for (let i = 0; i < 26; i ++) {
            this.char_list[] = String.fromCharCode(97+i)
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
            if (current_node[index] === null) {
                current_node.char_list[index] = new TrieNode(text[i])
                current_node.data = text[i]
            }
            current_node = current_node[index]
        }
        current_node.is_end_char = true;
    }
    find(text) {
        let current_node = this.root;
        for (let i = 0; i < text.length; i++) {
            if (current_node.char_list[text[i]] !== null) {
                current_node = current_node.char_list[text[i]]
            }
            else {
                return false
            }
        }
        return current_node.is_end_char
    }
}
```



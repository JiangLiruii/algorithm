# 二分查找(下): 如何快速定位ip对应的省份地址?

## 通过IP地址查找归属地, 是通过维护一个很大的IP地址库来实现的, 如果发现查询的IP地址在地址库中某个范围, 那么就可以把该范围对应的归属地返回给用户即可

## 这里涉及了二分查找的变形问题: 如果有12w条IP区间与归属地的对应关系, 如何快速定位出一个IP地址的归属地呢?

## 首先看四个二分查找的变形问题: 这里为了简单起见, 所给的数组都已经按照从小到大的顺序排列
### 查找第一个值等于给定值的元素

```js
function find_first(arr, num) {
    var left = 0, right = arr.length, mid;
    while(left <= right) {
        mid = left + ((right - left) >> 1)
        if (arr[mid] === num) {
            if (mid === 0 || mid === arr.length - 1) return mid
            if (arr[mid - 1] === num) {
                right = mid - 1
                continue
            } else {
                return mid
            }
        }
        if (arr[mid] > num) {
            right = mid - 1
        } else {
            left = mid + 1
        }
    } 
}
```
### 查找最后一个值等于给定值的元素
```js
function find_last(arr, num) {
    var left = 0, right = arr.length, mid;
    while(left <= right) {
        mid = left + ((right - left) >> 1)
        if (arr[mid] === num) {
            if (mid === 0 || mid === arr.length - 1) return mid
            if (arr[mid + 1] === num) {
                left = mid + 1
            } else {
                return mid
            }
        }
        if (arr[mid] > num) {
            right = mid - 1
        } else {
            left = mid + 1
        }
    } 
}
```
### 查找第一个大于等于给定值的元素
```js
function find_first_no_less_than(arr,num) {
    var left = 0, right = arr.length, mid;
    while(left <= right) {
        mid = left + ((right - left) >> 1)
        if(arr[mid] >= num) {
            if (mid === 0) return mid
            if(arr[mid - 1] >= num) {
                right = mid - 1
            } else {
                return mid
            }
        } else {
            left = mid + 1
        }
    }
}
```
### 查找最后一个小于等于给定值的元素 
```js
function find_last_no_less_than(arr, num) {
    var left = 0, right = arr.length, mid;
    while(left <= right) {
        mid = left + ((right - left) >> 1)
        if (arr[mid] <= num) {
            if (mid === arr.length - 1) return mid
            if(arr[mid + 1] <= num) {
                left = mid + 1
            } else {
                return mid
            }
        } else {
            right = mid - 1
        }
    }
}
```

## 看了这四个变形, 回头看看开篇的问题, 如果IP数据库区间按照大小进行排序, 那么问题就转变为了,求最后一个小于等于用户查询的IP地址, 如果在小于等于的区间内有该IP, 则返回归属地, 如果在该区间内没有IP, 则返回null

## 思考题: 循环数组的查找方式, 比如[4,5,6,1,2,3]

### 思路:

- 找到每次循环包含的元素数量为C
- 在 n/C 的范围内进行二分查找
- 查找到第一个大于等于查询元素的时候终止, 假设为j
- 查看 arr[(j-1)*C] 到 arr[j*C]中有无查询元素

```js
function bsearch(arr, num) {
    var left = 0, right = arr.length - 1,mid;
    while(left <= right) {
        mid = left + ((right - left) >> 1)
        if(arr[mid] === num) {
            return mid
        }
        if (arr[mid] > num) {
            right = mid - 1
        } else {
            left = mid + 1
        }
    }
    return -1
}
function find(arr, num) {
    var C, left = 0, right, mid;
    for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i] === num) return i
        if (arr[i] > arr[i+1]) {
            C = i + 1
            break
        }
    }
    right = arr.length / C
    while(left <= right) {
        debugger
        mid = left + ((right - left) >> 1)
        if (arr[mid * C] <= num) {
            // 首尾
            if (mid % C === 0 || mid % C === C-1) return mid*C
            if (arr[mid * C + 1 ] <= num) {
                var res = bsearch(arr.slice(mid*C, (mid + 1) * C), num)
                if (res === -1) return -1
                return mid * C + res
            } else return mid * C
        } else {
            left = mid + 1
        }
    }
}
```
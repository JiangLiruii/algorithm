/**
 *  设计一个有 getMin 功能的栈
 *  要求: pop, push, getMin的复杂度均为 O(1)
 */

class CustomStack {
  private real_stack:number[];
  private min_stack:number[];
  private len:number;
  constructor() {
    this.real_stack = [];
    this.min_stack = [];
    this.len = 0
  }
  public push(num:number) {
    this.real_stack.push(num)
    if (this.len === 0) {
      this.min_stack[0] = num
    } else {
      const min_num = this.min_stack[this.len - 1];
      min_num > num ? (this.min_stack[this.len] = num) : (this.min_stack[this.len] = min_num)
    }
    this.len += 1;
  }
  public pop() {
    this.len -= 1;
    this.min_stack.pop();
    return this.real_stack.pop()
  }
  public getMin() {
    return this.min_stack[this.len - 1]
  }
}

const s = new CustomStack();
s.push(1)
s.push(2)
s.push(10)
s.push(4)
console.assert(s.getMin() === 1)

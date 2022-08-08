# class 的定义

```js
class Point {
  yy = 0; // 定义在实例上
  #aa = 1; // 定义私有属性 es2022 新添加的写法
  static bb = 2; // 定义类静态属性，等同于 Point.bb = 2
  constructor () {
    // 定义在实例上
    this.x = 0
    this.y = 1
    console.log(this.#aa) // 1
  }
  
  static {
    // do something; 静态代码块，类第一次被加载时执行
  }

  // 定义在原型上
  get p () {
    return 0
  }

  // 定义在原型上，且 enumerable 为 false
  toPoint () {
    return this.x + '-' + this.y
  }
}

Point.prototype.toX = function () {}
// 注意：定义在原型上的 xx 属性将会因为是对象的原因，对 xx 的变更将会影响到所有实例。
Point.prototype.xx = []
Point.prototype.cc = 0

new Point().xx.push(1)
new Point().cc = 1
console.log(new Point().xx); // [1]，注意此处输出的不是 []
console.log(new Point().cc); // 0，值类型会被重新赋为原型上定义的初始值，而对象类型则不会
console.log(new Point().#aa); // 语法报错
console.log(new Point().aa);  // undefined
```

`Object.getOwnPropertyDescriptors(new Point())`输出：
```js
{
  yy: { value: 0, writable: true, enumerable: true, configurable: true },
  x: { value: 0, writable: true, enumerable: true, configurable: true },
  y: { value: 1, writable: true, enumerable: true, configurable: true }
}
```

`Object.getOwnPropertyDescriptors(Point.prototype)`输出：
```js
{
  constructor: {
    value: [class Point],
    writable: true,
    enumerable: false,
    configurable: true
  },
  p: {
    get: [Function: get p],
    set: undefined,
    enumerable: false,
    configurable: true
  },
  toPoint: {
    value: [Function: toPoint],
    writable: true,
    enumerable: false,
    configurable: true
  },
  toX: {
    value: [Function],
    writable: true,
    enumerable: true,
    configurable: true
  },
  xx: { value: [], writable: true, enumerable: true, configurable: true }
}
```

class语法糖的本质：
```
Point === Point.prototype.constructor // true
```

# 类比 es5

class语法糖相当于es5的：
```
function Point () {
  this.x = 0
  this.y = 0
}

Point.prototype.toPoint = function () {
    return this.x + '-' + this.y
}



```


# 确定构造是否通过`new`实例化被调用

```js
class Point {
    constructor () {
        if (new.target === Point) {
            // success
            return this
        }
        throw new Error('can not instance from other method.')
    }
}
```

const p = new Point();
const p1 = Point.call(p, null); // 报错

```js
class AbstractBase {
    constructor () {
        if (new.target === AbstractBase) {
            throw new Error('该类不能被实例化，需继承方可实例化！')
        }
    }
}
```

new AbstractBase(); // 报错

# 严格模式

`class`写法不存在类型提升，类和模块的内部，默认就是严格模式，所以不需要使用`use strict`指定运行模式。只要你的代码写在类或模块之中，就只有严格模式可用。

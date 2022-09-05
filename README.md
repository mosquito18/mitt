# mitt

## 实现
主要导出mitt([all])函数，调用该函数返回一个 emitter对象，该对象包含all、on(type, handler)、off(type, [handler])和emit(type, [evt])这几个属性。

1. all = all || new Map() mitt 支持传入 all 参数用来存储事件类型和事件处理函数的映射Map，如果不传，就 new Map()赋值给 all
2. on(type, handler)定义函数 on来注册事件，以type为属性，[handler]为属性值，存储在 all 中，属性值为数组的原因是可能存在监听一个事件，多个处理程序
3. off(type, [handler])来取消某个事件的某个处理函数，根据 type 找到对应的事件处理数组，对比 handler 是否相等，相等则删除该处理函数，不传则删除该事件的全部处理函数
4. emit(type, [evt])来派发事件，根据 type 找到对应的事件处理数组并依次执行，传入参数 evt(对象最好，传多个参数只会取到第一个)

## 缺点

1. mitt 支持传入 all 参数，如果 all = {} 而不是 new Map() 那么会报错，不能正常使用，在ts中当然会提醒你，但是如果在js中使用这个库就没有提示，运行时会报错
2. emit(type, [evt])中只能接受一个参数，要是传多个参数需要将多个参数合并成对象传入，然后在事件处理函数中解构

## 学习

1. symbol 一种数据类型
作用：作为属性名避免属性名冲突，生成唯一key值。不会被常规方法遍历到，为对象定义一些非私有的、但又希望只用于内部的方法。

2. TS
- `<Events extends Record<EventType, unknown>>` 用法
- `all!.get(type)`: !. 告诉ts all必须有值
- never： 表示的是那些永不存在的值的类型。never类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是never的子类型或可以赋值给never类型（除了never本身之外）。 即使any也不可以赋值给never。
    - 总是会抛出异常
    - 根本就不会有返回值的函数表达式
    - 箭头函数表达式的返回值类型

```
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}
```

3. 不改变原来的数组，便捷方法
```
handlers.slice().map((handler) => {
    handler(evt!);
})
```

4. `>>> 0`: 本质上就是保证值有意义（为数字类型），且为正整数，在有效的数组范围内（0 ～ 4294967295）

```
    handlers.splice(handlers.indexOf(handler) >>> 0, 1);

    0.1 >>> 0 -> 0

    1.2 >>> 0 -> 1

    -1 >>> 0 -> 4294967295

```

5. microbundle


# tiny-emitter

## 实现
定义了函数E，修改E.prototype，在原型对象中引入了on(name, callback, ctx)、once(name, callback, ctx)、emit(name)、off(name, callback)四个方法
function E() {

}

E.prototype = {
    on: function (name, callback, ctx) {
        const e = this.e || (this.e = {});

        (e[name] || (e[name] = [])).push({
            fn: callback,
            ctx
        })
        return this
    },
    once: function () {

    },
    emit: function (name) {
        /**
         * slice(start, end) 方法可从已有的数组中返回选定的元素，返回新数组。 start从何处开始
         * call（）和apply（）方法都是在特定的作用域中调用函数，实际上等于设置函数体内this对象的值
         * 
         * Array.prototype.slice.call()可以理解为：
         * 改变数组的slice方法的作用域，在特定作用域中去调用slice方法，
         * call（）方法的第二个参数表示传递给slice的参数即截取数组的起始位置。
         */
    },
    off: function () {

    }
}
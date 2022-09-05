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
    // 只订阅一次
    once: function (name, callback, ctx) {
        const self = this;
        function listener() {
            self.off(name, listener);
            callback.apply(ctx, arguments);
        }
        listener._ = callback
        return this.on(name, listener, ctx)
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
        const data = [].slice.call(arguments, 1);
        const evtArr = ((this.e || (this.e = {}))[name] || []).slice();
        let i = 0;
        const len = evtArr.length;

        for (i; i < len; i++) {
            evtArr[i].fn.apply(evtArr[i].ctx, data);
        }
        return this
    },
    off: function (name, callback) {
        const e = this.e || (this.e = {});
        const evts = e[name];

        let liveEvents = [];
        if (evts && callback) {
            for (var i = 0, len = evts.length; i < len; i++) {
                // 排除 callback 这个函数，之后在派发该事件就不执行 这个处理函数
                // evts[i].fn._ 对应 once 的时候，此时 evts[i].fn 是 listener 函数， evts[i].fn._  === callback
                if (evts[i].fn !== callback && evts[i].fn._ !== callback) {
                    liveEvents.push(evts[i]);
                }
            }
        }

        (liveEvents.length) ? e[name] = liveEvents : delete e[name]

    }
}
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
    emit: function () {

    },
    off: function () {

    }
}
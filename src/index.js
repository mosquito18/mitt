"use strict";
exports.__esModule = true;
/**
 * const emitter = mitt()
 *
 * listen to an event
 * emitter.on('foo', e => console.log('foo', e))
 *
 * listen to all events
 * emitter.on('*', (type, e) => console.log(type, e))
 *
 * fire an event
 * emitter.emit('foo', { a: 'b' })
 *
 * clearing all events
 * emitter.all.clear()
 *
 * working with handler references:
 * function onFoo() { }
 * emitter.on('foo', onFoo)   // listen
 * emitter.off('foo', onFoo)  // unlisten
 */
function mitt(all) {
    all = all || new Map();
    return {
        all: all,
        on: function (type, handler) {
            // !. 告诉ts all必须有值
            var handlers = all.get(type);
            if (handlers) {
                handlers.push(handler);
            }
            else {
                all.set(type, [handler]);
            }
        },
        off: function (type, handler) {
            var handlers = all.get(type);
            if (handlers) {
                if (handler) {
                    // -1 >>> 0   ->  4294967295
                    // handlers.splice(4294967295, 1);  handlers不会被处理
                    handlers.splice(handlers.indexOf(handler) >>> 0, 1);
                }
                else {
                    all.set(type, []);
                }
            }
        },
        emit: function (type, evt) {
            var handlers = all.get(type);
            if (handlers) {
                // slice返回新数组，原来数组不会被处理
                handlers.slice().map(function (handler) {
                    handler(evt);
                });
            }
            handlers = all.get('*');
            if (handlers) {
                handlers.slice().map(function (handler) {
                    handler(type, evt);
                });
            }
        }
    };
}
exports["default"] = mitt;

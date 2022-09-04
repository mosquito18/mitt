/**
 * symbol 一种数据类型
 * 作用：作为属性名避免属性名冲突，生成唯一key值。不会被常规方法遍历到，为对象定义一些非私有的、但又希望只用于内部的方法。
 */
export type EventType = string | symbol;

export type Handler<T = unknown> = (event: T) => void;
export type WildcardHandler<T = Record<string, unknown>> = (
    type: keyof T,
    event: T[keyof T]
) => void;

export type EventHandlerList<T = unknown> = Array<Handler<T>>
export type WildCardEventHandlerList<T = Record<string, unknown>> = Array<WildcardHandler<T>>


export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
    keyof Events | '*',
    EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>
>

export interface Emitter<Events extends Record<EventType, unknown>> {
    all: EventHandlerMap<Events>;

    on<Key extends keyof Events>(type: Key, handler: Handler<Events[keyof Events]>): void;
    on(type: '*', handler: WildcardHandler<Events>): void;

    off<Key extends keyof Events>(type: Key, handler?: Handler<Events[keyof Events]>): void;
    off(type: '*', handler: WildcardHandler<Events>): void;

    emit<Key extends keyof Events>(type: Key, event: Events[Key]): void;
    // TODO:
}

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

export default function mitt<Events extends Record<EventType, unknown>>(
    all?: EventHandlerMap<Events>
): Emitter<Events> {
    type GenericEventHandler =
        | Handler<Events[keyof Events]>
        | WildcardHandler<Events>;
    all = all || new Map();
    return {
        all,
        on<Key extends keyof Events>(type: Key, handler: GenericEventHandler) {
            // !. 告诉ts all必须有值
            const handlers: Array<GenericEventHandler> | undefined = all!.get(type);
            if (handlers) {
                handlers.push(handler)
            } else {
                all!.set(type, [handler] as EventHandlerList<Events[keyof Events]>);
            }
        },
        off<Key extends keyof Events>(type: Key, handler?: GenericEventHandler) {
            const handlers: Array<GenericEventHandler> | undefined = all!.get(type);
            if (handlers) {
                if (handler) {
                    // -1 >>> 0   ->  4294967295
                    // handlers.splice(4294967295, 1);  handlers不会被处理
                    handlers.splice(handlers.indexOf(handler) >>> 0, 1);
                }
                else {
                    all!.set(type, []);
                }
            }

        },
        emit<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
            let handlers = all!.get(type);
            if (handlers) {
                // slice返回新数组，原来数组不会被处理
                handlers.slice().map((handler) => {
                    handler(evt!);
                })
            }
            handlers = all!.get('*');
            if (handlers) {
                handlers.slice().map((handler) => {
                    handler(type, evt!);
                })
            }
        }
    }
}
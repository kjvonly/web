import { writable } from "svelte/store";


let storeName: string = "bufferStore"

const _bufferStore = () => {

    const { set, update, subscribe } = writable<Map<string, any>>(new Map<string, any>());

    return {

        subscribe,
        set: set,
        update: update,
        reset: () => update((self: Map<string, any>) => {
            self.clear()
            return self;
        }),
        useLocalstorage: () => {
            subscribe((val) => {
                if (val.size > 0) {
                    localStorage.setItem(storeName, JSON.stringify(Array.from(val.entries())))
                }
            })

            let bs = localStorage.getItem(storeName)
            if (bs != "undefined" && bs !== undefined && bs !== null) {
                let map = JSON.parse(bs)
                set(new Map(map))
            }
        },
        add: (key: string, a: any) => update((self: Map<string, any>) => {
            self.set(key, a)
            return self;
        }),

        delete: (key: string) => update((self: Map<string, any>) => {
            self.delete(key)
            return self;
        })
    }
};

export const bufferStore = _bufferStore();
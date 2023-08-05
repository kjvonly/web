import { writable, get } from "svelte/store";


class Expression {
    addends: string[] = [];

    add(addend: string) {
        if (!addend) {
            return;
        }

        if (this.addends.length === 2) {
            this.addends = [];
        }

        if (addend) {
            this.addends.push(addend);
        }

    }

    clear() {
        this.addends = [];
    }

    toString(): string {
        if (this.addends.length === 0) {
            return '';
        }

        return this.addends.reduce((pv, cv, i, a) => {
            return pv + ' ' + cv;
        });
    }
}


interface keydownStore {

    selectedBufferKeyBindings: Map<string, Function>
    paneKeyBindings: Map<string, Function>

};




const _keydownStore = () => {

    const { set, update, subscribe } = writable<keydownStore>({
        selectedBufferKeyBindings: new Map<string, Function>(),
        paneKeyBindings: new Map<string, Function>(),
    });

    return {
        subscribe,
        set: set,
        update: update,
        add: () => {
            document.addEventListener('keydown', (event: KeyboardEvent) => { kde.keydown(event) });
        },
        updatePaneKeybindings: (map: Map<string, Function>): void =>
            update((self: keydownStore) => {
                self.paneKeyBindings = map
                return self;
            }),

        updateSelectedBufferKeybindings: (map: Map<string, Function>): void =>
            update((self: keydownStore) => {
                self.selectedBufferKeyBindings = map
                return self
            })

    }
};
export const keydownStore = _keydownStore();

let e = new Expression()
class KeyDownEvent {
    maps: Map<String, Function>[]
    constructor() {
        this.maps =  []
        keydownStore.subscribe((v: keydownStore) => {
            this.maps = [v.selectedBufferKeyBindings, v.paneKeyBindings]
        })
    }

    getFunc(cmd: string): Function | undefined {
        for (let m of this.maps){
            let f = m.get(cmd);
            if (f !== undefined){
                return f
            }
        }
            
        return undefined
    }

    keydown(event: KeyboardEvent) {
        let cmd = '';
        if (event.repeat === true){
            return
        }

        if (event.shiftKey) {
            cmd += 'shift+';
        }

        if (
            (event.shiftKey) &&
            event.key !== 'Shift'
        ) {
            cmd += event.key;
            e.add(cmd);
        } else if (!event.shiftKey && e.addends.length === 1) {
            cmd += event.key
            e.add(cmd)
        }

        let c = this.getFunc(e.toString())
        if (c !== undefined) {
            e.clear();    
            c();
        }
    }
}

let kde = new KeyDownEvent()
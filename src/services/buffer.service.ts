import { NullBuffer, Buffer } from "../models/buffer.model";
import { componentMapping } from "./component-mapping.service";

export class BufferService {

    set(val: Buffer){
        if (!(val instanceof NullBuffer)) {
            localStorage.setItem(`buffer_${val.name}`, JSON.stringify(val));
        }
    }

    get(name: string): Buffer {
        let buff = localStorage.getItem(`buffer_${name}`);
        if (!buff) {
            return new NullBuffer()
        }
        let b = JSON.parse(buff) as Buffer;
        b.onFocus = () => {};
        b.keyboardBindings = new Map<string, Function>();
        b.component = componentMapping.getCompoent(b.componentName)
        return b
    }
}

export let bufferService = new BufferService();

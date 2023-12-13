import { NullBuffer, Buffer } from '../models/buffer.model';
import { bufferStore } from '../stores/buffer.store';
import { keydownStore } from './keydown.service';
export class CurrentBuffer {
	private buffer: Buffer = new NullBuffer();

	get() {
		return this.buffer;
	}

	set(b: Buffer) {
		this.buffer.selected = false;
		if (!(this.buffer instanceof NullBuffer)) {
			bufferStore.add(this.buffer.key, this.buffer);
		}

		this.buffer = b;
		this.buffer.selected = true;
		keydownStore.updateSelectedBufferKeybindings(b.keyboardBindings);
		this.buffer.onFocus();
		if (!(this.buffer instanceof NullBuffer)) {
			bufferStore.add(this.buffer.key, this.buffer);
		}
	}
}

export let currentBuffer = new CurrentBuffer();

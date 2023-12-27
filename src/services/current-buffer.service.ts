import { NullBuffer, Buffer } from '../models/buffer.model';
import { keydownStore } from './keydown.service';
export class CurrentBuffer {
	private buffer: Buffer = new NullBuffer();

	get() {
		return this.buffer;
	}

	set(b: Buffer) {
		this.buffer.selected = false;

		this.buffer = b;
		this.buffer.selected = true;
		keydownStore.updateSelectedBufferKeybindings(b.keyboardBindings);
		this.buffer.onFocus();
	}
}

export let currentBuffer = new CurrentBuffer();

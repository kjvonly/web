import { v4 as uuidv4 } from 'uuid';

export class Buffer {
	key: string = uuidv4();
	component: any;
	componentName: string = '';
	keyboardBindings: Map<string, Function> = new Map<string, Function>();
	selected: boolean = false;
	bag: any = {}; // for persistence
	onFocus: Function = () => {};
}

export class NullBuffer extends Buffer {
	componentName: string = 'NullBuffer';
}

class AddBufferError extends Error {}

class bufferService {
	currentBuffer: Buffer = new NullBuffer();

	constructor() {}

	updateComponent(component: any) {
		this.currentBuffer.component = component;
	}
}

export let BufferService = new bufferService();

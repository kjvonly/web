/**
 * A Pane is a node structures. Each pane consist of a left or right 
 * pane or a buffer. A leaf pane always has a NullBuffer.
 * 
 * The PaneService is responsible for tracking pane data structure,
 * including current selected pane and pane buffer
 * 
 * When modifying a buffer access the buffer via the Pane data structure.
 * TODO - make all functions accept a Pane object to avoid possibility 
 * of modifying a buffer without the associated pane.
 */

import { NullBuffer, Buffer } from '../models/buffer.model';
import { NullPane, Pane, PaneSplit } from '../models/pane.model';
import { currentBuffer } from './current-buffer.service';
import { componentMapping } from './component-mapping.service';
import { Queue } from '../utils/queue';
import { paneStore } from '../stores/pane.store';

export class PaneService {
	private rootPane: Pane = new NullPane();

	getCurrent(): Pane {
		let key = currentBuffer.get().key;
		return this.findBufferPane(key, this.rootPane);
	}

	findBufferPane(key: string, pane: Pane | null): Pane {
		if (!pane || pane instanceof NullPane) {
			return new NullPane();
		}

		if (pane.split === PaneSplit.Null && pane.buffer.key === key) {
			return pane;
		}

		// recurse left panes
		let newPane = this.findBufferPane(key, pane.leftPane);

		if (!(newPane instanceof NullPane)) {
			return newPane;
		}

		// recurse right panes
		newPane = this.findBufferPane(key, pane.rightPane);

		if (!(newPane instanceof NullPane)) {
			return newPane;
		}

		return new NullPane();
	}

	getPanesWithBuffers(): Pane[] {
		let queue = new Queue<Pane>();
		queue.enqueue(this.rootPane);

		let panesWithBuffers = [];
		while (queue.size() != 0) {
			let currentPane = queue.dequeue();

			if (currentPane?.buffer && currentPane.split === PaneSplit.Null) {
				panesWithBuffers.push(currentPane);
			}

			if (currentPane?.leftPane) {
				queue.enqueue(currentPane.leftPane);
			}

			if (currentPane?.rightPane) {
				queue.enqueue(currentPane.rightPane);
			}
		}

		return panesWithBuffers;
	}

	setCurrentBufferOnLoad() {
		for (var p of this.getPanesWithBuffers()) {
			if (p.buffer.selected) {
				this.setBuffer(p.buffer);
				return;
			}
		}
		this.setBuffer(this.rootPane.buffer);
	}

	goToNextPaneWithBuffer() {
		let p: Pane;
		let next: boolean = false;
		let cb = currentBuffer.get();
		let panes = this.getPanesWithBuffers();
		if (panes.length === 0) {
			return;
		}

		try {
			for (p of panes) {
				if (next) {
					currentBuffer.set(p.buffer);
					return;
				}
				if (p.buffer.key === cb.key) {
					next = true;
				}
			}
			// if on last last buffer. go to first buffer
			currentBuffer.set(panes[0].buffer);
			return;
		} finally {
			this.updatePane();
		}
	}

	selectPane(b: Buffer){
		currentBuffer.set(b);
		this.updatePane();
	}

	deletePane() {
		let cp = this.getCurrent();
		if (cp.id === this.rootPane.id) {
			cp.buffer = new NullBuffer();
			currentBuffer.set(cp.buffer);
			return;
		}

		let pn = cp.parentNode;
		let ppn = pn?.parentNode;

		let paneToReplaceParentPane: Pane | null = null;
		if (pn?.leftPane?.id === cp.id) {
			paneToReplaceParentPane = pn?.rightPane;
		}

		if (pn?.rightPane?.id === cp.id) {
			paneToReplaceParentPane = pn?.leftPane;
		}

		if (ppn && ppn.leftPane && ppn.leftPane.id === pn?.id) {
			ppn.leftPane = paneToReplaceParentPane;

			if (ppn.leftPane) {
				ppn.leftPane.parentNode = ppn;
				currentBuffer.set(ppn.leftPane.buffer);
			}
		}

		if (ppn && ppn.rightPane && ppn.rightPane.id === pn?.id) {
			ppn.rightPane = paneToReplaceParentPane;

			if (ppn.rightPane) {
				ppn.rightPane.parentNode = ppn;
				currentBuffer.set(ppn.rightPane.buffer);
			}
		}

		// if ppn is null pn must be the root pane
		if (ppn === null) {
			if (paneToReplaceParentPane?.buffer) {
				this.rootPane = paneToReplaceParentPane;
				this.rootPane.parentNode = null;
				if (this.rootPane.leftPane) {
					currentBuffer.set(this.rootPane.leftPane.buffer);
				} else if (this.rootPane.rightPane) {
					currentBuffer.set(this.rootPane.rightPane.buffer);
				} else {
					currentBuffer.set(this.rootPane.buffer);
				}
			}
		}
		paneStore.set(this.rootPane);
	}

	updatePane() {
		paneStore.set(this.rootPane);
	}

	setBuffer(b: Buffer) {
		let p = this.getCurrent();
		p.buffer = b;
		currentBuffer.set(b);
		paneStore.set(this.rootPane);
	}

	getRootPane(): Pane {
		return this.rootPane;
	}

	splitPane(paneSplit: PaneSplit) {
		let p = this.getCurrent();
		p.split = paneSplit;

		p.leftPane = new Pane();
		p.leftPane.buffer = p.buffer;
		p.leftPane.parentNode = p;
		p.leftPane.split = PaneSplit.Null;

		p.rightPane = new Pane();
		p.rightPane.buffer = new NullBuffer();
		p.rightPane.parentNode = p;
		p.rightPane.split = PaneSplit.Null;

		p.buffer = new NullBuffer();
		currentBuffer.set(p.leftPane.buffer);
		paneStore.set(this.rootPane);
	}

	constructor() {
		paneStore.subscribe((pane) => {
			if (this.rootPane instanceof NullPane && !(pane instanceof NullPane)) {
				componentMapping.map(pane);
				this.rootPane = pane;
				this.setCurrentBufferOnLoad();
			}
		});
	}
}

export let paneService = new PaneService();

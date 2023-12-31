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
	private _paneStore: any;
	private _currentBuffer: any;

	constructor(ps: any = paneStore, cb: any = currentBuffer) {
		this._paneStore = ps;
		this._currentBuffer = cb;
		this._paneStore.subscribe((pane: Pane) => {
			if (this.rootPane instanceof NullPane && !(pane instanceof NullPane)) {
				componentMapping.map(pane);
				this.rootPane = pane;
				this.setCurrentBufferOnLoad();
			}
		});
	}

	setCurrentBufferOnLoad() {
		for (var p of this.getPanesWithBuffers()) {
			if (p.buffer.selected) {
				this._currentBuffer.set(p.buffer);
				this._paneStore.set(this.rootPane);
				return;
			}
		}
		this._currentBuffer.set(this.rootPane.buffer);
		this._paneStore.set(this.rootPane);
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
		this._paneStore.set(this.rootPane);
	}

	/* tested */
	saveRootPane() {
		this._paneStore.set(this.rootPane);
	}

	getRootPane(): Pane {
		return this.rootPane;
	}

	selectPane(b: Buffer) {
		this._currentBuffer.set(b);
		this.saveRootPane();
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
		this._currentBuffer.set(p.leftPane.buffer);
		this._paneStore.set(this.rootPane);
	}

	setBuffer(b: Buffer) {
		let p = this.getCurrent();
		p.buffer = b;
		this._currentBuffer.set(b);
		this._paneStore.set(this.rootPane);
	}

	getCurrent(): Pane {
		let key = this._currentBuffer.get().key;
		return this.findBufferPane(key, this.rootPane);
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

	goToNextPaneWithBuffer() {
		let p: Pane;
		let next: boolean = false;
		let cb = this._currentBuffer.get();
		let panes = this.getPanesWithBuffers();
		if (panes.length === 0) {
			return;
		}

		try {
			for (p of panes) {
				if (next) {
					this._currentBuffer.set(p.buffer);
					return;
				}
				if (p.buffer.key === cb.key) {
					next = true;
				}
			}
			// if on last last buffer. go to first buffer
			this._currentBuffer.set(panes[0].buffer);
			return;
		} finally {
			this.saveRootPane();
		}
	}
}

export let paneService = new PaneService();

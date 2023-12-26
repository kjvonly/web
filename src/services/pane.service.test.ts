import { assert, beforeEach, describe, expect, it } from 'vitest';
import { PaneService } from './pane.service';

import sinon from 'sinon';
import { NullPane, Pane, PaneSplit } from '../models/pane.model';
import { currentBuffer } from './current-buffer.service';
import { afterEach } from 'node:test';
import { Buffer, NullBuffer } from '../models/buffer.model';

interface IPaneStore {
	subscribe(fn: Function): void;
	set(): void;
}

describe('paneService', () => {
	var paneStore: any;

	const currentBuffer = {
		get: () => { let b = new Buffer(); b.key = '1'; return b; },
		set: (buffer: any) => { }
	};
	var currentBufferMock: sinon.SinonMock;

	var p: Pane;
	var pl: Pane;
	var pr: Pane;
	var pll: Pane;
	var plr: Pane;
	var prl: Pane;
	var prr: Pane;

	beforeEach(() => {
		currentBufferMock = sinon.mock(currentBuffer);

		paneStore = new (class implements IPaneStore {
			subs: Array<Function> = [];
			subscribe(fn: Function) {
				this.subs.push(fn);
			}
			set() { }
		})();

		// parent
		p = new Pane();

		// depth 1
		pl = new Pane();
		pr = new Pane();

		// depth 2
		pll = new Pane();
		plr = new Pane();
		prl = new Pane();
		prr = new Pane();

		// connect depth 1
		p.leftPane = pl;
		p.rightPane = pr;
		p.split = PaneSplit.Vertical;

		// connect depth 2
		// connect left
		pl.leftPane = pll;
		pl.rightPane = plr;
		pl.split = PaneSplit.Horizontal;

		// connect right
		pr.leftPane = prl;
		pr.rightPane = prr;
		pr.split = PaneSplit.Vertical;

	});

	describe('constructor', () => {
		it('should call subscribe on paneStore', () => {
			var spy = sinon.spy(paneStore, 'subscribe');
			new PaneService(paneStore);
			assert(spy.callCount === 1, 'should have called spy once');
		});
	});

	describe('saveRootPane', () => {
		it('should call set on paneStore', () => {
			var spy = sinon.spy(paneStore, 'set');
			new PaneService(paneStore).saveRootPane();
			assert(spy.callCount === 1, 'should have called spy once');
		});
	});

	describe('getRootPane', () => {
		it('should call should be NullPane with empty store', () => {
			let rp = new PaneService(paneStore).getRootPane();
			assert(rp instanceof NullPane);
		});

		it('should be pane from _paneStore.subscribe', () => {
			let ps = new PaneService(paneStore);
			let p = new Pane();
			paneStore.subs[0](p);
			let rp = ps.getRootPane();
			assert(rp.id === p.id, `expected ${rp.id} to equal ${p.id}`);
		});
	});

	describe('selectPane', () => {
		it('should call currentBuffer.set', () => {
			var spy = sinon.spy(paneStore, 'set');
			currentBufferMock.expects('set').calledOnce;
			let ps = new PaneService(paneStore, currentBuffer);
			let b = new NullBuffer();

			ps.selectPane(b);

			currentBufferMock.verify();
			assert(spy.callCount === 1, 'should have called paneStore.set once');
		});
	});

	describe('findBufferPane', () => {
		it('should return null Pane if passed in null pane', () => {
			let ps = new PaneService(paneStore, currentBuffer);
			let p = ps.findBufferPane('12345', null);
			assert(p instanceof NullPane, 'should be instance of NullPane');
		});

		it('should return null Pane if passed in NullPane', () => {
			let ps = new PaneService(paneStore, currentBuffer);
			let p = ps.findBufferPane('12345', new NullPane());
			assert(p instanceof NullPane, 'should be instance of NullPane');
		});

		it('should return itself', () => {
			let ps = new PaneService(paneStore, currentBuffer);
			let p = new Pane();
			let np = ps.findBufferPane(p.buffer.key, p);
			assert(p.id === np.id, 'should be instance same instance');
		});

		it('should return correct pane from key', () => {
			let ps = new PaneService(paneStore, currentBuffer);

			let np = ps.findBufferPane(prr.buffer.key, p);
			assert(prr.id === np.id, 'should be pane prr');

			np = ps.findBufferPane(prl.buffer.key, p);
			assert(prl.id === np.id, 'should be pane prl');

			np = ps.findBufferPane(pll.buffer.key, p);
			assert(pll.id === np.id, 'should be pane pll');
		});
	});

	describe('splitPane', () => {
		it('should split pane vertically', () => {
			var spy = sinon.spy(paneStore, 'set');
			let ps = new PaneService(paneStore, currentBuffer);

			// set rootPane of paneService
			paneStore.subs[0](p)

			ps.getCurrent = () => {
				prl.buffer.bag = "this bag"
				return prl
			}

			let b = prl.buffer
			currentBufferMock.expects('set').withExactArgs(b)

			// before asserts
			assert(prl.split === PaneSplit.Null, 'prl pane should be null before split')

			assert(prl.leftPane === null, 'prl.leftPane should be null')
			assert(prl.rightPane === null, 'prl.RightPane should be null')
			ps.splitPane(PaneSplit.Vertical)

			// prl
			// @ts-ignore
			assert(prl.split === PaneSplit.Vertical)
			assert(prl.buffer.bag !== "this bag")

			// left pane
			assert(prl.leftPane !== null, "leftPane should not be null")
			
			// @ts-ignore						
			assert(prl.leftPane.buffer.bag === "this bag", "leftPane.buffer should be NullBuffer")
			// @ts-ignore
			assert(prl.leftPane.parentNode === prl, "leftPane.parentNode should be prl")


			// right pane
			assert(prl.rightPane !== null, "rightPane should not be null")
			// @ts-ignore
			assert(prl.rightPane.buffer instanceof NullBuffer, "rightPane.buffer should be NullBuffer")
			// @ts-ignore
			assert(prl.rightPane.parentNode === prl, "rightPane.parentNode should be prl")

			currentBufferMock.verify()
			assert(spy.calledWithExactly(p))
		})
	})

	describe('setBuffer', () => {
		it('should set buffer and save root pane', () => {
			var spy = sinon.spy(paneStore, 'set');
			let ps = new PaneService(paneStore, currentBuffer);

			// set rootPane of paneService
			paneStore.subs[0](p)

			ps.getCurrent = () => {
				prl.buffer.bag = "this bag"
				return prl
			}

			let newBuffer = new Buffer()
			currentBufferMock.expects('set').withExactArgs(newBuffer)

			ps.setBuffer(newBuffer)

			currentBufferMock.verify()
			assert(spy.calledWithExactly(p))
		})
	})

	describe('getCurrent', () => {
		it('should get the current pane selected pane', () => {

			var spy = sinon.spy(paneStore, 'set');
			let ps = new PaneService(paneStore, currentBuffer);
			// set rootPane of paneService
			paneStore.subs[0](p)
			ps.findBufferPane = (key: string, pane: Pane): Pane => {
				assert(key === '1')
				assert(pane === p)
				return new Pane()
			}

			ps.getCurrent()
		})
	})

	describe('getPanesWithBuffers', () => {
		it('should return panes when paneSplit is Null', () => {
			let ps = new PaneService(paneStore, currentBuffer);
			// set rootPane of paneService
			paneStore.subs[0](p)
			let panes = ps.getPanesWithBuffers()
			assert(panes.length === 4)
		})
	})

	describe('setCurrentBufferOnLoad', () => {
		it('should set current buffer from saved selected buffer', () => {
			prl.buffer.selected = true


			let ps = new PaneService(paneStore, currentBuffer);
			ps.setBuffer = (b: Buffer) => {
				assert(b === prl.buffer)
			}

			paneStore.subs[0](p)
		})
	})

	describe('goToNextPaneWithBuffer', () => {
		it('should go to next pane with buffer', () => {
			let ps = new PaneService(paneStore, currentBuffer);
			ps.getCurrent = () => {
				return plr
			}

			paneStore.subs[0](p)
			
			currentBufferMock.expects('set').calledWith(prl.buffer)
			ps.goToNextPaneWithBuffer()
			currentBufferMock.verify()

		})

		it('should go to first pane with buffer if on last pane with buffer', () => {
			let ps = new PaneService(paneStore, currentBuffer);
			ps.getCurrent = () => {
				return prr
			}


			paneStore.subs[0](p)

			currentBufferMock.expects('set').calledWith(pll.buffer)


			ps.goToNextPaneWithBuffer()
			currentBufferMock.verify()

		})
	})
});

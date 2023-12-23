import { assert, beforeEach, describe, expect, it } from 'vitest';
import { PaneService } from './pane.service';

import sinon from 'sinon';
import { NullPane, Pane, PaneSplit } from '../models/pane.model';
import { currentBuffer } from './current-buffer.service';
import { afterEach } from 'node:test';
import { NullBuffer } from '../models/buffer.model';

interface IPaneStore {
	subscribe(fn: Function): void;
	set(): void;
}

describe('paneService', () => {
	var paneStore: any;

	const currentBuffer = {
		get: () => {},
		set: () => {}
	};
	var currentBufferMock: sinon.SinonMock;

	beforeEach(() => {
		currentBufferMock = sinon.mock(currentBuffer);

		paneStore = new (class implements IPaneStore {
			subs: Array<Function> = [];
			subscribe(fn: Function) {
				this.subs.push(fn);
			}
			set() {}
		})();
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

			// parent
			let p = new Pane();

			// depth 1
			let pl = new Pane();
			let pr = new Pane();

			// depth 2
			let pll = new Pane();
			let plr = new Pane();
			let prl = new Pane();
			let prr = new Pane();

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

			let np = ps.findBufferPane(prr.buffer.key, p);
			assert(prr.id === np.id, 'should be pane prr');

			np = ps.findBufferPane(prl.buffer.key, p);
			assert(prl.id === np.id, 'should be pane prl');

			np = ps.findBufferPane(pll.buffer.key, p);
			assert(pll.id === np.id, 'should be pane pll');
		});
	});
});

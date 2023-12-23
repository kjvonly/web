import { assert, beforeEach, describe, expect, it } from 'vitest';
import { PaneService } from './pane.service';

import sinon from 'sinon';
import { NullPane, Pane } from '../models/pane.model';
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
});

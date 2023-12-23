import { assert, beforeEach, describe, expect, it } from 'vitest';
import { PaneService } from './pane.service';

import sinon from 'sinon';
import { NullPane, Pane } from '../models/pane.model';


interface IPaneStore {
	subscribe(fn: Function): void
	set(): void
}
describe('paneService', () => {
	var paneStore: any

	beforeEach(() => {
		paneStore = new class implements IPaneStore{
			subs: Array<Function> = []
			subscribe(fn: Function) {
				this.subs.push(fn)
			}
			set() {}
		};
	})


	describe('constructor', () => {

		it('should call subscribe on paneStore', () => {
			var spy = sinon.spy(paneStore, 'subscribe');
			new PaneService(paneStore);
			assert(spy.callCount === 1, 'should have called spy once');
		});


	})

	describe('saveRootPane', () => {
		it('should call set on paneStore', () => {
			var spy = sinon.spy(paneStore, 'set');
			new PaneService(paneStore).saveRootPane();
			assert(spy.callCount === 1, 'should have called spy once');
		});
	})

	describe('getRootPane', () => {
		it('should call should be NullPane with empty store', () => {
			let rp = new PaneService(paneStore).getRootPane()
			assert(rp instanceof NullPane);
		});

		it('should be pane from _paneStore.subscribe', () => {
			let ps = new PaneService(paneStore)
			let p = new Pane()
			paneStore.subs[0](p)
			let rp = ps.getRootPane()
			assert(rp.id === p.id, `expected ${rp.id} to equal ${p.id}`)
		})
	})
})



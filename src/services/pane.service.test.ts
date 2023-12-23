import { assert, beforeEach, describe, expect, it } from 'vitest';
import { PaneService } from './pane.service';

import sinon from 'sinon';

describe('paneService', ()=> {
	var paneStore: any

	beforeEach(() => {
		paneStore  = {
			subscribe: () => {},
			set: () => {}
		};
	})

	it('should call subscribe on paneStore', () => {
		var spy = sinon.spy(paneStore, 'subscribe');
	
		new PaneService(paneStore);
	
		assert(spy.callCount === 1, 'should have called spy once');
	});
	
	it('should call set on paneStore', () => {	
		var spy = sinon.spy(paneStore, 'set');
	
		new PaneService(paneStore).saveRootPane();
	
		assert(spy.callCount === 1, 'should have called spy once');
	});
	
}) 



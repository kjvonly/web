import { assert, describe, expect, it } from 'vitest';
import { PaneService } from './pane.service';

import sinon from 'sinon';

it('should call subscribe on paneStore', () => {
	var paneStore: any = {
		subscribe: () => {},
		set: () => {}
	};

	var spy = sinon.spy(paneStore, 'subscribe');

	new PaneService(paneStore);

	assert(spy.callCount === 1, 'should have called spy once');
});

it('should call set on paneStore', () => {
	var paneStore: any = {
		subscribe: () => {},
		set: () => {}
	};

	var spy = sinon.spy(paneStore, 'set');

	new PaneService(paneStore).updatePane();

	assert(spy.callCount === 1, 'should have called spy once');
});

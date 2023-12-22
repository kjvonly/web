import { assert, describe, expect, it } from 'vitest';
import { PaneService } from './pane.service';

import sinon from 'sinon';

it('should be true', () => {
	var paneStore: any = { subscribe: () => {} };

	var spy = sinon.spy(paneStore, 'subscribe');

	new PaneService(paneStore);

	assert(spy.callCount === 1, 'should have called spy once');
});

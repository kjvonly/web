import { describe, expect, it } from 'vitest';
//import { PaneService } from './pane.service';

import sinon from 'sinon';




it('should be true', () => {

	var paneStore: any = { everything: () => { } }
	
	var mock = sinon.mock(paneStore);
	mock.expects("everything").once();

	paneStore.everything();

	mock.verify()
	
});

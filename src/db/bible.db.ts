import IndexedDb from './idb.db';

export class BibleDB extends IndexedDb {
	resolve: any;
	ready: Promise<boolean | undefined> = new Promise((resolve, reject) => {
		this.resolve = resolve;
	});

	constructor() {
		super('bible');
	}
	delay = (ms) => new Promise((res) => setTimeout(res, ms));

	async init() {
		let val = await this.createObjectStore(['chapters']);
		if (!val) {
			return;
		}

		let v = await this.getValue('chapters', 'booknames');

		if (v === undefined) {
			let worker = new Worker(new URL('../workers/kjvdata.worker?worker', import.meta.url), {
				type: 'module'
			});
			worker.postMessage({});
		}

		let retries = 0;
		let retryMax = 10;

		while (v === undefined || retries == retryMax) {
			await this.delay(1000);
			v = await this.getValue('chapters', 'booknames');
			retries = retries + 1;
		}

		if (retries === retryMax) {
			this.resolve(false);
			return;
		}
		this.resolve(true);
	}
}

export let bibleDB = new BibleDB();

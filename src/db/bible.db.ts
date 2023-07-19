import IndexedDb from "./idb.db";

export class bibleDB extends IndexedDb {
    resolve: any
    ready: Promise<boolean | undefined> = new Promise((resolve, reject) => {
        this.resolve = resolve
    })

    constructor() {
        super('bible')
    }
    delay = ms => new Promise(res => setTimeout(res, ms));

    async init() {
        let val = await this.createObjectStore(['chapters'])
        if (!val) {
            return
        }

        let v = await this.getValue("chapters", "booknames")

        if (v === undefined) {
            let worker = new Worker(
                new URL('../workers/kjvdata.worker?worker', import.meta.url),
                { type: 'module' }
            );
            worker.postMessage({})
        }

        let count = 0
        
        while (v === undefined || count === 6) {
            await this.delay(1000);
            v = this.getValue("chapters", "booknames")
            count = count + 1
        }

        if (count === 6){
            this.resolve(false)
            return
        }
        this.resolve(true)
    }
}

export let BibleDB = new bibleDB()

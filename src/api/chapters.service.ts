import { api } from './api'
import { bibleDB } from '../db/bible.db';

export class ChapterService {

    async getChapter(chapterKey: string): Promise<any> {
        let chapter = await bibleDB.getValue('chapters', chapterKey);
        if (!chapter) {
            return api.get(`/api/chapters/${chapterKey}`);
        }

        return chapter;
    }
}

export let chapterService = new ChapterService()
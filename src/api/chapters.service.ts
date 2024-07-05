import { api } from './api'
import { bibleDB } from '../db/bible.db';

export class ChapterService {

    async getChapter(chapterKey: string): Promise<any> {
        let chapter = undefined
        try {
            chapter = await bibleDB.getValue('chapters', chapterKey);
            
        } catch {
            // TODO report db not ready 
        }

        if (!chapter) {
            return api.get(`/api/chapters/${chapterKey}`);
        }

        return chapter;
    }
}

export let chapterService = new ChapterService()
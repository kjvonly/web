import { api } from './api'

export class ChapterService {

    getChapter(chapterKey: string): any {
        return api.get(`/api/chapters/${chapterKey}`);
    }
}

export let chapterService = new ChapterService()
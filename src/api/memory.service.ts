export class Collection {
    name: string;
    series: Array<Series>;
}
export class Series {
    name: string;
    topics: Array<Topic>
}
export class Topic {
    name: string;
    bcvs: Array<BCV>;
}
/* Book Chapter Verse */
export class BCV {
    book: string;
    chapter: string;
    verse: string;
    topic: string
    series: string;
}

const jsonData: string = `
[
    {
        "name": "Topical Memory System",
        "series": [
            {
                "name": "Series A: Live the New Life",
                "topics": [
                    {
                        "name": "Christ the Center",
                        "bcvs": [
                            {
                                "book": "2 Corinthians",
                                "chapter": "5",
                                "verse": "17"
                            },
                            {
                                "book": "Galatians",
                                "chapter": "2",
                                "verse": "20"
                            }
                        ]
                    },
                    {
                        "name": "Obedience to Christ",
                        "bcvs": [
                            {
                                "book": "Romans",
                                "chapter": "12",
                                "verse": "1"
                            },
                            {
                                "book": "John",
                                "chapter": "14",
                                "verse": "21"
                            }
                        ]
                    },
                    {
                        "name": "God's Word",
                        "bcvs": [
                            {
                                "book": "2 Timothy",
                                "chapter": "3",
                                "verse": "16"
                            },
                            {
                                "book": "Joshua",
                                "chapter": "1",
                                "verse": "8"
                            }
                        ]
                    },
                    {
                        "name": "Prayer",
                        "bcvs": [
                            {
                                "book": "John",
                                "chapter": "15",
                                "verse": "7"
                            },
                            {
                                "book": "Philippians",
                                "chapter": "4",
                                "verse": "6"
                            },
                            {
                                "book": "Philippians",
                                "chapter": "4",
                                "verse": "7"
                            }
                        ]
                    },
                    {
                        "name": "Fellowship",
                        "bcvs": [
                            {
                                "book": "1 John",
                                "chapter": "1",
                                "verse": "3"
                            },
                            {
                                "book": "Hebrews",
                                "chapter": "10",
                                "verse": "24"
                            },
                            {
                                "book": "Hebrews",
                                "chapter": "10",
                                "verse": "25"
                            }
                        ]
                    },
                    {
                        "name": "Witnessing",
                        "bcvs": [
                            {
                                "book": "Matthew",
                                "chapter": "4",
                                "verse": "19"
                            },
                            {
                                "book": "Romans",
                                "chapter": "1",
                                "verse": "16"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Series B: Proclaim Christ",
                "series": []
            },
            {
                "name": "Series C: Rely on God's Resources",
                "series": []
            },
            {
                "name": "Series D: Be Christ's Disciple",
                "series": []
            },
            {
                "name": "Series E: Grow in Christlikeness",
                "series": []
            }
        ]
    }
]
`


export class MemoryService {
    async getCollections(): Promise<any> {
        return Object.assign(new Array<Collection>(), JSON.parse(jsonData))
    }
}

export let memoryService = new MemoryService
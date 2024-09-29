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
}

const jsonData: string = `
[
    {
        "name": "Topical Memory System",
        "series": [
            {
                "name":"Series A: Live the New Life",
                "topics": [
                    {
                        "name": "Christ the Center",
                        "bcvs": [
                            {
                                "book": "2co",
                                "chapter": "5",
                                "verse": "17"
                            },
                            {
                                "book": "gal",
                                "chapter": "2",
                                "verse": "20"
                            }
                        ]
                    },
                    {
                        "name": "Obedience to Christ",
                        "bcvs": [
                            {
                            "book": "rom",
                            "chapter":"12" ,
                            "verse": "1" 
                            },
                            {
                            "book": "joh",
                            "chapter":"14" ,
                            "verse": "21" 
                            }
                        ]
                    },
                    {
                        "name": "God's Word",
                        "bcvs": [
                            {
                            "book": "2ti",
                            "chapter":"3" ,
                            "verse": "16" 
                            },
                            {
                            "book": "jos",
                            "chapter":"1" ,
                            "verse": "8" 
                            }
                        ]
                    },
                    {
                        "name": "Prayer",
                        "bcvs": [
                            {
                            "book": "joh",
                            "chapter":"15" ,
                            "verse": "7" 
                            },
                            {
                            "book": "phi",
                            "chapter":"4" ,
                            "verse": "6" 
                            },
                            {
                            "book": "phi",
                            "chapter":"4" ,
                            "verse": "7" 
                            }
                        ]
                    },
                    {
                        "name": "Fellowship",
                        "bcvs": [
                            {
                            "book": "1jo",
                            "chapter":"1" ,
                            "verse": "3" 
                            },
                            {
                            "book": "heb",
                            "chapter":"10" ,
                            "verse": "24" 
                            },
                            {
                            "book": "heb",
                            "chapter":"10" ,
                            "verse": "25" 
                            }
                        ]
                    },
                    {
                        "name": "Witnessing",
                        "bcvs": [
                            {
                            "book": "mat",
                            "chapter":"4" ,
                            "verse": "19" 
                            },
                            {
                            "book": "rom",
                            "chapter":"1" ,
                            "verse": "16" 
                            }
                        ]
                    }
                ]
            }
        ]
    }
]`


export class MemoryService {
    async getCollections(): Promise<any> {
        return Object.assign(new Array<Collection>(), JSON.parse(jsonData))
    }
}

export let memoryService = new MemoryService
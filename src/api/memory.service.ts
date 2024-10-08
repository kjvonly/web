import { api } from "./api";

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
                "topics": [
                    {
                        "name": "All Have Sinned",
                        "bcvs": [
                            {
                                "book": "Romans",
                                "chapter": "3",
                                "verse": "23"
                            },
                            {
                                "book": "Isaiah",
                                "chapter": "53",
                                "verse": "6"
                            }
                        ]
                    },
                    {
                        "name": "Sin's Penalty",
                        "bcvs": [
                            {
                                "book": "Romans",
                                "chapter": "6",
                                "verse": "23"
                            },
                            {
                                "book": "Hebrews",
                                "chapter": "9",
                                "verse": "27"
                            }
                        ]
                    },
                    {
                        "name": "Christ Paid the Penalty",
                        "bcvs": [
                            {
                                "book": "Romans",
                                "chapter": "5",
                                "verse": "8"
                            },
                            {
                                "book": "1 Peter",
                                "chapter": "3",
                                "verse": "18"
                            }
                        ]
                    },
                    {
                        "name": "Salvation Not By Works",
                        "bcvs": [
                            {
                                "book": "Ephesians",
                                "chapter": "2",
                                "verse": "8"
                            },
                            {
                                "book": "Ephesians",
                                "chapter": "2",
                                "verse": "9"
                            },
                            {
                                "book": "Titus",
                                "chapter": "3",
                                "verse": "5"
                            }
                        ]
                    },
                    {
                        "name": "Must Receive Christ",
                        "bcvs": [
                            {
                                "book": "John",
                                "chapter": "1",
                                "verse": "12"
                            },
                            {
                                "book": "Revelation",
                                "chapter": "3",
                                "verse": "20"
                            }
                        ]
                    },
                    {
                        "name": "Assurance of Salvation",
                        "bcvs": [
                            {
                                "book": "1 John",
                                "chapter": "5",
                                "verse": "13"
                            },
                            {
                                "book": "John",
                                "chapter": "5",
                                "verse": "24"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Series C: Rely on God's Resources",
                "topics": [
                    {
                        "name": "His Spirit",
                        "bcvs": [
                            {
                                "book": "1 Corinthians",
                                "chapter": "3",
                                "verse": "16"
                            },
                            {
                                "book": "1 Corinthians",
                                "chapter": "2",
                                "verse": "12"
                            }
                        ]
                    },
                    {
                        "name": "His Strength",
                        "bcvs": [
                            {
                                "book": "Isaiah",
                                "chapter": "41",
                                "verse": "10"
                            },
                            {
                                "book": "Philippians",
                                "chapter": "4",
                                "verse": "13"
                            }
                        ]
                    },
                    {
                        "name": "His Faithfulness",
                        "bcvs": [
                            {
                                "book": "Lamentations",
                                "chapter": "3",
                                "verse": "22"
                            },
                            {
                                "book": "Lamentations",
                                "chapter": "3",
                                "verse": "23"
                            },
                            {
                                "book": "Numbers",
                                "chapter": "23",
                                "verse": "19"
                            }
                        ]
                    },
                    {
                        "name": "His Peace",
                        "bcvs": [
                            {
                                "book": "Isaiah",
                                "chapter": "26",
                                "verse": "3"
                            },
                            {
                                "book": "1 Peter",
                                "chapter": "5",
                                "verse": "7"
                            }
                        ]
                    },
                    {
                        "name": "His Provision",
                        "bcvs": [
                            {
                                "book": "Romans",
                                "chapter": "8",
                                "verse": "32"
                            },
                            {
                                "book": "Philippians",
                                "chapter": "4",
                                "verse": "19"
                            }
                        ]
                    },
                    {
                        "name": "His Help in Temptation",
                        "bcvs": [
                            {
                                "book": "Hebrews",
                                "chapter": "2",
                                "verse": "18"
                            },
                            {
                                "book": "Psalm",
                                "chapter": "119",
                                "verse": "9"
                            },
                            {
                                "book": "Psalm",
                                "chapter": "119",
                                "verse": "11"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Series D: Be Christ's Disciple",
                "topics": [
                    {
                        "name": "Put Christ First",
                        "bcvs": [
                            {
                                "book": "Matthew",
                                "chapter": "6",
                                "verse": "33"
                            },
                            {
                                "book": "Luke",
                                "chapter": "9",
                                "verse": "23"
                            }
                        ]
                    },
                    {
                        "name": "Separate from the World",
                        "bcvs": [
                            {
                                "book": "1 John",
                                "chapter": "2",
                                "verse": "15"
                            },
                            {
                                "book": "1 John",
                                "chapter": "2",
                                "verse": "16"
                            },
                            {
                                "book": "Romans",
                                "chapter": "12",
                                "verse": "2"
                            }
                        ]
                    },
                    {
                        "name": "Be Steadfast",
                        "bcvs": [
                            {
                                "book": "1 Corinthians",
                                "chapter": "15",
                                "verse": "58"
                            },
                            {
                                "book": "Hebrews",
                                "chapter": "12",
                                "verse": "3"
                            }
                        ]
                    },
                    {
                        "name": "Serve Others",
                        "bcvs": [
                            {
                                "book": "Mark",
                                "chapter": "10",
                                "verse": "45"
                            },
                            {
                                "book": "2 Corinthians",
                                "chapter": "4",
                                "verse": "5"
                            }
                        ]
                    },
                    {
                        "name": "Give Generously",
                        "bcvs": [
                            {
                                "book": "Proverbs",
                                "chapter": "3",
                                "verse": "9"
                            },
                            {
                                "book": "Proverbs",
                                "chapter": "3",
                                "verse": "10"
                            },
                            {
                                "book": "2 Corinthians",
                                "chapter": "9",
                                "verse": "6"
                            },
                            {
                                "book": "2 Corinthians",
                                "chapter": "9",
                                "verse": "7"
                            }
                        ]
                    },
                    {
                        "name": "Develop World Vision",
                        "bcvs": [
                            {
                                "book": "Acts",
                                "chapter": "1",
                                "verse": "8"
                            },
                            {
                                "book": "Matthew",
                                "chapter": "28",
                                "verse": "19"
                            },
                            {
                                "book": "Matthew",
                                "chapter": "28",
                                "verse": "20"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Series E: Grow in Christlikeness",
                "topics": [
                    {
                        "name": "Love",
                        "bcvs": [
                            {
                                "book": "John",
                                "chapter": "13",
                                "verse": "34"
                            },
                            {
                                "book": "John",
                                "chapter": "13",
                                "verse": "35"
                            },
                            {
                                "book": "1 John",
                                "chapter": "3",
                                "verse": "18"
                            }
                        ]
                    },
                    {
                        "name": "Humility",
                        "bcvs": [
                            {
                                "book": "Philippians",
                                "chapter": "2",
                                "verse": "3"
                            },
                            {
                                "book": "Philippians",
                                "chapter": "2",
                                "verse": "4"
                            },
                            {
                                "book": "1 Peter",
                                "chapter": "5",
                                "verse": "5"
                            },
                            {
                                "book": "1 Peter",
                                "chapter": "5",
                                "verse": "6"
                            }
                        ]
                    },
                    {
                        "name": "Purity",
                        "bcvs": [
                            {
                                "book": "Ephesians",
                                "chapter": "5",
                                "verse": "3"
                            },
                            {
                                "book": "1 Peter",
                                "chapter": "2",
                                "verse": "11"
                            }
                        ]
                    },
                    {
                        "name": "Honesty",
                        "bcvs": [
                            {
                                "book": "Leviticus",
                                "chapter": "19",
                                "verse": "11"
                            },
                            {
                                "book": "Acts",
                                "chapter": "24",
                                "verse": "16"
                            }
                        ]
                    },
                    {
                        "name": "Faith",
                        "bcvs": [
                            {
                                "book": "Hebrews",
                                "chapter": "11",
                                "verse": "6"
                            },
                            {
                                "book": "Romans",
                                "chapter": "4",
                                "verse": "20"
                            },
                            {
                                "book": "Romans",
                                "chapter": "4",
                                "verse": "21"
                            }
                        ]
                    },
                    {
                        "name": "Good Works",
                        "bcvs": [
                            {
                                "book": "Galatians",
                                "chapter": "6",
                                "verse": "9"
                            },
                            {
                                "book": "Galatians",
                                "chapter": "6",
                                "verse": "10"
                            },
                            {
                                "book": "Matthew",
                                "chapter": "5",
                                "verse": "16"
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
`


export class MemoryService {
    async getCollections(): Promise<any> {
        return Object.assign(new Array<Collection>(), JSON.parse(jsonData))

//        return api.post("/v1/MemoryService.GetCollections", {})
    }
}

export let memoryService = new MemoryService
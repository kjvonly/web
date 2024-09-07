<script lang="ts">
	import { onMount } from 'svelte';
	import type { Buffer } from '../../models/buffer.model';
	import Card from '../card/card.svelte';
	import { chapterService } from '../../api/chapters.service';


	export let buffer: Buffer;
	let popup: any;

	let verse = '';
	let a = '/api/media/verses/01_Genesis_001_002';
    let bookNames: any = {}

    function renderBookChapterVerses(){
        let bcvc = bookNames["bookchapterversecountById"]
        let bookIds = bcvc.keys().sort()
        let verses: Array<any> = []
        bookIds.forEach((bookId: string) => {
            let chapterIds  = bcvc[bookId].keys().sort()
            chapterIds.forEach((chapter: string)=> {
                let verseCount: number = bcvc[bookId][chapter]
                let bookName = bookNames["booknamesById"][bookId]
                let range = (n: number) => Array.from(Array(n).keys())
                range(verseCount).forEach(element => {
                    let chapterNumber = String(chapter).padStart(2, '0');
                    let mp3FileName = `${chapter}`
                   verses.push()
                });
            });
        });


    }

	onMount(() => {
        chapterService.getChapter("booknames").then((data: any) => {
			bookNames = data;
            renderBookChapterVerses()
		});

		const audioElement = document.querySelector('audio');
        if (audioElement != null){
            audioElement.addEventListener('ended', () => {
			audioElement.play();
		});
        }
	});
</script>

<Card bind:buffer bind:popup>
	<div slot="body" let:bodyHeight>
		<button
			on:click={() => {
				verse = a;
			}}>click</button
		>
		<div class="kjv-memory" style="max-height: {bodyHeight}px;">
			<audio controls src={verse}></audio>
		</div>
	</div>
</Card>

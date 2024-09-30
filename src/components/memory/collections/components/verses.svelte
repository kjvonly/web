<script lang="ts">
	import { onMount } from 'svelte';
	import type { BCV } from '../../../../api/memory.service';
	import { chapterService } from '../../../../api/chapters.service';
	import type { Buffer } from '../../../../models/buffer.model';
	import { bufferService } from '../../../../services/buffer.service';
	import { paneService } from '../../../../services/pane.service';

	export let bcvs: Array<BCV> = [];
    export let buffer: Buffer;
	let verse = '';
	let verses: any[] = [];

	let bookNames: any;

	function compareNumbers(a: any, b: any) {
		return a - b;
	}

	function renderBookChapterVerses() {
		let booksByIds: number[] = [];

		Object.keys(bookNames['booknamesById']).forEach((v) => booksByIds.push(Number(v)));
		let booknamesById: any = {};

		for (const [i, value] of booksByIds.sort(compareNumbers).entries()) {
			booknamesById[value] = i + 1;
		}

		bcvs.forEach((v,idx) => {
			let bookId = bookNames['shortNames'][v.book];
			let bookName = bookNames['booknamesById'][bookId];
			let chapter = v.chapter;
			let verseNumber = v.verse;

			let audioBookId = booknamesById[bookId];
			let audioBookIdFormatted = String(audioBookId).padStart(2, '0');
			let bookNameFormatted = bookName;
			let mp3BookNameFormatted = bookName;
			mp3BookNameFormatted = mp3BookNameFormatted.replace('1 ', 'I_');
			mp3BookNameFormatted = mp3BookNameFormatted.replace('2 ', 'II_');
			mp3BookNameFormatted = mp3BookNameFormatted.replace('3 ', 'III_');

			let chapterNumberFormatted = String(chapter).padStart(3, '0');
			let verseNumberFormatted = String(verseNumber + 1).padStart(3, '0');

			let mp3FileName = `${audioBookIdFormatted}_${mp3BookNameFormatted}_${chapterNumberFormatted}_${verseNumberFormatted}`;
			let displayBCV = `${bookNameFormatted} ${chapter}:${verseNumber + 1}`;
			let verse = { filename: mp3FileName, bcv: displayBCV, checked: true };
			verses.push(verse);
		});
	}
	onMount(() => {
		chapterService.getChapter('booknames').then((data: any) => {
			bookNames = data;

			renderBookChapterVerses();

            if (buffer && buffer.bag && buffer.bag.selectedVerses) {
				playSelectedVerses();
			}

			
		});
        audioElement = document.querySelector('audio');
			if (audioElement != null) {
				audioElement.addEventListener('ended', () => {
					setTimeout(() => {
						playSelectedVerses();
					}, 2000);
				});
			}
	});

	let audioElement: HTMLAudioElement | null;

    function getAudioApiPath(filename: number) {
		return '/api/media/verses/' + filename
	}

	let currentAudioVerseIdx: number = 0;
	function playSelectedVerses() {

		let v = verses[currentAudioVerseIdx];
		verse = getAudioApiPath(v["filename"]);
		audioElement?.play();
        currentAudioVerseIdx = currentAudioVerseIdx + 1;
	}


	function playlistVerseSelected(verseIdx: number, idx: number) {
		verses[verseIdx]['checked'] = !verses[verseIdx]['checked']
		paneService.saveRootPane();
	}
</script>

<div class="kjv-memory-header h-100 w-100">
    <audio controls autoplay src={verse}></audio>
</div>
    <div class="kjv-memory-verse-list p-3" >
        <div class="row">
            <div class="col-6">
                {#each verses as verseIdx, idx}
                    <div class="d-flex flex-row">
                        <input
                            on:click={() => playlistVerseSelected(verseIdx, idx)}
                            type="checkbox"
                            bind:checked={verses[verseIdx]['checked']}
                            bind:value={verses[verseIdx]['checked']}
                        /> <span class="ps-2">{verses[verseIdx]['bcv']}</span>
                    </div>
                {/each}
            </div>
        </div>
</div>
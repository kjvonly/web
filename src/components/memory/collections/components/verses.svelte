<script lang="ts">
	import { onMount } from 'svelte';
	import type { BCV } from '../../../../api/memory.service';
	import { chapterService } from '../../../../api/chapters.service';
	import type { Buffer } from '../../../../models/buffer.model';
	import { bufferService } from '../../../../services/buffer.service';
	import { paneService } from '../../../../services/pane.service';

	export let bcvs: Array<BCV> = [];
	export let buffer: Buffer;
	export let height: number | undefined;

	let mp3Filepath: string | undefined = '';
	let verses: any[] = [];
	let verse: any = '';

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

		bcvs.forEach((v, idx) => {
			let bookID = bookNames['booknamesByName'][v.book];
			let bookName = bookNames['booknamesById'][bookID];
			let chapter = v.chapter;
			let verseNumber = v.verse;

			let audioBookId = booknamesById[bookID];
			let audioBookIdFormatted = String(audioBookId).padStart(2, '0');
			let bookNameFormatted = bookName;
			let mp3BookNameFormatted = bookName;
			mp3BookNameFormatted = mp3BookNameFormatted.replace('1 ', 'I_');
			mp3BookNameFormatted = mp3BookNameFormatted.replace('2 ', 'II_');
			mp3BookNameFormatted = mp3BookNameFormatted.replace('3 ', 'III_');

			let chapterNumberFormatted = String(chapter).padStart(3, '0');
			let verseNumberFormatted = String(verseNumber).padStart(3, '0');

			let mp3FileName = `${audioBookIdFormatted}_${mp3BookNameFormatted}_${chapterNumberFormatted}_${verseNumberFormatted}`;
			let displayBCV = `${bookNameFormatted} ${chapter}:${verseNumber}`;
			let verse = {
				bookID: bookID,
				bcv: v,
				filename: mp3FileName,
				displayBCV: displayBCV,
				checked: true
			};
			verses.push(verse);
			verses = verses;
			buffer.bag.verses = verses;
		});
	}
	onMount(() => {
		chapterService.getChapter('booknames').then((data: any) => {
			bookNames = data;

			renderBookChapterVerses();

			if (buffer && buffer.bag && buffer.bag.verses) {
				playSelectedVerses();
			}

			bufferService.set(buffer);
			paneService.saveRootPane();
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
		return '/api/media/verses/' + filename;
	}

	let currentAudioVerseIdx: number = -1;
    let skipped = 0;
	function playSelectedVerses() {
        currentAudioVerseIdx = (currentAudioVerseIdx + 1) % verses.length;

        if (skipped > verses.length){
            console.log("exiting playSelectedVerses recursion")
            skipped = 0;
            return
        }
		let v = verses[currentAudioVerseIdx];
		if (v['checked']) {
			mp3Filepath = getAudioApiPath(v['filename']);
			chapterService.getChapter(v['bookID'] + '_' + v['bcv']['chapter']).then((data) => {
				verse = data['verseMap'][v['bcv']['verse']];
			});
            
			
		} else {
            skipped = skipped + 1
            currentAudioVerseIdx = (currentAudioVerseIdx + 1) % verses.length;
            playSelectedVerses()
        }

		
	}

	function playlistVerseSelected(idx: number) {
		verses[idx]['checked'] = !verses[idx]['checked'];

		verses = verses;
	}
</script>

<div class="p-3 d-flex flex-column align-items-between w-100 h-100" style="maxHeight: {height}px">
	<div class="kjv-verses-list h-25">
		{#each verses as verseIdx, idx}
			<div class="d-flex flex-row">
				<input
					on:click={() => playlistVerseSelected(idx)}
					type="checkbox"
					bind:checked={verses[idx]['checked']}
					
				/> <span class="ps-2">{verses[idx]['displayBCV']}</span>
			</div>
		{/each}
	</div>
	<div class="d-flex flex-column">
		{#if verses.length > 0}
			<span class="kjv-verses-content">{verses[currentAudioVerseIdx]['bcv']['series']}</span>
			<span class="kjv-verses-content">{verses[currentAudioVerseIdx]['bcv']['topic']}</span>
			<span class="kjv-verses-content">{verses[currentAudioVerseIdx]['displayBCV']}</span>
			<span>{verse}</span>
		{/if}
	</div>

	<span class="d-flex flex-fill justify-content-center w-100"></span>

	<audio controls autoplay src={mp3Filepath}></audio>
</div>

<style>
	.kjv-verses-content {
		margin-bottom: 0.5rem;
	}

	.kjv-verses-list {
		overflow-y: scroll;
		max-height: 25vh !important;
	}
</style>

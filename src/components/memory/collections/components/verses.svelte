<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { BCV } from '../../../../api/memory.service';
	import { chapterService } from '../../../../api/chapters.service';
	import type { Buffer } from '../../../../models/buffer.model';
	import { bufferService } from '../../../../services/buffer.service';
	import { paneService } from '../../../../services/pane.service';
	import { Icon } from 'svelte-awesome';
	import { check, remove } from 'svelte-awesome/icons';

	export let bcvs: Array<BCV> = [];
	export let buffer: Buffer;
	export let height: number | undefined;

	let timeout: NodeJS.Timeout;

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
				timeout = setTimeout(() => {
					playSelectedVerses();
				}, 2000);
			});
		}
	});

	onDestroy(() => {
		clearTimeout(timeout);
	});

	let audioElement: HTMLAudioElement | null;

	function getAudioApiPath(filename: number) {
		return '/api/media/verses/' + filename;
	}

	let currentAudioVerseIdx: number = -1;
	let skipped = 0;
	function playSelectedVerses() {
		currentAudioVerseIdx = (currentAudioVerseIdx + 1) % verses.length;
		if (currentAudioVerseIdx == 0) {
			skipped = 0;
		}

		if (skipped > verses.length) {
			console.log('exiting playSelectedVerses recursion');
			skipped = 0;
			return;
		}
		let v = verses[currentAudioVerseIdx];
		if (v['checked']) {
			mp3Filepath = getAudioApiPath(v['filename']);
			chapterService.getChapter(v['bookID'] + '_' + v['bcv']['chapter']).then((data) => {
				verse = data['verseMap'][v['bcv']['verse']];
			});

			audioElement?.play();
		} else {
			skipped = skipped + 1;
			playSelectedVerses();
		}
	}

	function playlistVerseSelected(idx: number) {
		verses[idx]['checked'] = !verses[idx]['checked'];

		verses = verses;
	}

	function playSelectedVerse(idx: number) {
		currentAudioVerseIdx = idx - 1;
		playSelectedVerses();
	}
</script>

<div class="d-flex flex-column align-items-between w-100 h-100" style="maxHeight: {height}px">
	<div class="kjv-verses-list p-3 h-25">
		{#each verses as verseIdx, idx}
			<div class="d-flex flex-row kjv-verse-list-item">
				<div on:click={() => playSelectedVerse(idx)} class="ms-2">
					<span class="kjv-verse-list-item-text">{verses[idx]['displayBCV']}</span>
				</div>
				<span class="d-flex flex-fill"></span>

				{#if verses[idx]['checked']}
					<div on:click={() => playlistVerseSelected(idx)}>
						<Icon data={check}></Icon>
					</div>
				{/if}
				{#if !verses[idx]['checked']}
					<div on:click={() => playlistVerseSelected(idx)}>
						<Icon data={remove}></Icon>
					</div>
				{/if}
			</div>
		{/each}
	</div>
	<div class="kjv-verses-content-container d-flex">
		<div class="p-3 d-flex flex-column">
			{#if verses.length > 0}
				<span class="kjv-verses-content-topic kjv-verses-content"
					>{verses[currentAudioVerseIdx]['bcv']['topic']}</span
				>
				<span class="kjv-verses-content-verese kjv-verses-content"
					>{verses[currentAudioVerseIdx]['displayBCV']}</span
				>
				<span class="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{verse}</span>
				<div class="d-flex justify-content-end">
					<span class="kjv-verses-content-verese kjv-verses-content"
						>{verses[currentAudioVerseIdx]['displayBCV']}</span
					>
				</div>
				<span class="kjv-verses-content-series kjv-verses-content"
					>{verses[currentAudioVerseIdx]['bcv']['series']}</span
				>
			{/if}
		</div>
	</div>

	<span class="d-flex flex-fill justify-content-center w-100"></span>
	<div class="p-3 d-flex w-100">
		<audio class="w-100" controls autoplay src={mp3Filepath}></audio>
	</div>
</div>

<style>
</style>

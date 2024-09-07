<script lang="ts">
	import { onMount } from 'svelte';
	import type { Buffer } from '../../models/buffer.model';
	import Card from '../card/card.svelte';
	import { chapterService } from '../../api/chapters.service';

	export let buffer: Buffer;
	let popup: any;

	let verse = '';
	let a = '/api/media/verses/01_Genesis_001_002';
	let bookNames: any = {};
	$: verses = [];

	function compareNumbers(a, b) {
		return a - b;
	}

	function renderBookChapterVerses() {
		let booksByIds = [];

		Object.keys(bookNames['booknamesById']).forEach((v) => booksByIds.push(Number(v)));
		let booknamesById = {};

		for (const [i, value] of booksByIds.sort(compareNumbers).entries()) {
			booknamesById[value] = i + 1;
		}
		console.log(booknamesById);
		let bcvc = bookNames['bookchapterversecountById'];
		let bookIds: number[] = [];

		Object.keys(bcvc).forEach((v) => {
			bookIds.push(Number(v));
		});

		bookIds.sort(compareNumbers).forEach((bookId: any) => {
			let bookChapters = bcvc[bookId];
			let chapterIds: number[] = [];
			Object.keys(bookChapters).forEach((v) => chapterIds.push(Number(v)));
			chapterIds.sort(compareNumbers).forEach((chapter: number) => {
				let verseCount: any = bookChapters[chapter];
				let bookName = bookNames['booknamesById'][bookId];
				let range = (n: number) => Array.from(Array(n).keys());
				range(verseCount).forEach((verseNumber) => {
					let audioBookId = booknamesById[bookId];
					let audioBookIdFormatted = String(audioBookId).padStart(2, '0');
					let bookNameFormatted = bookName;
					let chapterNumberFormatted = String(chapter).padStart(3, '0');
					let verseNumberFormatted = String(verseNumber + 1).padStart(3, '0');

					let mp3FileName = `${audioBookIdFormatted}_${bookNameFormatted}_${chapterNumberFormatted}_${verseNumberFormatted}`;
					let displayBCV = `${bookNameFormatted} ${chapter}:${verseNumber + 1}`;
					let verse = { filename: mp3FileName, bcv: displayBCV };
					verses.push(verse);
				});
			});
		});

		verses = verses;
		console.log(verses);
	}

	onMount(() => {
		chapterService.getChapter('booknames').then((data: any) => {
			bookNames = data;
			renderBookChapterVerses();
		});

		const audioElement = document.querySelector('audio');
		if (audioElement != null) {
			audioElement.addEventListener('ended', () => {
				setTimeout(() => {
					audioElement.play();
				}, 2000);
			});
		}
	});
	function verseSelected(v: any) {
		verse = '/api/media/verses/' + v['filename'];
	}
</script>

<Card bind:buffer bind:popup>
	<div slot="header">
		<div class="kjv-memory">
			<audio controls autoplay src={verse}></audio>
		</div>
	</div>
	<div slot="body" let:bodyHeight>
		<div class="kjv-verse-list" style="max-height: 300px">
			{#each verses as v, i}
				<div class="m-3">
					<span on:click={verseSelected(v)}>{v['bcv']}</span>
				</div>
			{/each}
		</div>
	</div>
</Card>

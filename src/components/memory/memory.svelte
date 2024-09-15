<script lang="ts">
	import { onMount } from 'svelte';
	import type { Buffer } from '../../models/buffer.model';
	import Card from '../card/card.svelte';
	import { chapterService } from '../../api/chapters.service';
	import MobileMenu from '../../menus/mobile-menu.svelte';
	import { v4 as uuidv4 } from 'uuid';

	export let buffer: Buffer;
	let popup: any;
	$: memoryId = '_kjv-memory-' + uuidv4();
	let verse = '';
	let bookNames: any = {};
	let verses: any = [];
	$: searchVerses = [];

	let searchHeight: number;

	let search = '';

	function onChange() {
		searchVerses = verses.filter((v: any) => {
			return v['bcv'].toLowerCase().includes(search.toLowerCase());
		});
	}

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
					let mp3BookNameFormatted = bookName;
					mp3BookNameFormatted = mp3BookNameFormatted.replace('1 ', 'I_');
					mp3BookNameFormatted = mp3BookNameFormatted.replace('2 ', 'II_');
					mp3BookNameFormatted = mp3BookNameFormatted.replace('3 ', 'III_');

					let chapterNumberFormatted = String(chapter).padStart(3, '0');
					let verseNumberFormatted = String(verseNumber + 1).padStart(3, '0');

					let mp3FileName = `${audioBookIdFormatted}_${mp3BookNameFormatted}_${chapterNumberFormatted}_${verseNumberFormatted}`;
					let displayBCV = `${bookNameFormatted} ${chapter}:${verseNumber + 1}`;
					let verse = { filename: mp3FileName, bcv: displayBCV, checked: false };
					verses.push(verse);
				});
			});
		});

		verses = verses;
		searchVerses = [...verses];
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
	<div slot="header" class="h-100 w-100">
		<div class="kjv-memory-header h-100 w-100">
			<audio controls autoplay src={verse}></audio>
		</div>
	</div>
	<div slot="body" let:bodyHeight>
		<div id="{memoryId}-search" bind:clientHeight={searchHeight}>
			<div class="p-2">
				<input bind:value={search} />
				<button on:click={onChange}>Search</button>
			</div>
		</div>
		<div class="kjv-memory-verse-list p-3" style="max-height: {bodyHeight - searchHeight}px">
			<div class="row">
				<div class="col-6">
					{#each searchVerses as v, i}
						<input type="checkbox" bind:checked={v['checked']} /> <span>{v['bcv']}</span>
					{/each}
				</div>
				<div class="col-6">
					{#each searchVerses as v, i}
						<!-- <div on:click={() => verseSelected(v)} class=""> -->
						{#if v['checked']}
							<input type="checkbox" bind:checked={v['checked']} /> <span>{v['bcv']}</span>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>

	<div class="w-100" slot="footer">
		<div class="kjv-memory-footer d-flex align-items-center p-4">
			<MobileMenu></MobileMenu>
		</div>
	</div>
</Card>

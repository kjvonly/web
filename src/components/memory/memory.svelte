<script lang="ts">
	import { onMount } from 'svelte';
	import type { Buffer } from '../../models/buffer.model';
	import Card from '../card/card.svelte';
	import { chapterService } from '../../api/chapters.service';
	import MobileMenu from '../../menus/mobile-menu.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { paneService } from '../../services/pane.service';

	export let buffer: Buffer;
	let popup: any;
	$: memoryId = '_kjv-memory-' + uuidv4();
	let verse = '';
	let bookNames: any = {};
	let verses: any = [];
	$: searchVerses = [];
	$: selectedVerses = [];

	let searchHeight: number;

	let search = '';

	function onChange() {
		let tmpSearchVerses: any = [];
		verses.forEach((v: any, idx: number) => {
			if (v['bcv'].toLowerCase().includes(search.toLowerCase())) {
				tmpSearchVerses.push(idx);
			}
		});
		searchVerses = tmpSearchVerses;
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
		searchVerses = verses.map((v, idx) => {
			return idx;
		});
	}

	let audioElement: HTMLAudioElement | null;

	onMount(() => {
		chapterService.getChapter('booknames').then((data: any) => {
			bookNames = data;
			renderBookChapterVerses();

			if (buffer && buffer.bag && buffer.bag.selectedVerses) {
				selectedVerses = buffer.bag.selectedVerses;
				selectedVerses.forEach((verseIdx) => {
					verses[verseIdx].checked = true;
				});
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

	function getAudioApiPath(verseIdx: number) {
		return '/api/media/verses/' + verses[verseIdx]['filename'];
	}

	let currentAudioVerseIdx: number = 0;
	function playSelectedVerses() {
		currentAudioVerseIdx = currentAudioVerseIdx + 1;
		if (selectedVerses.length - 1 < currentAudioVerseIdx) {
			currentAudioVerseIdx = 0;
		}

		let verseIdx = selectedVerses[currentAudioVerseIdx];
		verse = getAudioApiPath(verseIdx);
		audioElement?.play();
	}

	function verseSelected(verseIdx: number) {
		verses[verseIdx]['checked'] = !verses[verseIdx]['checked'];

		let found = false;
		let index = -1;
		selectedVerses.forEach((sv: any, idx: number) => {
			if (sv == verseIdx) {
				found = true;
				index = idx;
			}
		});

		if (!found) {
			selectedVerses.push(verseIdx);
			playSelectedVerses();
		}

		if (index != -1) {
			selectedVerses.splice(index, 1);
		}

		selectedVerses = selectedVerses;
		searchVerses = searchVerses;

		buffer.bag.selectedVerses = selectedVerses;
		paneService.saveRootPane();
	}

	function playlistVerseSelected(verseIdx: number, idx: number) {
		verses[verseIdx]['checked'] = false;

		selectedVerses.splice(idx, 1);
		selectedVerses = selectedVerses;
		searchVerses = searchVerses;

		buffer.bag.selectedVerses = selectedVerses;
		paneService.saveRootPane();
	}
</script>

<Card bind:buffer bind:popup>
	<div slot="header" class="h-100 w-100">
		<div class="kjv-memory-header h-100 w-100">
			<audio controls autoplay src={verse}></audio>
		</div>
	</div>
	<div slot="body" class="h-100 w-100" let:bodyHeight>
		<div id="{memoryId}-search" bind:clientHeight={searchHeight}>
			<div class="p-2">
				<input bind:value={search} />
				<button on:click={onChange}>Search</button>
			</div>
		</div>
		<div class="kjv-memory-verse-list p-3" style="max-height: {bodyHeight - searchHeight}px">
			<div class="row">
				<div class="col-6">
					{#each searchVerses as verseIdx}
						<div class="d-flex flex-row">
							<input
								on:change={() => verseSelected(verseIdx)}
								type="checkbox"
								bind:value={verses[verseIdx]['checked']}
								bind:checked={verses[verseIdx]['checked']}
							/> <span class="ps-2">{verses[verseIdx]['bcv']}</span>
						</div>
					{/each}
				</div>
				<div class="col-6">
					{#each selectedVerses as verseIdx, idx}
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
	</div>

	<div class="w-100" slot="footer">
		<div class="kjv-memory-footer d-flex align-items-center p-4">
			<MobileMenu></MobileMenu>
		</div>
	</div>
</Card>

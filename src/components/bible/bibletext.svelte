<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';

	import { pageDown, pageUp, previousLine, nextLine, scrolledIntoView } from '../../utils/position';

	import { BibleService } from '../../api/handler.svelte';

	import { v4 as uuidv4 } from 'uuid';
	import type { Buffer } from '../../models/buffer.model';
	import { bufferStore } from '../../stores/buffer.store';
	import { bibleDB } from '../../db/bible.db';
	import { bibleNavigationService } from '../../services/bible-navigation.service';
	import Goto from './components/goto.svelte';
	import { paneService } from '../../services/pane.service';
	import Search from './components/search.svelte';
	import Strongs from './components/strongs.svelte';

	export let buffer: Buffer;
	let popup: any;
	let quadrant: string = uuidv4();

	let headerHeight: number;
	let footerHeight: number;

	let quadrantHeight: number;

	let qh: number;
	let qb: number;
	$: uniqueId = quadrant + '-v';
	$: textHeight = quadrantHeight - headerHeight - footerHeight + 'px';
	$: quadHeightMax = qh + 'px';
	$: selectedVerse = 0;
	$: selected = buffer.selected ? 'selected-buffer' : '';
	$: popupHeight = qh / 2;
	$: popupHeightStyle = qh / 2 + 'px';
	$: popuptop = qb - qh / 2 + 'px';

	$: redtxtColor = 'rgb(255,0,0)';

	let loaded = false;
	let chapter: any;
	let verses: any[] = [];

	let db = bibleDB;

	let key: string;

	afterUpdate(() => {
		if (key !== buffer.key) {
			key = buffer.key;
			enableKeyBindings();
		}
	});

	onMount(() => {
		db.ready.then((val) => {
			if (!val) {
				return;
			}
			if (buffer?.bag?.currentChapterKey) {
				updateChapterFromChapterKey(buffer?.bag?.currentChapterKey);
			}
		});

		bufferStore.subscribe((buffs) => {
			if (loaded) {
				return;
			}
			let b = buffs.get(buffer.key);
			if (b) {
				buffer.bag = b.bag;
				db.ready?.then((val) => {
					if (!val) {
						return;
					}
					if (buffer?.bag?.currentChapterKey) {
						updateChapterFromChapterKey(buffer?.bag?.currentChapterKey);
					}
				});
			}
			loaded = true;
		});

		let el = document.getElementById(uniqueId);
		let pel = el?.parentNode as HTMLElement;
		let br = pel.getBoundingClientRect();
		qh = br.height;
		qb = br.bottom;
	});

	function enableKeyBindings() {
		buffer.keyboardBindings.set('i', _previousLine);
		buffer.keyboardBindings.set('k', _nextLine);

		buffer.keyboardBindings.set('p', _pageUp);
		buffer.keyboardBindings.set('n', _pageDown);

		buffer.keyboardBindings.set('l', _nextChapter);
		buffer.keyboardBindings.set('j', _previousChapter);

		buffer.keyboardBindings.set('g', _goto);
		buffer.keyboardBindings.set('s', _search);
	}

	function disableKeybinding() {
		for (let [key, _] of buffer.keyboardBindings) {
			buffer.keyboardBindings.delete(key);
		}
	}

	function updateChapter(c: any) {
		chapter = c;
		let k, v: any;
		verses = [];
		for ([k, v] of Object.entries(c.verses)) {
			verses.push(v);
			selectedVerse = 0;
		}

		bufferStore.add(buffer.key, buffer);
		scrolledIntoView(uniqueId, '0', uniqueId + '-bibletext');
	}

	async function updateChapterFromChapterKey(chapterKey: string) {
		let chapter = await db.getValue('chapters', chapterKey);
		buffer.bag.currentChapterKey = chapterKey;
		bufferStore.add(buffer.key, buffer);
		updateChapter(chapter);
	}

	async function updateChapterFromShortName(shortName: string) {
		let bookChapter = shortName.split(' ');
		if (bookChapter.length != 2) {
			return;
		}

		let chapterKey = bibleNavigationService.goto(bookChapter[0], bookChapter[1]);
		if (chapterKey === undefined) {
			return;
		}
		await updateChapterFromChapterKey(chapterKey);
	}

	async function searchHandler(event: any) {
		popup = null;

		let bookChapterStr: string = event.detail.chapter;
		await updateChapterFromShortName(bookChapterStr);
		enableKeyBindings();
	}

	function _search() {
		disableKeybinding();
		popup = {
			component: Search,
			handler: searchHandler
		};
	}

	async function gotoHandler(event: any) {
		popup = null;

		let bookChapterStr: string = event.detail.chapter;
		await updateChapterFromShortName(bookChapterStr);
		enableKeyBindings();
	}

	async function strongsHandler(event: any) {
		popup = null;
		enableKeyBindings();
	}

	function _goto() {
		disableKeybinding();
		popup = {
			component: Goto,
			handler: gotoHandler
		};
	}

	function _strongs(hrefs: string[]) {

		if (hrefs?.length < 1 || popup != null) {
			return;
		}

		// NOTE: hrefs starting with G or H are strongs defs
		var filterd = hrefs.filter( (item: String) => {return item.toLowerCase().startsWith('g') || item.toLowerCase().startsWith('h') })
		
		if (filterd.length != 1) {
			return
		}

		console.log(filterd)

		disableKeybinding();
		popup = {
			component: Strongs,
			handler: strongsHandler,
			data: filterd[0],
		};
	}

	async function _nextChapter() {
		let nc = bibleNavigationService.next(buffer.bag.currentChapterKey);
		let chapter = await db.getValue('chapters', nc);
		buffer.bag.currentChapterKey = nc;
		bufferStore.add(buffer.key, buffer);
		updateChapter(chapter);
	}

	async function _previousChapter() {
		let nc = bibleNavigationService.previous(buffer.bag.currentChapterKey);
		let chapter = await db.getValue('chapters', nc);
		buffer.bag.currentChapterKey = nc;
		bufferStore.add(buffer.key, buffer);
		updateChapter(chapter);
	}

	function _pageDown() {
		selectedVerse = pageDown(
			uniqueId,
			verses.length - 1,
			verses.length - 1,
			uniqueId + '-bibletext'
		);
	}

	function _pageUp() {
		selectedVerse = pageUp(uniqueId, 0, uniqueId + '-bibletext');
	}

	function _previousLine() {
		if (selectedVerse == 0) {
			_previousChapter();
			return;
		}
		selectedVerse = previousLine(
			uniqueId,
			selectedVerse,
			verses.length - 1,
			uniqueId + '-bibletext'
		);
	}

	function _nextLine() {
		if (selectedVerse + 1 == verses.length) {
			_nextChapter();
			return;
		}
		selectedVerse = nextLine(uniqueId, selectedVerse, verses.length, uniqueId + '-bibletext');
	}
</script>

<div
	id={uniqueId}
	class="quadrant"
	style:--height={quadHeightMax}
	bind:offsetHeight={quadrantHeight}
>
	<div class="header sticky-top" bind:offsetHeight={headerHeight}>
		<p class="text-sm m-0">
			{#if chapter}
				<strong class="font-semibold">{chapter.bookName} {chapter.number}</strong>
			{/if}
		</p>
	</div>

	<div
		id="{uniqueId}-bibletext"
		class="bibletext flex-1 space-y-2 text-left flex-col items-left"
		style:--height={textHeight}
	>
		{#if verses.length > 0}
			{#each verses as v, i}
				<div id="{uniqueId}{i}" class={i === selectedVerse ? 'selected' : ''}>
					{#each v.words as w}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<span
							on:click={() => _strongs(w.href)}
							style:--redtxtColor={redtxtColor}
							class={w.class?.join(' ')}>{w.text}</span
						>&nbsp;
					{/each}
				</div>
			{/each}
		{/if}
	</div>
	{#if popup}
		<div
			class="popups flex flex-fill w-100"
			style:--height={popupHeightStyle}
			style:--top={popuptop}
		>
			<svelte:component
				this={popup.component}
				on:popupHandler={popup.handler}
				bind:parentHeight={popupHeight}
				bind:keyboardBindings={buffer.keyboardBindings}
				bind:data={popup.data}
			/>
		</div>
	{/if}
	<div class="footer sticky-bottom {selected}" bind:offsetHeight={footerHeight}>
		<p class="text-sm m-0">
			<strong class="font-semibold">Bible Buffer</strong>
		</p>
	</div>
</div>

<style>
	.popups {
		height: var(--height);
		top: var(--top);

		position: absolute;
		z-index: 10000;
	}
	.quadrant {
		overflow: hidden;
		height: var(--height);
		margin: 0px !important;
		padding: 0px !important;
	}

	/* TODO: Decide if supporting footnotes. */
	.FOOTNO {
		display: none;
		width: 0px !important;
	}

	.redtxt {
		color: var(--redtxtColor);
	}

	.xref {
		border-bottom: thin dotted darkgray;
		cursor: pointer;
	}

	.selected {
		background-color: rgb(127, 127, 127, 0.25);
	}

	.bibletext {
		overflow-y: scroll;
		height: var(--height);
	}

	.header {
		-webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
		-moz-box-sizing: border-box; /* Firefox, other Gecko */
		box-sizing: border-box;
		border-bottom: 1px solid lightgray;
		height: 30px !important;
	}

	.footer {
		background-color: gray;
		height: 30px !important;
	}

	.selected-buffer {
		background-color: lightgray !important;
	}
</style>

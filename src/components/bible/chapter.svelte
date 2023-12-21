<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { pageDown, pageUp, previousLine, nextLine, scrolledIntoView } from '../../utils/position';

	import { v4 as uuidv4 } from 'uuid';
	import type { Buffer } from '../../models/buffer.model';
	import { bufferStore } from '../../stores/buffer.store';
	import { bibleDB } from '../../db/bible.db';
	import { bibleNavigationService } from '../../services/bible-navigation.service';
	import Goto from './components/goto.svelte';
	import Search from './components/search.svelte';
	import Strongs from './components/strongs.svelte';
	import { paneService } from '../../services/pane.service';

	export let buffer: Buffer;
	let popup: any;
	let id: string = uuidv4();
	let quadrant = id;
	let headerHeight: number;
	let footerHeight: number;

	let qh: number;
	let qb: number;
	$: uniqueId = quadrant + '-v';

	$: selectedVerse = 0;
	$: selected = buffer.selected ? 'selected-buffer' : '';

	$: popupHeight = qh / 2;
	$: popupHeightStyle = qh / 2 + 'px';
	$: popuptop = qb - qh / 2 + 'px';
	var popupWidth: string;

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

		// TODO clean up. Go back to using css and var technique

		let el = document.getElementById(uniqueId);
		let pel = el?.parentNode as HTMLElement;
		let br = pel.getBoundingClientRect();
		let quad = document.getElementById(uniqueId) as HTMLElement;
		let text = document.getElementById(uniqueId + '-chapter') as HTMLElement;

		quad.style.height = br.height + 'px';
		quad.style.maxHeight = br.height + 'px';
		text.style.height = br.height - headerHeight - footerHeight + 'px';
		text.style.maxHeight = br.height - 60 + 'px';

		qb = br.bottom;
		qh = br.height;

		popupWidth = pel.getBoundingClientRect().width + 'px';

		const resizeObserver = new ResizeObserver((entries) => {
			var br = pel.getBoundingClientRect();

			quad.style.height = br.height + 'px';
			quad.style.maxHeight = br.height + 'px';

			text.style.height = br.height - 60 + 'px';
			text.style.maxHeight = br.height - 60 + 'px';

			qb = br.bottom;
			qb = br.bottom;
			qh = br.height;
			popupWidth = br.width + 'px';
		});
		resizeObserver.observe(pel);
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
		scrolledIntoView(uniqueId, '0', uniqueId + '-chapter');
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
		paneService.updatePane();
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
		if (!hrefs || hrefs?.length < 1 || popup != null) {
			return;
		}

		// NOTE: hrefs starting with G or H are strongs defs
		var filterd = hrefs.filter((item: String) => {
			return item.toLowerCase().startsWith('g') || item.toLowerCase().startsWith('h');
		});

		if (filterd.length != 1) {
			return;
		}

		disableKeybinding();
		popup = {
			component: Strongs,
			handler: strongsHandler,
			data: filterd[0]
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
		selectedVerse = pageDown(uniqueId, verses.length - 1, verses.length - 1, uniqueId + '-chapter');
	}

	function _pageUp() {
		selectedVerse = pageUp(uniqueId, 0, uniqueId + '-chapter');
	}

	function _previousLine() {
		if (selectedVerse == 0) {
			_previousChapter();
			return;
		}
		selectedVerse = previousLine(uniqueId, selectedVerse, verses.length - 1, uniqueId + '-chapter');
	}

	function _nextLine() {
		if (selectedVerse + 1 == verses.length) {
			_nextChapter();
			return;
		}
		selectedVerse = nextLine(uniqueId, selectedVerse, verses.length, uniqueId + '-chapter');
	}
</script>

<div id={uniqueId} class="kjv-chapter-quadrant">
	<div class="kjv-chapter-header">
		<p class="text-sm m-0">
			{#if chapter}
				<strong class="font-semibold">{chapter.bookName} {chapter.number}</strong>
			{/if}
		</p>
	</div>

	<div id="{uniqueId}-chapter" class="kjv-chapter">
		{#if verses.length > 0}
			{#each verses as v, i}
				<div class="kjv-verse-outer">
					<div class="kjv-verse-inner {i === selectedVerse ? 'selected' : ''}">
						<div id="{uniqueId}{i}" class="d-flex flex-row">
							{#each new Array(3 - v.words[0].text.length) as i}
								<span class="invisible">0</span>
							{/each}

							<span class="kjvonly-noselect">{v.words[0].text}</span>

							<span class="kjvonly-noselect">&nbsp;</span>
							<span class="kjvonly-noselect">&nbsp;</span>

							<div class="kjv-words kjvonly-noselect">
								{#each v.words.slice(1, v.words.length - 1) as w}
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<span
										on:click={() => _strongs(w.href)}
										class="kjvonly-noselect {w.class?.join(' ')}">{w.text}&nbsp;</span
									>
								{/each}
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<span
									on:click={() => _strongs(v.words[v.words.length - 1].href)}
									class="kjvonly-noselect {v.words[v.words.length - 1].class?.join(' ')}"
									>{v.words[v.words.length - 1].text}</span
								>
							</div>
						</div>
					</div>
				</div>
			{/each}
			<span class="w-100"></span>
		{/if}
	</div>
	{#if popup}
		<div
			class="popups flex flex-fill w-100"
			style:--height={popupHeightStyle}
			style:--top={popuptop}
			style:--maxWidth={popupWidth}
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
	<div class="kjv-chapter-footer {selected}">
		<p class="text-sm m-0">
			<strong class="font-semibold">Bible Buffer</strong>
		</p>
	</div>
</div>

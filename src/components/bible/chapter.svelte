<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { pageDown, pageUp, previousLine, nextLine, scrolledIntoView } from '../../utils/position';

	import { v4 as uuidv4 } from 'uuid';
	import type { Buffer } from '../../models/buffer.model';
	import { bibleDB } from '../../db/bible.db';
	import { bibleNavigationService } from '../../services/bible-navigation.service';
	import Goto from './components/goto.svelte';
	import Search from './components/search.svelte';
	import Strongs from './components/strongs.svelte';
	import { paneService } from '../../services/pane.service';
	import Card from '../card/card.svelte';
	import Menu from './components/menu.svelte';
	import type { MenuItem } from './components/menu-item';

	export let buffer: Buffer;
	let popup: any;

	$: chapterId = '_kjv-chapter-' + uuidv4();

	$: selectedVerse = 0;

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

	/* search popup */

	function _search() {
		disableKeybinding();
		popup = {
			component: Search,
			handler: searchHandler
		};
	}

	async function searchHandler(event: any) {
		popup = null;

		let bookChapterStr: string = event.detail.chapter;
		await updateChapterFromShortName(bookChapterStr);
		enableKeyBindings();
	}

	/* goto popup */

	function _goto() {
		disableKeybinding();
		popup = {
			component: Goto,
			handler: gotoHandler
		};
	}

	async function gotoHandler(event: any) {
		popup = null;

		let bookChapterStr: string = event.detail.chapter;
		await updateChapterFromShortName(bookChapterStr);
		enableKeyBindings();
		paneService.saveRootPane();
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

	/* strongs popup */

	function _strongs(e: Event, hrefs: string[]) {
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

		e.stopPropagation();
	}

	async function strongsHandler(event: any) {
		popup = null;
		enableKeyBindings();
	}

	async function _nextChapter() {
		let nc = bibleNavigationService.next(buffer.bag.currentChapterKey);
		updateChapterFromChapterKey(nc);
	}

	async function _previousChapter() {
		let pc = bibleNavigationService.previous(buffer.bag.currentChapterKey);
		updateChapterFromChapterKey(pc);
	}

	async function updateChapterFromChapterKey(chapterKey: string) {
		let chapter = await db.getValue('chapters', chapterKey);
		buffer.bag.currentChapterKey = chapterKey;
		updateChapter(chapter);
		paneService.saveRootPane();
	}

	function updateChapter(c: any) {
		chapter = c;
		let k, v: any;
		verses = [];
		for ([k, v] of Object.entries(c.verses)) {
			verses.push(v);
			selectedVerse = 0;
		}

		scrolledIntoView(chapterId, '0', chapterId + '-chapter');
	}

	function _pageDown() {
		selectedVerse = pageDown(
			chapterId,
			verses.length - 1,
			verses.length - 1,
			chapterId + '-chapter'
		);
	}

	function _pageUp() {
		selectedVerse = pageUp(chapterId, 0, chapterId + '-chapter');
	}

	function _previousLine() {
		if (selectedVerse == 0) {
			_previousChapter();
			return;
		}
		selectedVerse = previousLine(
			chapterId,
			selectedVerse,
			verses.length - 1,
			chapterId + '-chapter'
		);
	}

	function _nextLine() {
		if (selectedVerse + 1 == verses.length) {
			_nextChapter();
			return;
		}
		selectedVerse = nextLine(chapterId, selectedVerse, verses.length, chapterId + '-chapter');
	}

	// Refactor this next piece of code. do a retry circuit breaker.
	var u = () => {
		if (loaded) {
			return;
		}

		db.ready?.then((val) => {
			if (!val) {
				return;
			}
			if (buffer?.bag?.currentChapterKey) {
				updateChapterFromChapterKey(buffer?.bag?.currentChapterKey);
			}
		});

		loaded = true;
	};
	$: buffer && u();

	function innerHandleClick(e: Event, who: String) {
		alert(who + ' clicked me');
		e.stopPropagation();
	}

	function outerHandleClick(e: Event, verse: number) {
		if (selectedVerses.has(verse)) {
			selectedVerses.delete(verse);
		} else {
			selectedVerses.add(verse);
		}
		selectedVerses = selectedVerses;
		e.stopPropagation();
	}
	$: selectedVerses = new Set<number>();

		function onCopySelectedVerses(){

		}
	let menuData: MenuItem = {
		title: 'root',
		handler: () => {},
		children: [
			{
				title: 'Selected',
				handler: () => {},
				children: [
					{ children: [], title: 'Copy', handler: () => onCopySelectedVerses() },
				]
			},
		]
	};
</script>

<Card bind:buffer bind:popup>
	<div slot="header">
		<p class="text-sm m-0">
			{#if chapter}
				<strong class="font-semibold">{chapter.bookName} {chapter.number}</strong>
				{#each selectedVerses.values() as a}
					<span>{a} &nbsp;</span>
				{/each}
			{/if}
		</p>
	</div>
	<div slot="body" let:bodyHeight>
		<div id="{chapterId}-chapter" class="kjv-chapter" style="max-height: {bodyHeight}px;">
			{#if verses.length > 0}
				{#each verses as v, i}
					<div
						role="none"
						on:click={(e) => outerHandleClick(e, i)}
						class="kjv-verse-outer {selectedVerses.has(i) ? 'kjv-chapter-verses-selected' : ''}"
					>
						<div
							role="none"
							on:click={(e) => innerHandleClick(e, 'inner')}
							class="kjv-verse-inner {i === selectedVerse ? 'selected' : ''}"
						>
							<div id="{chapterId}{i}" class="d-flex flex-row">
								{#each new Array(3 - v.words[0].text.length) as i}
									<span class="invisible">0</span>
								{/each}

								<span class="kjvonly-noselect">{v.words[0].text}</span>

								<span class="kjvonly-noselect">&nbsp;</span>
								<span class="kjvonly-noselect">&nbsp;</span>

								<div class="kjv-words kjvonly-noselect">
									{#each v.words.slice(1, v.words.length) as w}
										<span role="none" on:click={(e) => _strongs(e, w.href)} class="kjvonly-noselect"
											><u class={w.class?.join(' ')}>{w.text}</u><u class="whitespace">&nbsp;</u
											></span
										>
									{/each}
								</div>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
	<div slot="footer">
		<p class="text-sm m-0">
			<strong class="font-semibold">Bible Buffer</strong>
		</p>
	</div>
</Card>
<Menu bind:parentId={chapterId} bind:menuData={menuData}></Menu>

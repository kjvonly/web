<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { pageDown, pageUp, previousLine, nextLine, scrolledIntoView } from '../../utils/position';

	import { v4 as uuidv4 } from 'uuid';
	import type { Buffer } from '../../models/buffer.model';
	import { chapterService } from '../../api/chapters.service';
	import { bibleNavigationService } from '../../services/bible-navigation.service';
	import Goto from './components/goto.svelte';
	import Search from './components/search.svelte';
	import Strongs from './components/strongs.svelte';
	import { paneService } from '../../services/pane.service';
	import Card from '../card/card.svelte';
	import Menu from './components/menu.svelte';
	import type { MenuItem } from './components/menu-item';
	import { SwipeService } from '../../services/swipe.service';
	import Icon from 'svelte-awesome';
	import { volumeUp, font, search } from 'svelte-awesome/icons';
	import MobileMenu from '../../menus/mobile-menu.svelte';
	import { bufferService } from '../../services/buffer.service';

	export let buffer: Buffer;
	let popup: any;
	let popupRatio: number;

	let swipeService = new SwipeService(_previousChapter, _nextChapter);

	$: chapterId = '_kjv-chapter-' + uuidv4();

	$: selectedVerse = 0;

	let chapter: any;
	let verses: any[] = [];

	let key: string;

	// Initial state
	let scrollPos = 0;
	let scrollBottom = 0;
	$: isReading = false;

	afterUpdate(() => {
		if (key !== buffer.key) {
			key = buffer.key;
			enableKeyBindings();
		}
	});

	function throttle(eventListener: any, delay: number) {
		let lastCall = 0;
		return function (event: any) {
			const now = Date.now();
			if (now - lastCall >= delay) {
				eventListener(event);
				lastCall = now;
			}
		};
	}

	function handleScroll() {
		let kjvChapter = document.querySelector('div#' + chapterId + '-chapter');

		
		if (kjvChapter == null) {
			return;
		}
		
		// detects new state and compares it with the new one
		if (kjvChapter.scrollTop < scrollPos) {
			if (kjvChapter.scrollTop == 0) {
				isReading = false;
			}
		} else {
			if (kjvChapter.scrollTop > 0 && (kjvChapter.scrollHeight / kjvChapter.clientHeight) > 3) {
				isReading = true;
			}
		}

		// saves the new position for iteration.
		scrollPos = kjvChapter.scrollTop;
	}
	onMount(() => {
		console.log('chapter svelte');
		if (buffer.bag.currentChapterKey) {
			updateChapterFromChapterKeyOnMount(buffer.bag.currentChapterKey);
		} else {
			buffer.bag.currentChapterKey = '1_1';
			updateChapterFromChapterKeyOnMount(buffer.bag.currentChapterKey);
		}

		if (buffer.bag.selectedVerses) {
			selectedVerses = new Set(buffer.bag.selectedVerses);
			selectedVerses = selectedVerses;
		}

		let kjvChapter = document.querySelector('div#' + chapterId + '-chapter');

		kjvChapter?.addEventListener('touchstart', swipeService.handleTouchStart, false);

		kjvChapter?.addEventListener('touchmove', swipeService.handleTouchMove, false);

		// adding scroll event
		kjvChapter?.addEventListener('scroll',handleScroll);
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

	function cache() {
		bufferService.set(buffer);
		paneService.saveRootPane();
	}

	/* search popup */

	function _search() {
		disableKeybinding();
		popupRatio = 1
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
		popupRatio = 1
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
		cache();
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
		e.stopPropagation();

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
		popupRatio = 5/10;
		popup = {
			component: Strongs,
			handler: strongsHandler,
			data: filterd[0]
		};
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

	async function updateChapterFromChapterKeyOnMount(chapterKey: string) {
		let chapter = await chapterService.getChapter(chapterKey);
		buffer.bag.currentChapterKey = chapterKey;
		updateChapter(chapter);
	}

	async function updateChapterFromChapterKey(chapterKey: string) {
		let chapter = await chapterService.getChapter(chapterKey);
		buffer.bag.currentChapterKey = chapterKey;
		updateChapter(chapter);
		clearSelectedVerses();
		cache();
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

	/** selected verses */

	$: selectedVerses = new Set<number>(buffer.bag.selectedVerses);

	function verseOuterHandleClick(e: Event, verse: number) {
		if (selectedVerses.has(verse)) {
			selectedVerses.delete(verse);
		} else {
			selectedVerses.add(verse);
		}
		selectedVerses = selectedVerses;
		buffer.bag.selectedVerses = [...selectedVerses];
		cache();
		e.stopPropagation();
	}

	function onCopySelectedVerses() {
		let copyText = `${chapter.bookName} ${chapter.number}\n\n`;
		for (let s of Array.from(selectedVerses).sort()) {
			copyText += `${verses[s].text} \n`;
		}
		var data = [
			new ClipboardItem({
				'text/plain': Promise.resolve(new Blob([copyText], { type: 'text/plain' }))
			})
		];

		navigator.clipboard.write(data).then(
			// TODO - add toasts here
			function () {
				// console.log('Copied to clipboard successfully!');
			},
			function () {
				//	console.error('Unable to write to clipboard. :-(');
			}
		);
	}

	function clearSelectedVerses() {
		selectedVerses.clear();
		selectedVerses = selectedVerses;
		buffer.bag.selectedVerses = [];
		cache();
	}

	function onClearSelectedVerses() {
		clearSelectedVerses();
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
					{ children: [], title: 'Clear', handler: () => onClearSelectedVerses() }
				]
			}
		]
	};
</script>

<Card bind:buffer bind:popup bind:popupRatio>
	<div slot="header" class="h-100 w-100">
		{#if !isReading}
			<div class="kjv-chapter-header h-100 w-100">
				<div class="d-flex flex-row h-100">
					<div class="kjv-chapter-header-book-chapter d-flex align-items-center m-0 ps-2">
						{#if chapter}
							<div on:click={() => _goto()}>
								<span class="font-semibold"
									>{chapter.bookName} {chapter.number}
								</span>
							</div>
						{/if}
					</div>
					<span class="flex-fill"></span>

					<div class="d-flex flex-row justify-content-between">
						<div class="me-4 d-flex align-items-center">
							<Icon data={volumeUp}></Icon>
						</div>
						<div class="me-4 d-flex align-items-center"><Icon data={font}></Icon></div>
						<div class="me-2 d-flex align-items-center"><Icon data={search}></Icon></div>
					</div>
				</div>
			</div>
		{:else}
			<div class="kjv-chapter-header-shrunk h-100 w-100">
				<div class="d-flex flex-row h-100">
					<div class="kjv-chapter-header-book-chapter d-flex align-items-center m-0 ps-2">
						{#if chapter}
							<div on:click={() => _goto()}>
								<span class="font-semibold"
									>{chapter.bookName} {chapter.number}</span
								>
							</div>
						{/if}
					</div>
					<span class="flex-fill"></span>
				</div>
			</div>
		{/if}
	</div>

	<div slot="body" let:bodyHeight>
		<div id="{chapterId}-chapter" class="kjv-chapter" style="max-height: {bodyHeight}px;">
			{#if verses.length > 0}
				{#each verses as v, i}
					<div
						role="none"
						on:click={(e) => verseOuterHandleClick(e, i)}
						class="kjv-verse-outer {selectedVerses.has(i) ? 'kjv-chapter-verses-selected' : ''}"
					>
						<div role="none" class="kjv-verse-inner {i === selectedVerse ? 'selected' : ''}">
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
	<div class="w-100" slot="footer">
		{#if !isReading}
			<div class="kjv-chapter-footer d-flex align-items-center p-4">
				<MobileMenu></MobileMenu>
			</div>
		{/if}
	</div>
</Card>
<Menu bind:parentId={chapterId} bind:menuData></Menu>

<script lang="ts">
	import { onMount } from 'svelte';
	import Chapter from '../components/bible/chapter.svelte';
	import RecursivePanes from '../theme/layout/recursive-pane/recursive-pane.svelte';
	import { keydownStore } from '../services/keydown.service';
	import { BufferService } from '../models/buffer.model';
	import { PaneSplit, type Pane } from '../models/pane.model';
	import { Buffer } from '../models/buffer.model';
	import { paneStore } from '../stores/pane.store';
	import { currentBuffer } from '../services/current-buffer.service';
	import { paneService } from '../services/pane.service';
	import Editor from '../components/editor/editor.svelte';
	import { bibleDB } from '../db/bible.db';
	import Search from '../components/search/search.svelte';
	import TestCard from '../components/card/test-card.svelte';
	import Memory from '../components/memory/memory.svelte';
	import { bufferService } from '../services/buffer.service';

	let p: Pane;

	let paneKeyBindingMap = new Map<string, Function>();

	paneKeyBindingMap.set('shift+X 3', () => {
		paneService.splitPane(PaneSplit.Vertical);
		p = paneService.getRootPane();
	});

	paneKeyBindingMap.set('shift+X 2', () => {
		paneService.splitPane(PaneSplit.Horizontal);
		p = paneService.getRootPane();
	});

	paneKeyBindingMap.set('shift+X 0', () => {
		paneService.deletePane();
		p = paneService.getRootPane();
	});

	paneKeyBindingMap.set('shift+X o', () => {
		paneService.goToNextPaneWithBuffer();
		p = paneService.getRootPane();
	});

	function setBibleBuffer() {
		let b = new Buffer();
		b.componentName = 'Chapter';
		b.component = Chapter;
		b.bag = {
			currentChapterKey: '1_1'
		};
		paneService.setBuffer(b);
		currentBuffer.set(b);
		paneService.saveRootPane();
		p = paneService.getRootPane();
	}

	// opens bible buffer
	paneKeyBindingMap.set('shift+X b', setBibleBuffer);

	// opens memory buffer
	paneKeyBindingMap.set('shift+X m', () => {
		let b = new Buffer();
		b.componentName = 'Memory';
		b.component = Memory;
		paneService.setBuffer(b);
		currentBuffer.set(b);
		paneService.saveRootPane();
		p = paneService.getRootPane();
	});

	// opens test buffer
	paneKeyBindingMap.set('shift+X t', () => {
		let b = new Buffer();
		b.componentName = 'TestCard';
		b.component = TestCard;
		paneService.setBuffer(b);
		currentBuffer.set(b);
		paneService.saveRootPane();
		p = paneService.getRootPane();
	});

	// opens search buffer
	paneKeyBindingMap.set('shift+X s', () => {
		let b = new Buffer();
		b.componentName = 'Search';
		b.component = Search;
		paneService.setBuffer(b);
		currentBuffer.set(b);
		p = paneService.getRootPane();
	});

	paneKeyBindingMap.set('ctl+x e', () => {
		let b = new Buffer();
		b.component = Editor;
		paneService.setBuffer(b);
		p = paneService.getRootPane();
	});

	keydownStore.updatePaneKeybindings(paneKeyBindingMap);

	function saveRootPane() {
		paneService.saveRootPane();
	}

	// Create a condition that targets viewports at least 768px wide
	const mediaQuery = window.matchMedia('(max-width: 991.98px)');

	function handleTabletChange(e: any) {
		// Check if the media query is true
		if (e.matches) {
			if (p.buffer.componentName === 'NullBuffer') {
				let b = new Buffer();
				b.name = "chapter"
				b.componentName = 'Chapter';
				b.component = Chapter;
				b.bag = {
					currentChapterKey: '1_1'
				};
				paneService.setBuffer(b);
				currentBuffer.set(b);
				paneService.saveRootPane();
				bufferService.set(b)
				p = paneService.getRootPane();
			}
			// Then log the following message to the console
			console.log('Media Query Matched!');
		}
	}

	// Register event listener
	mediaQuery.addListener(handleTabletChange);

	onMount(() => {
		/* This pulls the chapter and strongs data from api and stores in indexdb for offline use. */
		bibleDB.init();
		paneStore.useLocalStorage();
		paneStore.subscribe((pane) => {
			p = pane;
			handleTabletChange(mediaQuery);
		});
	});
</script>

<div class="container-fluid p-0">
	<div class="h-100">
		<div id="_root-pane" class="h-100">
			{#if p}
				<RecursivePanes bind:pane={p} on:save={saveRootPane} />
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	@import '../scss/styles.scss';

	div {
		margin: 0px;
		padding: 0px;
	}
	#_root-pane {
		display: flex;
	}

	.container-fluid {
		height: 100vh;
	}

	@include media-breakpoint-up(lg) {
		.container-fluid {
			height: calc(100vh - 4.75rem);
		}
	}

	.container-fluid {
		overflow: hidden;

		@include themify($themes) {
			background-color: themed('primary');
		}
	}
</style>

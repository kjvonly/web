<script lang="ts">
	import { onMount } from 'svelte';
	import Bibletext from '../components/bible/bibletext.svelte';
	import RecursivePanes from '../theme/layout/recursive-vertical-horizontal-split.svelte';
	import { keydownStore } from '../services/keydown.service';
	import { bufferStore } from '../stores/buffer.store';
	import { BufferService } from '../models/buffer.model';
	import { PaneSplit, type Pane } from '../models/pane.model';
	import { Buffer } from '../models/buffer.model';
	import { paneStore } from '../stores/pane.store';
	import { currentBuffer } from '../services/current-buffer.service';
	import { paneService } from '../services/pane.service';
	import Editor from '../components/editor/editor.svelte';
	import { bibleDB } from '../db/bible.db';
	import Search from '../components/search/search.svelte';

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

	// opens bible buffer
	paneKeyBindingMap.set('shift+X b', () => {
		let b = new Buffer();
		b.componentName = 'Bibletext';
		b.component = Bibletext;
		bufferStore.add(b.key, b);
		paneService.setBuffer(b);
		currentBuffer.set(b);
		p = paneService.getRootPane();
	});

	// opens search buffer
	paneKeyBindingMap.set('shift+X s', () => {
		let b = new Buffer();
		b.componentName = 'Search';
		b.component = Search;
		bufferStore.add(b.key, b);
		paneService.setBuffer(b);
		currentBuffer.set(b);
		p = paneService.getRootPane();
	});
	

	paneKeyBindingMap.set('ctl+x e', () => {
		let b = new Buffer();
		b.component = Editor;
		bufferStore.add(b.key, b);
		paneService.setBuffer(b);
		p = paneService.getRootPane();
	});

	keydownStore.updatePaneKeybindings(paneKeyBindingMap);

	onMount(() => {
		bibleDB.init();
		bufferStore.useLocalstorage();
		paneStore.useLocalstorage();
		paneStore.subscribe((pane) => {
			p = pane;
		});
	});
</script>

<div class="container-fluid">
	<div class="row h-100">
		<div class="col">
			{#if p}
				<RecursivePanes bind:pane={p} />
			{/if}
		</div>
	</div>
</div>

<style>
	.container-fluid {
		height: 100vh;
		overflow: hidden;
	}
</style>

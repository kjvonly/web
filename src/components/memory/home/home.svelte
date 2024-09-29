<script lang="ts">
	import { onMount } from 'svelte';
	import type { Buffer } from '../../../models/buffer.model';
	import Card from '../../card/card.svelte';
	import { chapterService } from '../../../api/chapters.service';
	import MobileMenu from '../../../menus/mobile-menu.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { paneService } from '../../../services/pane.service';
	import { bufferService } from '../../../services/buffer.service';
	import Myscore from './components/myscore.svelte';
	import Level from './components/level.svelte';
	import Header from './components/header.svelte';
	import LearnVerses from './components/learn-verses.svelte';
	import { Collection, memoryService } from '../../../api/memory.service';

	export let buffer: Buffer;
	let learnVersesSelected: any;
	let hearVersesSelected: any;

	let popup: any;
	let popupRatio = 1;
	$: memoryId = '_kjv-memory-' + uuidv4();
	let collection: Array<Collection> = new Array();

	onMount(() => {
		memoryService.getCollections().then((data) => {
			collection = data;
			console.log(collection);
		});
	});
</script>

<Card bind:buffer bind:popup bind:popupRatio>
	<div slot="header" class="h-100 w-100">
		<Header></Header>
	</div>
	<div slot="body" class="h-100 w-100" let:bodyHeight>
		<div class="d-flex flex-column h-100">
			<Level></Level>
			<Myscore bind:learnVersesSelected bind:hearVersesSelected></Myscore>
			<span class="d-flex flex-fill"></span>
			{#if learnVersesSelected}
				<LearnVerses></LearnVerses>
			{/if}
			{#if hearVersesSelected}
				<span>hear</span>
			{/if}
		</div>
	</div>

	<div class="w-100" slot="footer">
		<div class="kjv-memory-footer d-flex align-items-center p-4">
			<MobileMenu></MobileMenu>
		</div>
	</div>
</Card>

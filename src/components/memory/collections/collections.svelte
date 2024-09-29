<script lang="ts">
	import { onMount } from 'svelte';
	import { Collection, memoryService } from '../../../api/memory.service';
	import type { Buffer } from '../../../models/buffer.model';
	import Card from '../../card/card.svelte';

	export let buffer: Buffer;
	let popup: any;
	let popupRatio = 1;

	let collections: Array<Collection> = [];
	onMount(() => {
		memoryService.getCollections().then((data) => {
			collections = data;
			console.log(collections);
		});
	});
</script>

<Card bind:buffer bind:popup bind:popupRatio>
	<div slot="header" class="w-100 h-100"></div>
	<div slot="body" class="w-100 h-100">
		{#each collections as d}
			{d.name}
		{/each}
	</div>
	<div slot="footer" class="w-100 h-100">

	</div>
</Card>

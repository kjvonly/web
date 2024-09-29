<script lang="ts">
	import { onMount } from 'svelte';
	import { Collection, memoryService } from '../../../api/memory.service';
	import type { Buffer } from '../../../models/buffer.model';
	import Card from '../../card/card.svelte';
	import { Icon } from 'svelte-awesome';
	import { angleLeft } from 'svelte-awesome/icons';

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
	<div slot="header" class="kjv-memory-collections-header w-100">
		<div class="d-flex flex-row align-items-center ps-2 w-100 h-100">
			<Icon data={angleLeft} scale={2}></Icon>
			<div class="d-flex d-flex justify-content-center align-items-center w-100 h-100">
				<span class="text-capitalize title">collections</span>
			</div>
		</div>
	</div>
	<div slot="body" class="w-100 h-100">
		{#each collections as d}
			<div class="kjv-collection-container">
				<span class="kjv-collection-name">
					{d.name}
				</span>
				
			</div>
		{/each}
	</div>
	<div slot="footer" class="w-100 h-100"></div>
</Card>

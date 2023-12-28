<script lang="ts">
	import { onMount } from 'svelte';
	import { Buffer } from '../../models/buffer.model';
	import Card from './card.svelte';

	export let buffer = new Buffer();
	let popup: any;

	let items = Array(1000).keys();
	onMount(() => {
		buffer.bag.item = 'some item';
		/* add in popup to test*/
		//popup = {component: Strongs}
	});
</script>

<Card bind:buffer bind:popup>
	<div slot="header">TestCard Header</div>
	<div slot="body">
		TestCard body
		{#if items}
			{#each items as i}
				<p>{i}</p>
			{/each}
		{/if}
	</div>
	<div slot="footer">
		<span>TestCard Footer</span>
	</div>
</Card>

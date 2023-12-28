<script>
	import { onMount } from 'svelte';
	import { Buffer } from '../../models/buffer.model';
	import Card from './card.svelte';
	export let buffer = new Buffer();
	let items = Array(1000).keys();
	onMount(() => {
		//this.buff
		buffer.bag.item = 'some item';
	});
</script>

<Card bind:buffer={buffer}>
	<div slot="header">
        TestCard Header
	</div>
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

<script>
	import { onMount } from 'svelte';
	import { Buffer } from '../../models/buffer.model';
	import Card from './card.svelte';


	let buffer = new Buffer();
	let items = Array(1000).keys();
	onMount(() => {
		//this.buff
		buffer.bag.item = 'some item';
	});
</script>

<Card bind:buffer>
	<div slot="header" let:id={myid}>
		<span>{myid}</span>
	</div>
	<div slot="body" let:buffer>
		Hello buffer
		{#if items}
			{#each items as i}
				<p>{i}</p>
			{/each}
		{/if}
	</div>
	<div slot="footer" let:id={myid}>
		<span>{myid}</span>
	</div>
</Card>

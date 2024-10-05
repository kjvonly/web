<script lang="ts">
	import { onMount } from 'svelte';
	import Home from './home/home.svelte';
	import { Buffer } from '../../models/buffer.model';
	import Collections from './collections/collections.svelte';

	export let buffer: Buffer;

	let popup: any;
	let popupRatio = 1;
	let component = Home;


	function handler(event: any){
		console.log("here")
		switch(event.detail.componentName) {
			case 'home':
				component = Home;
				break;
			case 'collections':
				component = Collections;
				break;
		}
	}
	onMount(() => {
	});
</script>

<svelte:component this={component} bind:buffer={buffer} on:handler={(event) => handler(event)} />

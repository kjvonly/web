<script lang="ts">
	import { onMount } from "svelte";

	export let active = false;
	export let component: any;
</script>

<aside class={active ? 'active' : ''}>
	{#if component}
		<svelte:component this={component}></svelte:component>
	{/if}
</aside>

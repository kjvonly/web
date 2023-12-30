<script lang="ts">
	import { onMount } from 'svelte';
	import type { MenuItem } from './menu-item';

	export let item: MenuItem;
	onMount(() => {
		console.log(item);
		console.log(item.title);
		console.log(item?.children?.length);
	});
</script>

{#if item.title === 'root'}
	{#each item.children as c}
		<svelte:self bind:item={c} />
	{/each}
{:else if item.children && item.children.length > 0}
	<menu title={item.title}>
		{#each item.children as nested}
			<svelte:self bind:item={nested} />
		{/each}
	</menu>
{:else}
	<menu role="none" on:click={item.handler} title={item.title}></menu>
{/if}

<style>
	menu {
		position: absolute;
		display: block;
		left: 0px;
		top: 0px;
		height: 20px;
		width: 20px;
		padding: 0;
		margin: 0;
		border: 1px solid;
		background-color: white;
		font-weight: normal;
		white-space: nowrap;
	}
	menu:hover {
		background-color: #eef;
		font-weight: bold;
	}
	menu:hover > menu {
		display: block;
	}
	menu > menu {
		display: none;
		position: relative;
		top: -20px;
		left: 100%;
		width: 55px;
	}
	menu[title]:before {
		content: attr(title);
	}
	menu:not([title]):before {
		content: '\2630';
	}
</style>

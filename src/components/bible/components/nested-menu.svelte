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
	<menu class="kjv-menu-item-parent" title={item.title}>
		{#each item.children as nested}
			<svelte:self bind:item={nested} />
		{/each}
	</menu>
{:else}
	<menu class="kjv-menu-item" role="none" on:click={item.handler} title={item.title}></menu>
{/if}

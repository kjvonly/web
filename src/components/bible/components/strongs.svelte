<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';

	import { bibleDB } from '../../../db/bible.db';

	import { Icon } from 'svelte-awesome';
	import { close } from 'svelte-awesome/icons';

	export let parentHeight: number;
	export let keyboardBindings: Map<string, Function>;
	export let data: string;
	export let parentId: string;

	let strongsID = data;
	let strongsPopupID: string = uuidv4();
	let strongs: any;

	let containerHeight: number;

	const dispatch = createEventDispatcher();
	$: popupHeight = parentHeight + 'px';

	function onClose() {
		keyboardBindings.delete('Enter');
		dispatch('popupHandler', {});
	}

	onMount(() => {
		let el = document.getElementById('strongs-popup-' + strongsPopupID);
		let pel = el?.parentNode as HTMLElement;
		containerHeight = pel.getBoundingClientRect().height;

		keyboardBindings.set('Enter', () => {
			onClose()
		});

		bibleDB.ready?.then(() => {
			bibleDB.getValue('chapters', strongsID.toLowerCase()).then((data) => {
				strongs = data;
				console.log(strongsPopupID.toLowerCase());
			});
		});
	});
</script>

<div
	id="strongs-popup-{strongsPopupID}"
	style:--height={popupHeight}
	class="w-100 popup-container kjv-strongs-popup-container"
>
	<div
		id="strongs-suggestion-{strongsPopupID}"
		class="kjv-strongs-data"
		style:--height={popupHeight}
		tabindex="-1"
	>
		<div class="d-flex flex-row">
			{#if data}
				<p>{data}</p>
			{:else}
				<p></p>
			{/if}
			<span class="d-flex flex-fill"></span>
			<div on:click={onClose}>
				<Icon data={close}></Icon>
			</div>
		</div>
		{#if strongs}
			{@html strongs.strongsDef}
		{/if}
	</div>

	<span class="w-200" style="visibility: hidden;">space</span>
</div>

<style>
	.popup-container {
		height: var(--height);
	}
</style>

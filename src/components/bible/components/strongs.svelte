<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { bibleDB } from '../../../db/bible.db';

	export let parentHeight: number;
	export let keyboardBindings: Map<string, Function>;
	export let data: string;
	let strongsID = data;
	let strongsPopupID: string = uuidv4();
	let strongs: any;

	let containerHeight: number;

	const dispatch = createEventDispatcher();
	$: popupHeight = parentHeight + 'px';

	onMount(() => {
		let el = document.getElementById('strongs-popup-' + strongsPopupID);
		let pel = el?.parentNode as HTMLElement;
		containerHeight = pel.getBoundingClientRect().height;

		keyboardBindings.set('Enter', () => {
			keyboardBindings.delete('Enter');
			dispatch('popupHandler', {});
		});

		bibleDB.ready?.then(() => {
			bibleDB.getValue('chapters', strongsID.toLowerCase()).then((data) => {
				strongs = data;
				console.log(strongsPopupID.toLowerCase());
			});
		});
	});
</script>

<div id="strongs-popup-{strongsPopupID}" style:--height={popupHeight} class="w-100 popup-container kjv-strongs-popup-container">
	<div
		id="strongs-suggestion-{strongsPopupID}"
		class="kjv-strongs-data"
		style:--height={popupHeight}
		tabindex="-1"
	>
		{#if data}
			<p>{data}</p>
		{/if}

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

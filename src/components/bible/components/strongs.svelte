<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { scrolledIntoView } from '../../../utils/position';

	export let parentHeight: number;
	export let keyboardBindings: Map<string, Function>;
	let strongsID: string = uuidv4();

	let containerHeight: number;
	let footerHeight: number;

	const dispatch = createEventDispatcher();
	$: popupHeight = parentHeight - footerHeight + 'px';

	let strongsInput: string = '';
	let selectedSuggestion: number = 0;
	onMount(() => {
		let el = document.getElementById('strongs-popup-' + strongsID);
		let pel = el?.parentNode as HTMLElement;
		containerHeight = pel.getBoundingClientRect().height;

		keyboardBindings.set('Enter', () => {
			keyboardBindings.delete('Enter');
			dispatch('popupHandler', {});
		});
	});
</script>

<div id="strongs-popup-{strongsID}" style:--height={parentHeight} class="w-100 popup-container">
	<div
		id="strongs-suggestion-{strongsID}"
		class="suggestion"
		style:--height={popupHeight}
		tabindex="-1"
	>
		{#each { length: 20 } as _, i}
			<li id="suggestion-{strongsID}-{i}" class={i === selectedSuggestion ? 'selected' : ''}>
				{i + 1}
			</li>
		{/each}
	</div>
</div>

<style>
	.suggestion {
		height: var(--height);
		overflow: scroll;
		background-color: bisque;
	}

	.input {
		background-color: gray;
		position: absolute;
		bottom: 0;
	}

	.selected {
		background-color: rgb(127, 127, 127, 0.25);
	}

	.popup-container {
		height: var(--height);
	}
</style>

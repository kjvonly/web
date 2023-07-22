<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { scrolledIntoView } from '../../../utils/position';

    export let parentHeight: number;    
	let searchID: string = uuidv4();
    

	let containerHeight: number;
	let footerHeight: number;
	
	const dispatch = createEventDispatcher();
	$: popupHeight = (parentHeight - footerHeight) + 'px'; 

	let searchInput: string = '';
	let selectedSuggestion: number = 0;
	onMount(() => {
		let el = document.getElementById('search-popup-' + searchID);
		let pel = el?.parentNode as HTMLElement;
		containerHeight = pel.getBoundingClientRect().height;

		let input = document.getElementById('search-input-' + searchID);
		let suggestion = document.getElementById('search-suggestion-' + searchID);

		input?.focus();
		// Get the input field

		input?.addEventListener('keypress', function (event) {
			if (event.key === 'Enter') {
				event.preventDefault();

				console.log('enter  ');
				// dispatch('popupHandler', {
				// 	chapter: searchInput
				// });

				suggestion?.focus();
				// Get the input field
			}
		});

		suggestion?.addEventListener('keypress', function (event) {
			if (event.key === 'k') {
				console.log('ph', parentHeight ,'p', popupHeight, 'c', containerHeight, 'f', footerHeight);
				console.log('selectedSuggestion', selectedSuggestion);
				selectedSuggestion = selectedSuggestion + 1;
				scrolledIntoView(
					'suggestion-' + searchID + '-',
					String(selectedSuggestion),
					'search-suggestion-' + searchID
				);
			}
		});
	});
</script>

<div id="search-popup-{searchID}" style:--height={parentHeight} class="w-100 popup-container">
	<div
		id="search-suggestion-{searchID}"
		class="suggestion"
		style:--height={popupHeight}
		tabindex="-1">
		{#each { length: 20 } as _, i}
			<li id="suggestion-{searchID}-{i}" class={i === selectedSuggestion ? 'selected' : ''}>
				{i + 1}
			</li>
		{/each}
	</div>

	<div class="input w-100" bind:clientHeight={footerHeight}>
		<div class="d-flex justify-content-start w-100">
			<p class="m-0 text-center">Search:</p>
			<input
				id="search-input-{searchID}"
				class="w-100"
				bind:value={searchInput}
				placeholder="thy word i have hid"
			/>
		</div>
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

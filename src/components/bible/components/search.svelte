<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';

	let searchID: string = uuidv4();

	let containerHeight: number;
	let footerHeight: number;
	const dispatch = createEventDispatcher();
	$: popupHeight = containerHeight - footerHeight;

	let searchInput: string = '';

	onMount(() => {
		let el = document.getElementById('search-popup-' + searchID);
		let pel = el?.parentNode as HTMLElement;
		containerHeight = pel.getBoundingClientRect().height;
		let input = document.getElementById('search-input-' + searchID);
		input?.focus();
		// Get the input field

		input?.addEventListener('keypress', function (event) {
			if (event.key === 'Enter') {
				event.preventDefault();
				dispatch('popupHandler', {
					chapter: searchInput
				});
			}
		});
	});
</script>

<div id="search-popup-{searchID}" class="flex flex-fill w-100">
    <div class="suggestion">

    </div>
	<div class="input w-100" bind:clientHeight={footerHeight}>
		<div class="d-flex justify-content-start w-100">
			<p class="m-0 text-center">Search:</p>
			<input id="search-input-{searchID}" class="w-100" bind:value={searchInput} placeholder="thy word i have hid" />
		</div>
	</div>
</div>

<style>
	.suggestion {
		height: var(--height);
		overflow: auto;
        background-color: bisque;
	}

	.input {
		background-color: gray;
		position: absolute;
		bottom: 0;
	}
</style>

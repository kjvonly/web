<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';

	let gotoID: string = uuidv4();

	let containerHeight: number;
	let footerHeight: number;
	const dispatch = createEventDispatcher();
	$: suggestionHeight = containerHeight - footerHeight;

	let bookChapter: string = '';

	onMount(() => {
		let el = document.getElementById('goto-popup-' + gotoID);
		let pel = el?.parentNode as HTMLElement;
		containerHeight = pel.getBoundingClientRect().height;
		let input = document.getElementById('goto-input-' + gotoID);
		input?.focus();
		// Get the input field

		input?.addEventListener('keypress', function (event) {
			if (event.key === 'Enter') {
				event.preventDefault();
				dispatch('popupHandler', {
					chapter: bookChapter
				});
			}
		});
	});
</script>

<div id="goto-popup-{gotoID}" class="flex flex-fill w-100">
	<div class="input w-100" bind:clientHeight={footerHeight}>
		<div class="d-flex justify-content-start w-100">
			<p class="m-0 text-center">GOTO:</p>
			<input id="goto-input-{gotoID}" class="w-100" bind:value={bookChapter} placeholder="mat 1" />
		</div>
	</div>
</div>

<style>
	.goto {
	}
	.suggestion {
		height: var(--height);
		overflow: auto;
	}

	.input {
		background-color: gray;
		position: absolute;
		bottom: 0;
	}
</style>

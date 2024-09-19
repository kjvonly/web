<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import Icon from 'svelte-awesome';
	import { search } from 'svelte-awesome/icons';

	export let parentHeight: number;
	export let keyboardBindings: Map<string, Function>;
	export let data: string;
	export let parentId: string;

	let gotoID: string = uuidv4();

	let containerHeight: number;
	const dispatch = createEventDispatcher();

	let bookChapter: string = '';

	let gotoHeight: number;
	$: gotoHeightStyle = gotoHeight + 'px';
	onMount(() => {
		let el = document.getElementById('goto-popup-' + gotoID);
		let pel = el?.parentNode as HTMLElement;

		containerHeight = pel.getBoundingClientRect().height;
		let input = document.getElementById('goto-input-' + gotoID);

		if (input) {
			bookChapter = '';
		}

		let footer = document.getElementById('_' + parentId + '-footer') as HTMLElement;
		gotoHeight = footer.clientHeight;

		setTimeout(() => {
			input?.focus();
		}, 1);

		// Get the input field
	

		input?.addEventListener('keypress', function (event) {
			if (event.key === 'Enter') {
				onSearch(event)
			}
		});
	});

	function onSearch(event:any) {
			event.preventDefault();
				dispatch('popupHandler', {
					chapter: bookChapter
				});	
		}
</script>

<div id="goto-popup-{gotoID}" class="flex flex-fill w-100">
	<div
		class="d-flex flex-fill align-items-end kjv-chapter-goto-container w-100"
		style:--height={gotoHeightStyle}
	>
		<div class="d-flex kjv-chapter-goto-input-container w-100">
			<input
				id="goto-input-{gotoID}"
				class="kjv-chapter-goto-input w-100"
				bind:value={bookChapter}
				placeholder="search"
			/>
			<span class="d-flex flex-fill"></span>
			<div on:click={onSearch} class="d-flex align-items-center me-4">
				<Icon data={search}></Icon>
			</div>
		</div>
	</div>
</div>

<style>
	p {
		display: flex;
		align-items: center !important;
		justify-content: center !important;
		white-space: nowrap;
	}
</style>

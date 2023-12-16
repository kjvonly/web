<script lang="ts">
	import { onMount } from 'svelte';
	import type { Buffer } from '../../models/buffer.model';
	import { bufferStore } from '../../stores/buffer.store';

	import { v4 as uuidv4 } from 'uuid';

	export let buffer: Buffer;

	// stores if component has already been loaded or not
	let loaded = false;
	// Specify a uuid to differentiate multiple search buffers
	let quadrant: string = uuidv4();
	$: uniqueId = quadrant + '-search';

	let headerHeight: number;
	let footerHeight: number;
	let quadrantHeight: number;

	//TODO rename these variables to something more meaningful
	let qh: number;
	let qb: number;

	$: contentHeight = quadrantHeight - headerHeight - footerHeight + 'px';
	$: quadHeightMax = qh + 'px';

	// if the current buffer is selected update css to display that
	$: selected = buffer.selected ? 'selected-buffer' : '';

	let searchInput: string = '';

	onMount(() => {
		bufferStore.subscribe((buffs) => {
			if (loaded) {
				return;
			}
			let b = buffs.get(buffer.key);
			if (b) {
				buffer.bag = b.bag;
			}
			loaded = true;
		});

		//Sets the height of the buffer
		let el = document.getElementById(uniqueId);
		let pel = el?.parentNode as HTMLElement;
		let br = pel.getBoundingClientRect();
		qh = br.height;
		qb = br.bottom;

		let input = document.getElementById('search-input-' + uniqueId);

		setTimeout(function () {
			input?.focus();
			// Get the input field

			input?.addEventListener('keypress', function (event) {
				if (event.key === 'Enter') {
					event.preventDefault();

					console.log('enter  ');
					// dispatch('popupHandler', {
					// 	chapter: searchInput
					// });
				}
			});
		}, 200);
	});
</script>

<div
	id={uniqueId}
	class="quadrant"
	style:--height={quadHeightMax}
	bind:offsetHeight={quadrantHeight}
>
	<!-- HEADER -->
	<div class="header sticky-top" bind:offsetHeight={headerHeight}>
		<p class="text-sm m-0" />
	</div>

	<!-- CONTENT -->
	<div
		id="{uniqueId}-search-content"
		class="search-content flex-1 space-y-2 text-left flex-col items-left"
		style:--height={contentHeight}
	>
		<div class="input w-100" bind:clientHeight={footerHeight}>
			<div class="d-flex justify-content-start w-100">
				<p class="m-0 text-center">Search:&nbsp</p>
				<input
					id="search-input-{uniqueId}"
					class="w-100"
					bind:value={searchInput}
					placeholder="book='john' and text='for God so loved the world'"
				/>
			</div>
		</div>
	</div>

	<!-- FOOTER -->
	<div class="footer sticky-bottom {selected}" bind:offsetHeight={footerHeight}>
		<p class="text-sm m-0">
			<strong class="font-semibold">Search Buffer</strong>
		</p>
	</div>
</div>

<style>
	.quadrant {
		overflow: hidden;
		height: var(--height);
		margin: 0px !important;
		padding: 0px !important;
	}

	.search-content {
		overflow-y: scroll;
		height: var(--height);
	}

	.header {
		-webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
		-moz-box-sizing: border-box; /* Firefox, other Gecko */
		box-sizing: border-box;
		border-bottom: 1px solid lightgray;
		height: 30px !important;
	}

	.footer {
		background-color: gray;
		height: 30px !important;
	}

	/* TODO: move this up to parent container  */
	.selected-buffer {
		background-color: lightgray !important;
	}
</style>

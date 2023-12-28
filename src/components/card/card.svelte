<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';

	import { v4 as uuidv4 } from 'uuid';
	import type { Buffer } from '../../models/buffer.model';

	export let buffer: Buffer;
	export let popup: any;

	let cardId = '_kjv-card-' + uuidv4();
	
	let headerHeight: number;
	let footerHeight: number;

	let cardHeight: number;
	let cardBottom: number;


	$: selected = buffer.selected ? 'selected-card' : '';

	/* popup css */
	$: popupHeight = cardHeight / 2;
	$: popupHeightStyle = cardHeight / 2 + 'px';
	$: popuptop = cardBottom - cardHeight / 2 + 'px';
	var popupWidth: string;

	onMount(() => {
		let el = document.getElementById(cardId);
		let pel = el?.parentNode as HTMLElement;
		let br = pel.getBoundingClientRect();
		let card = document.getElementById(cardId) as HTMLElement;
		let body = document.getElementById(cardId + '-body') as HTMLElement;

		card.style.height = br.height + 'px';
		card.style.maxHeight = br.height + 'px';
		body.style.height = br.height - headerHeight - footerHeight + 'px';
		body.style.maxHeight = br.height - 60 + 'px';

		cardBottom = br.bottom;
		cardHeight = br.height;

		popupWidth = pel.getBoundingClientRect().width + 'px';

		const resizeObserver = new ResizeObserver((entries) => {
			var br = pel.getBoundingClientRect();

			card.style.height = br.height + 'px';
			card.style.maxHeight = br.height + 'px';

			body.style.height = br.height - 60 + 'px';
			body.style.maxHeight = br.height - 60 + 'px';

			cardBottom = br.bottom;
			cardBottom = br.bottom;
			cardHeight = br.height;
			popupWidth = br.width + 'px';
		});
		resizeObserver.observe(pel);
	});
</script>

<!-- https://learn.svelte.dev/tutorial/named-slots -->

<div id={cardId} class="kjv-card-container">
	<!-- card header -->
	<div class="kjv-card-header">
		<slot name="header" />
	</div>

	<!-- card body -->
	<div id="{cardId}-body" class="kjv-card">
		<slot name="body" {buffer} />
	</div>

	<!-- card popup -->

	{#if popup}
		<div
			class="popups flex flex-fill w-100"
			style:--height={popupHeightStyle}
			style:--top={popuptop}
			style:--maxWidth={popupWidth}
		>
			<svelte:component
				this={popup.component}
				on:popupHandler={popup.handler}
				bind:parentHeight={popupHeight}
				bind:keyboardBindings={buffer.keyboardBindings}
				bind:data={popup.data}
				bind:parentId={cardId}
			/>
		</div>
	{/if}

	<!-- card footer -->
	<div id="_{cardId}-footer" class="kjv-card-footer {selected}">
		<slot name="footer"/>
	</div>
</div>

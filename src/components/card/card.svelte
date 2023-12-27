<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';

	import { v4 as uuidv4 } from 'uuid';
	import type { Buffer } from '../../models/buffer.model';

	export let buffer: Buffer;
	let popup: any;
	let id: string = uuidv4();
	let quadrant = id;
	let headerHeight: number;
	let footerHeight: number;

	let qh: number;
	let qb: number;
	$: uniqueId = quadrant + '-v';

	$: selected = buffer.selected ? 'selected-card' : '';

	/* popup css */
	$: popupHeight = qh / 2;
	$: popupHeightStyle = qh / 2 + 'px';
	$: popuptop = qb - qh / 2 + 'px';
	var popupWidth: string;

	onMount(() => {
		let el = document.getElementById(uniqueId);
		let pel = el?.parentNode as HTMLElement;
		let br = pel.getBoundingClientRect();
		let quad = document.getElementById(uniqueId) as HTMLElement;
		let text = document.getElementById(uniqueId + '-card') as HTMLElement;

		quad.style.height = br.height + 'px';
		quad.style.maxHeight = br.height + 'px';
		text.style.height = br.height - headerHeight - footerHeight + 'px';
		text.style.maxHeight = br.height - 60 + 'px';

		qb = br.bottom;
		qh = br.height;

		popupWidth = pel.getBoundingClientRect().width + 'px';

		const resizeObserver = new ResizeObserver((entries) => {
			var br = pel.getBoundingClientRect();

			quad.style.height = br.height + 'px';
			quad.style.maxHeight = br.height + 'px';

			text.style.height = br.height - 60 + 'px';
			text.style.maxHeight = br.height - 60 + 'px';

			qb = br.bottom;
			qb = br.bottom;
			qh = br.height;
			popupWidth = br.width + 'px';
		});
		resizeObserver.observe(pel);
	});
</script>

<!-- https://learn.svelte.dev/tutorial/named-slots -->

<div id={uniqueId} class="kjv-card-quadrant">
	<!-- card header -->
	<div class="kjv-card-header">
		<slot name="header" {id}/>
	</div>

	<!-- card body -->
	<div id="{uniqueId}-card" class="kjv-card">
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
				bind:parentId={uniqueId}
			/>
		</div>
	{/if}

	<!-- card footer -->
	<div id="_{uniqueId}-footer" class="kjv-card-footer {selected}">
		<slot name="footer" {uniqueId} {id} />
	</div>
</div>

<!-- 
This is gonig to be the abstract buffer all other buffers 
with use to display their content.

TODO: Add in some exports to bind header, footer, and content

 -->
<script lang="ts">
	import type { Buffer } from '../../models/buffer.model';
	import { v4 as uuidv4 } from 'uuid';

	export let buffer: Buffer;

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

	//Sets the height of the buffer
	let el = document.getElementById(uniqueId);
	let pel = el?.parentNode as HTMLElement;
	let br = pel.getBoundingClientRect();
	qh = br.height;
	qb = br.bottom;
</script>

<div
	id={uniqueId}
	class="quadrant"
	style:--height={quadHeightMax}
	bind:offsetHeight={quadrantHeight}
>
	<div class="header sticky-top" bind:offsetHeight={headerHeight}>
		<p class="text-sm m-0" />
	</div>

	<div
		id="{uniqueId}-bibletext"
		class="bibletext flex-1 space-y-2 text-left flex-col items-left"
		style:--height={contentHeight}
	/>
	<div class="footer sticky-bottom {selected}" bind:offsetHeight={footerHeight}>
		<p class="text-sm m-0">
			<strong class="font-semibold">Bible Buffer</strong>
		</p>
	</div>
</div>

<style>
	.popups {
		height: var(--height);
		top: var(--top);

		position: absolute;
		z-index: 10000;
	}
	.quadrant {
		overflow: hidden;
		height: var(--height);
		margin: 0px !important;
		padding: 0px !important;
	}

	.selected {
		background-color: rgb(127, 127, 127, 0.25);
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

	.selected-buffer {
		background-color: lightgray !important;
	}
</style>

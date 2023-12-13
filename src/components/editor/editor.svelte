<script lang="ts">
	import Editor from '@tinymce/tinymce-svelte';
	import type { Buffer } from '../../models/buffer.model';

	import { v4 as uuidv4 } from 'uuid';
	import { onMount } from 'svelte';

	export let buffer: Buffer;
	$: selected = buffer.selected ? 'selected-buffer' : '';
	let inline: boolean | undefined = true;

	let quadrant: string = uuidv4();

	let headerHeight: number;
	let footerHeight: number;

	let quadrantHeight: number;

	let qh: number;
	$: uniqueId = quadrant + '-v';
	$: textHeight = quadrantHeight - headerHeight - footerHeight + 'px';
	$: quadHeightMax = qh + 'px';

	onMount(() => {
		buffer.onFocus = () => {
			let el = document.getElementById(quadrant + '-editor');
			el?.focus();
		};

		{
			let el = document.getElementById(quadrant + '-editor');
			el?.focus();
		}

		let el = document.getElementById(uniqueId);
		let pel = el?.parentNode as HTMLElement;
		qh = pel.getBoundingClientRect().height;
	});
</script>

<div
	id={uniqueId}
	class="quadrant"
	style:--height={quadHeightMax}
	bind:offsetHeight={quadrantHeight}
>
	<div class="header" bind:offsetHeight={headerHeight}>Notes For Genesis 1</div>
	<div style="z-index: -10" class="editortext" style:--height={textHeight}>
		<Editor id="{quadrant}-editor" {inline} scriptSrc="node_modules/tinymce/tinymce.min.js" />
	</div>
	<div class="footer {selected}" bind:offsetHeight={footerHeight}>
		<p class="text-sm m-0">
			<strong class="font-semibold">Notes Buffer</strong>
		</p>
	</div>
</div>

<style>
	.header {
		-webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
		-moz-box-sizing: border-box; /* Firefox, other Gecko */
		box-sizing: border-box;
		border-bottom: 1px solid lightgray;
		height: 30px !important;
	}

	.tox-editor-container {
		z-index: 10000;
	}
	.footer {
		background-color: gray;
		height: 30px !important;
	}

	.selected-buffer {
		background-color: lightgray !important;
	}

	.editortext {
		overflow-y: scroll;
		height: var(--height);
	}

	.quadrant {
		overflow: hidden;
		height: var(--height);
		margin: 0px !important;
		padding: 0px !important;
	}
</style>

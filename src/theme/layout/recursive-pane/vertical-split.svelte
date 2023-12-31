<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	import type { Pane } from '../../../models/pane.model';
	import RecursivePane from './recursive-pane.svelte';
	import { retry, handleAll, ConstantBackoff } from 'cockatiel';

	export let id: string;
	export let pane: Pane;

	$: _pane = pane;

	const dispatch = createEventDispatcher();
	function saveRootPane() {
		dispatch('save');
	}

	function resizeCol(resizeId: string, leftId: string, rightId: string, containerId: string) {
		var resize = document.querySelector(resizeId) as HTMLElement;
		var left = document.querySelector(leftId) as HTMLElement;
		var right = document.querySelector(rightId) as HTMLElement;
		var container = document.querySelector(containerId) as HTMLElement;

		if (resize === null || left === null || right === null || container === null) {
			throw `DOM NOT RENDERED YET FOR ${id}`;
		}

		left.style.width = _pane.leftPercentage;
		right.style.width = _pane.rightPercentage;

		var drag = false;
		var l: number;

		function mouseMove(e: MouseEvent | any) {
			if (drag) {
				var moveX = e.x;
				var rect = container ? container.getBoundingClientRect() : new DOMRect();
				l = ((moveX - rect.x) / rect.width) * 100;
				left.style.width = l + '%';
				right.style.width = 100 - l + '%';
			}
		}

		resize.addEventListener('mousedown', function (e: MouseEvent | any) {
			drag = true;
			container.addEventListener('mousemove', mouseMove);
		});

		container.addEventListener('mouseup', function (e: MouseEvent) {
			drag = false;
			container.removeEventListener('mousemove', mouseMove);
			pane.leftPercentage = l + '%';
			pane.rightPercentage = 100 - l + '%';
			saveRootPane();
		});
	}

	function registerResize() {
		resizeCol(
			`#_${id}-vertical-resize`,
			`#_${id}-vertical-left`,
			`#_${id}-vertical-right`,
			`#_${id}-pane`
		);
	}

	onMount(() => {
		// Register EventListeners
		const retryPolicy = retry(handleAll, { maxAttempts: 500, backoff: new ConstantBackoff(500) });
		(() => {
			setTimeout(
				() =>
					retryPolicy
						.execute(() => registerResize())
						.catch((reason) => console.log(reason, 'could not register app listeners for pane')),
				500
			);
		})();
	});
</script>

<div id="_{id}-vertical-left" class="kjv-left-pane">
	{#if _pane}
		{#if _pane.leftPane}
			<RecursivePane bind:pane={_pane.leftPane} on:save={saveRootPane} />
		{/if}
	{/if}
</div>
<div class="vertical-resize-container">
	<div id="_{id}-vertical-resize" class="vertical-resize"></div>
</div>
<div id="_{id}-vertical-right" class="kjv-right-pane">
	{#if _pane}
		{#if _pane.rightPane}
			<RecursivePane bind:pane={_pane.rightPane} on:save={saveRootPane} />
		{/if}
	{/if}
</div>

<style>
</style>

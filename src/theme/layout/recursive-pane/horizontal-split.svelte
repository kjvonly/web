<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Pane, PaneSplit } from '../../../models/pane.model';
	import RecursivePane from './recursive-pane.svelte';
	import { retry, handleAll, ConstantBackoff } from 'cockatiel';

	export let id: string;
	export let pane: Pane;

	$: _pane = pane;

	const dispatch = createEventDispatcher();
	function saveRootPane() {
		dispatch('save');
	}

	let currentSplit: PaneSplit = PaneSplit.Null;
	function resizeRow(resizeId: string, leftId: string, rightId: string, containerId: string) {
		var resize = document.querySelector(resizeId) as HTMLElement;
		var top = document.querySelector(leftId) as HTMLElement;
		var bottom = document.querySelector(rightId) as HTMLElement;
		var container = document.querySelector(containerId) as HTMLElement;

		if (resize === null || top === null || bottom === null || container === null) {
			console.log('something null');
			return;
		}

		top.style.height = _pane.leftPercentage;
		bottom.style.height = _pane.rightPercentage;
		var h: number;

		var drag = false;

		function mouseMove(e: MouseEvent | any) {
			if (drag) {
				var moveY = e.y;
				var rect = container ? container.getBoundingClientRect() : new DOMRect();
				h = ((moveY - rect.y) / rect.height) * 100;
				top.style.height = h + '%';
				bottom.style.height = 100 - h + '%';
			}
		}

		resize.addEventListener('mousedown', function (e: MouseEvent | any) {
			drag = true;
			container.addEventListener('mousemove', mouseMove);
		});

		container.addEventListener('mouseup', function (e: MouseEvent) {
			drag = false;
			container.removeEventListener('mousemove', mouseMove);
			pane.leftPercentage = h + '%';
			pane.rightPercentage = 100 - h + '%';
			saveRootPane();
		});
	}

	function registerResize() {
		if (_pane && _pane.split !== PaneSplit.Null) {
			if (currentSplit === PaneSplit.Null) {
				currentSplit = _pane.split;
				if (_pane.split === PaneSplit.Horizontal) {
					resizeRow(
						`#_${id}-horizontal-resize`,
						`#_${id}-horizontal-left`,
						`#_${id}-horizontal-right`,
						`#_${id}-pane`
					);
				}
			}
		}
	}
	// Register EventListeners
	const retryPolicy = retry(handleAll, { maxAttempts: 6, backoff: new ConstantBackoff(500) });

	var registerResizeEventsListeners = () =>
		setTimeout(
			() =>
				retryPolicy
					.execute(() => registerResize())
					.catch((reason) => console.log(reason, 'could not register app listeners for pane')),
			100
		);

	$: pane && registerResizeEventsListeners();
</script>

<div class="d-flex flex-column w-100">
	<div id="_{id}-horizontal-left" class="top">
		{#if _pane}
			{#if _pane.leftPane}
				<RecursivePane bind:pane={_pane.leftPane} on:save={saveRootPane} />
			{/if}
		{/if}
	</div>
	<div class="horizontal-resize-container">
		<div id="_{id}-horizontal-resize" class="horizontal-resize"></div>
	</div>

	<div id="_{id}-horizontal-right" class="bottom">
		{#if _pane}
			{#if _pane.rightPane}
				<RecursivePane bind:pane={_pane.rightPane} on:save={saveRootPane} />
			{/if}
		{/if}
	</div>
</div>

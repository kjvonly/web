<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { Pane, PaneSplit } from '../../models/pane.model';
	import { NullBuffer } from '../../models/buffer.model';
	import { createEventDispatcher } from 'svelte';
	import { retry, handleAll, ConstantBackoff } from 'cockatiel';
	import { paneService } from '../../services/pane.service';
	import VerticalSplit from './vertical-split.svelte';
	export let pane: Pane;

	let id = uuidv4();

	const dispatch = createEventDispatcher();
	function saveRootPane() {
		dispatch('save');
	}

	$: _pane = pane;

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
				if (_pane.split === PaneSplit.Vertical) {

				} else if (_pane.split === PaneSplit.Horizontal) {
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

	let currentSplit: PaneSplit = PaneSplit.Null;

	function registerSelectBuffer() {
		// _{id}-buffer
		if (_pane && _pane.parentNode !== null && _pane.split === PaneSplit.Null) {
			var b = document.querySelector(`#_${id}-buffer`) as HTMLElement;
			if (b === null) {
				throw `DOM NOT RENDERED YET FOR _${id}-buffer`;
			}

			b.addEventListener('mouseup', (e) => {
				paneService.selectPane(pane.buffer);
			});
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

	var registerSelectBufferEventsListeners = () =>
		setTimeout(
			() =>
				retryPolicy
					.execute(() => registerSelectBuffer())
					.catch((reason) => console.log(reason, 'could not register app listeners for pane')),
			100
		);

	$: pane && registerResizeEventsListeners() && registerSelectBufferEventsListeners();
	$: panePadding = _pane && _pane.split === PaneSplit.Null ? 'padding:1rem;' : '';
</script>

<div id="_{id}-pane" class="pane" style={panePadding}>
	{#if _pane && _pane.split === PaneSplit.Null}
		<div id="_{id}-buffer" class="w-100">
			{#if !(_pane.buffer instanceof NullBuffer)}
				<svelte:component this={_pane.buffer.component} bind:buffer={pane.buffer} />
			{/if}
			{#if _pane.buffer instanceof NullBuffer && _pane.buffer.selected}
				<span>selected</span>
			{/if}
		</div>
	{:else if _pane && _pane.split !== PaneSplit.Null && _pane.buffer instanceof NullBuffer}
		{#if _pane.split === PaneSplit.Vertical}
			<VerticalSplit bind:pane={_pane} bind:id={id} on:save={saveRootPane}></VerticalSplit>
		{:else if _pane.split === PaneSplit.Horizontal}
			<div class="d-flex flex-column w-100">
				<div id="_{id}-horizontal-left" class="top">
					{#if _pane}
						{#if _pane.leftPane}
							<svelte:self bind:pane={_pane.leftPane} on:save={saveRootPane} />
						{/if}
					{/if}
				</div>
				<div class="horizontal-resize-container">
					<div id="_{id}-horizontal-resize" class="horizontal-resize"></div>
				</div>

				<div id="_{id}-horizontal-right" class="bottom">
					{#if _pane}
						{#if _pane.rightPane}
							<svelte:self bind:pane={_pane.rightPane} on:save={saveRootPane} />
						{/if}
					{/if}
				</div>
			</div>
		{/if}
	{/if}
</div>

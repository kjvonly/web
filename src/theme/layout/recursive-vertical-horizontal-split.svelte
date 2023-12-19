<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { Pane, PaneSplit } from '../../models/pane.model';
	import { NullBuffer } from '../../models/buffer.model';
	import { createEventDispatcher } from 'svelte';
	import {
		retry,
		handleAll,
		ConstantBackoff
	} from 'cockatiel';
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

	function resizeCol(resizeId: string, leftId: string, rightId: string, containerId: string) {
		var resize = document.querySelector(resizeId) as HTMLElement;
		var left = document.querySelector(leftId) as HTMLElement;
		var right = document.querySelector(rightId) as HTMLElement;
		var container = document.querySelector(containerId) as HTMLElement;

		if (resize === null || left === null || right === null || container === null) {
			console.log(id, resize, left, right, container);
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
		if (_pane && _pane.split !== PaneSplit.Null) {
			if (currentSplit === PaneSplit.Null) {
				currentSplit = _pane.split;
				if (_pane.split === PaneSplit.Vertical) {
					resizeCol(
						`#_${id}-vertical-resize`,
						`#_${id}-vertical-left`,
						`#_${id}-vertical-right`,
						`#_${id}-pane`
					);
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

	// Create a retry policy that'll try whatever function we execute 3
	// times with a randomized exponential backoff.
	const retryPolicy = retry(handleAll, { maxAttempts: 6, backoff: new ConstantBackoff(500) });

	var reg = () =>
		setTimeout(
			() =>
				retryPolicy
					.execute(() => registerResize())
					.catch((reason) => console.log(reason, 'could not register app listeners for pane')),
			100
		);

	$: pane && reg();
</script>

<div id="_{id}-pane" class="pane">
	{#if _pane && _pane.parentNode === null && _pane.split === PaneSplit.Null}
		<div id="{id}-root" class="w-100">
			{#if !(_pane.buffer instanceof NullBuffer)}
				<svelte:component this={_pane.buffer.component} bind:buffer={pane.buffer} />
			{/if}
			{#if _pane.buffer instanceof NullBuffer && _pane.buffer.selected}
				<span>selected</span>
			{/if}
		</div>
	{:else if _pane && _pane.parentNode !== null && _pane.split === PaneSplit.Null}
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
			<div id="_{id}-vertical-left" class="left">
				{#if _pane}
					{#if _pane.leftPane}
						<svelte:self bind:pane={_pane.leftPane} on:save={saveRootPane} />
					{/if}
				{/if}
			</div>
			<div id="_{id}-vertical-resize" class="resize h-100"></div>
			<div id="_{id}-vertical-right" class="right">
				{#if _pane}
					{#if _pane.rightPane}
						<svelte:self bind:pane={_pane.rightPane} on:save={saveRootPane} />
					{/if}
				{/if}
			</div>
		{:else if _pane.split === PaneSplit.Horizontal}
			<div class="d-flex flex-column w-100">
				<div id="_{id}-horizontal-left" class="top">
					{#if _pane}
						{#if _pane.leftPane}
							<svelte:self bind:pane={_pane.leftPane} on:save={saveRootPane} />
						{/if}
					{/if}
				</div>
				<div id="_{id}-horizontal-resize" class="resizeh"></div>

				<div id="_{id}-horizontal-right" class="bottom">
					{#if _pane}
						{#if _pane.rightPane}
							<svelte:self bind:pane={_pane.rightPane} on:save={saveRootPane} />
						{/if}
					{/if}
				</div>
			</div>
		{/if}
	{:else if _pane && _pane.parentNode !== null && !(_pane.buffer instanceof NullBuffer)}
		<svelte:component this={_pane.buffer.component} bind:buffer={pane.buffer} />
	{/if}
</div>

<style>
	.pane {
		height: 100%;
		width: 100%;
		display: flex;
		align-self: flex-start;
	}

	.resizeh {
		background-color: yellow;
		height: 14px;
		width: 100%;
		cursor: row-resize;
		flex-shrink: 0;
		position: relative;
		z-index: 10;
	}

	.resize {
		background-color: yellow;
		height: 100%;
		width: 14px;
		cursor: col-resize;
		flex-shrink: 0;
		position: relative;
		z-index: 10;
	}

	.left {
		width: 50%;
	}

	.right {
		width: 50%;
	}

	.top {
		width: 100%;
		height: 50%;
		align-self: flex-start;
	}

	.bottom {
		height: 50%;
		width: 100%;
	}

	div {
		margin: 0px;
		padding: 0px;
	}
</style>

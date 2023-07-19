<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { Pane, PaneSplit } from '../../models/pane.model';
	import { NullBuffer } from '../../models/buffer.model';
	let id = uuidv4();
	export let pane: Pane;
	$: _pane = pane;
</script>

<div class="row h-100">
	{#if _pane && _pane.parentNode === null && _pane.split === PaneSplit.Null}
		<div id="{id}-root" class="col-6 flex flex-fill">
			{#if !(_pane.buffer instanceof NullBuffer)}
				<svelte:component this={_pane.buffer.component} bind:buffer={pane.buffer} />
			{/if}
		</div>
	{/if}
	{#if _pane && _pane.split !== PaneSplit.Null && _pane.buffer instanceof NullBuffer}
		{#if _pane.split === PaneSplit.Vertical}
			<div id="{id}-vertical-left" class="col-6 flex flex-fill">
				{#if _pane}
					{#if _pane.leftPane}
						<svelte:self bind:pane={_pane.leftPane} />
					{/if}
				{/if}
			</div>
			<div id="{id}-vertical-right" class="col-6 flex flex-fill">
				{#if _pane}
					{#if _pane.rightPane}
						<svelte:self bind:pane={_pane.rightPane} />
					{/if}
				{/if}
			</div>
		{:else if _pane.split === PaneSplit.Horizontal}
			<div class="row h-50">
				<div id="{id}-horizontal-left" class="col-6 flex flex-fill">
					{#if _pane}
						{#if _pane.leftPane}
							<svelte:self bind:pane={_pane.leftPane} />
						{/if}
					{/if}
				</div>
			</div>
			<div class="row h-50">
				<div id="{id}-horizontal-right" class="col-6 flex flex-fill">
					{#if _pane}
						{#if _pane.rightPane}
							<svelte:self bind:pane={_pane.rightPane} />
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
	.row,
	.col-6 {
		margin: 0;
		padding: 0;
	}
</style>

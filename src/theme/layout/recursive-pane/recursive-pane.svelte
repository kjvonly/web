<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { Pane, PaneSplit } from '../../../models/pane.model';
	import { NullBuffer } from '../../../models/buffer.model';
	import { createEventDispatcher, onMount } from 'svelte';
	import { retry, handleAll, ConstantBackoff } from 'cockatiel';
	import { paneService } from '../../../services/pane.service';
	import VerticalSplit from './vertical-split.svelte';
	import HorizontalSplit from './horizontal-split.svelte';
	export let pane: Pane;

	let id = uuidv4();
	$: _pane = pane;

	const dispatch = createEventDispatcher();
	function saveRootPane() {
		dispatch('save');
	}

	function registerSelectBuffer() {
		if (_pane && _pane.parentNode !== null && _pane.split === PaneSplit.Null) {
			var b = document.querySelector(`#_${id}-buffer-pane`) as HTMLElement;
			if (b === null) {
				throw `DOM NOT RENDERED YET FOR _${id}-buffer-pane`;
			}

			b.addEventListener('mouseup', (e) => {
				paneService.selectPane(pane.buffer);
			});
		}
	}

	onMount(() => {
		// Register EventListeners
		
		const retryPolicy = retry(handleAll, { maxAttempts: 500, backoff: new ConstantBackoff(500) });
		(() => {
			setTimeout(
				() =>
					retryPolicy
						.execute(() => registerSelectBuffer())
						.catch((reason) => console.log(reason, 'could not register app listeners for pane')),
				1000
			);
		})();
	});

	$: panePadding = _pane && _pane.split === PaneSplit.Null ? 'pane-pad' : '';
</script>

<div id="_{id}-pane" class="pane {panePadding}">
	{#if _pane && _pane.split === PaneSplit.Null}
		<div id="_{id}-buffer-pane" class="w-100">
			{#if !(_pane.buffer instanceof NullBuffer)}
				<svelte:component this={_pane.buffer.component} bind:buffer={pane.buffer} />
			{/if}
			{#if _pane.buffer instanceof NullBuffer && _pane.buffer.selected}
				<span>selected</span>
			{/if}
		</div>
	{:else if _pane && _pane.split !== PaneSplit.Null && _pane.buffer instanceof NullBuffer}
		{#if _pane.split === PaneSplit.Vertical}
			<VerticalSplit bind:pane={_pane} bind:id on:save={saveRootPane}></VerticalSplit>
		{:else if _pane.split === PaneSplit.Horizontal}
			<HorizontalSplit bind:pane={_pane} bind:id on:save={saveRootPane}></HorizontalSplit>
		{/if}
	{/if}
</div>

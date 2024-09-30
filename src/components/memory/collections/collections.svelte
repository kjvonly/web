<script lang="ts">
	import { onMount } from 'svelte';
	import { BCV, Collection, memoryService, Series, Topic } from '../../../api/memory.service';
	import type { Buffer } from '../../../models/buffer.model';
	import Card from '../../card/card.svelte';
	import { Icon } from 'svelte-awesome';
	import { angleLeft } from 'svelte-awesome/icons';
	import playCircle from 'svelte-awesome/icons/playCircle';
	import Verses from './components/verses.svelte';

	export let buffer: Buffer;
	let popup: any;
	let popupRatio = 1;

	let title = 'collections';

	enum State {
		Collections,
		Series,
		Topic,
		Verses
	}
	let currentState = State.Collections;

	function onCollection(s: Array<Series>) {
		title = 'series';
		buffer.bag.series = s;
		currentState = State.Series;
		buffer.bag.currentState = State.Series
	}

	function onSeries(t: Array<Topic>) {
		title = 'topics';
		buffer.bag.topics = t;
		buffer.bag.currentState = State.Topic;
		currentState =  State.Topic
	}

	function onTopic(bcv: BCV[]) {
		currentState = State.Verses;
		buffer.bag.currentState = State.Verses
		buffer.bag.bcvs = bcv;
	}

	onMount(() => {
		memoryService.getCollections().then((data) => {
			buffer.bag.collections = data;
		});


		buffer.bag.collections = Array<Collection>()
		buffer.bag.series =  Array<Series>();
		buffer.bag.topics = Array<Topic>();
		buffer.bag.verses = Array<BCV>()

		title = 'collections';
	});
</script>

<Card bind:buffer bind:popup bind:popupRatio>
	<div slot="header" class="kjv-memory-collections-header w-100">
		<div class="d-flex flex-row align-items-center ps-2 w-100 h-100">
			<Icon data={angleLeft} scale={2}></Icon>
			<div class="d-flex d-flex justify-content-center align-items-center w-100 h-100">
				<span class="text-capitalize title">{title}</span>
			</div>
		</div>
	</div>
	<div slot="body" class="kjv-collections w-100 h-100">
		{#if currentState == State.Collections && buffer.bag && buffer.bag.collections}
			{#each buffer.bag.collections as c}
				<div class="kjv-collection-container">
					<div on:click={() => onCollection(c.series)} class="d-flex flex-row align-items-center">
						<span class="kjv-collection-name">
							{c.name}
						</span>
						<span class="d-flex flex-fill"></span>
						<Icon class="m-2" data={playCircle} scale={2}></Icon>
					</div>
				</div>
			{/each}
		{/if}

		{#if currentState == State.Series}
			{#each buffer.bag.series as s}
				<div class="d-flex flex-column kjv-series-container">
					<div on:click={() => onSeries(s.topics)} class="d-flex flex-row align-items-center">
						<span class="kjv-series-name">{s.name}</span>
						<span class="d-flex flex-fill"></span>
						<Icon class="m-2" data={playCircle} scale={2}></Icon>
					</div>
				</div>
			{/each}
		{/if}

		{#if currentState == State.Topic}
			{#each buffer.bag.topics as t}
				<div class="d-flex flex-column">
					<div
						on:click={() => onTopic(t.bcvs)}
						class="d-flex flex-row kjv-series-container align-items-center"
					>
						<span class="kjv-series-name">{t.name}</span>
						<span class="d-flex flex-fill"></span>
						<Icon class="m-2" data={playCircle} scale={2}></Icon>
					</div>
				</div>
			{/each}
		{/if}
		{#if currentState == State.Verses}
			<svelte:component this={Verses} bind:bcvs={buffer.bag.bcvs} bind:buffer={buffer}></svelte:component>
		{/if}
	</div>
	<div slot="footer" class="w-100 h-100"></div>
</Card>

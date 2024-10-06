<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { BCV, Collection, memoryService, Series, Topic } from '../../../api/memory.service';
	import { Buffer, NullBuffer } from '../../../models/buffer.model';
	import Card from '../../card/card.svelte';
	import { Icon } from 'svelte-awesome';
	import { angleLeft } from 'svelte-awesome/icons';
	import playCircle from 'svelte-awesome/icons/playCircle';
	import Verses from './components/verses.svelte';
	import { bufferService } from '../../../services/buffer.service';
	import { currentBuffer } from '../../../services/current-buffer.service';
	import { paneService } from '../../../services/pane.service';
	import Chapter from '../../bible/chapter.svelte';
	import { v4 as uuidv4 } from 'uuid';

	export let buffer: Buffer;
	let popup: any;
	let popupRatio = 1;
	$: memoryId = '_kjv-collections-' + uuidv4();
	let height: number | undefined;
	let title = 'collections';
	let audioElement: HTMLAudioElement | null;

	const dispatch = createEventDispatcher();

	enum State {
		Collections,
		Series,
		Topic,
		Verses
	}

	function onCollection(s: Array<Series>) {
		title = 'series';
		buffer.bag.series = s;
		buffer.bag.currentState = State.Series;

		bufferService.set(buffer);
		paneService.saveRootPane();
	}

	function onSeries(t: Array<Topic>) {
		title = 'topics';
		buffer.bag.topics = t;
		buffer.bag.currentState = State.Topic;

		bufferService.set(buffer);
		paneService.saveRootPane();
	}

	function onTopic(bcvs: BCV[]) {
		title = 'verses';
		buffer.bag.currentState = State.Verses;
		buffer.bag.bcvs = bcvs;

		bufferService.set(buffer);
		paneService.saveRootPane();
	}

	function onBack() {
		switch (buffer.bag.currentState) {
			case State.Collections:
				bufferService.set(buffer);
				paneService.saveRootPane();
				dispatch('handler', {
					componentName: 'home'
				});
			case State.Series:
				buffer.bag.series = [];
				buffer.bag.currentState = State.Collections;
				title = 'collections';
				break;
			case State.Topic:
				buffer.bag.currentState = State.Series;
				buffer.bag.topics = [];
				title = 'series';
				break;
			case State.Verses:
				audioElement = document.querySelector('audio');
				audioElement?.pause();
				if (buffer.bag.topics && buffer.bag.topics.length > 0) {
					buffer.bag.currentState = State.Topic;
					buffer.bag.verses = [];
					title = 'topics';
				} else if (buffer.bag.series && buffer.bag.series.length > 0) {
					buffer.bag.currentState = State.Series;
					buffer.bag.topics = [];
					title = 'series';
				} else {
					buffer.bag.currentState = State.Collections;
					buffer.bag.series = [];
					title = 'collections';
				}
		}

		bufferService.set(buffer);
		paneService.saveRootPane();
	}

	onMount(() => {
		memoryService.getCollections().then((d: any) => {
			let data: Collection[] = d.collections
			for (let col = 0; col < data.length; col++) {
				for (let ser = 0; ser < data[col].series.length; ser++) {
					let sn = data[col].series[ser].name;
					if (data[col].series[ser].topics)
						for (let top = 0; top < data[col].series[ser].topics.length; top++) {
							let tn = data[col].series[ser].topics[top].name;

							for (let verse = 0; verse < data[col].series[ser].topics[top].bcvs.length; verse++) {
								data[col].series[ser].topics[top].bcvs[verse].series = sn;
								data[col].series[ser].topics[top].bcvs[verse].topic = tn;
							}
						}
				}
			}
			buffer.bag.collections = data;
		});

		let el = document.getElementById('kjv-collections-' + memoryId);
		height = el?.clientHeight;

		if (buffer && buffer.bag && buffer.bag.currentState) {
			switch (buffer.bag.currentState) {
				case State.Collections:
					title = 'collections';
					break;
				case State.Series:
					title = 'series';
					break;
				case State.Topic:
					title = 'topic';
					break;
				case State.Verses:
					title = 'verses';
					break;
			}
		} else {
			buffer.bag.currentState = State.Collections;
			buffer.bag.collections = Array<Collection>();
			buffer.bag.series = Array<Series>();
			buffer.bag.topics = Array<Topic>();
			buffer.bag.verses = Array<BCV>();
		}
	});

	function playVerses(e: any): BCV[] {
		let bcvs = [];
		if (e.series) {
			for (let si = 0; si < e.series.length; si++) {
				const element = e.series[si];
				let b = playVerses(element);
				bcvs.push(...b);
			}
		}

		if (e.topics) {
			for (let ti = 0; ti < e.topics.length; ti++) {
				const element = e.topics[ti] as Topic;
				bcvs.push(...element.bcvs);
			}
		}
		return bcvs;
	}

	function playAll(e: any) {
		onTopic(playVerses(e));
	}
</script>

<Card bind:buffer bind:popup bind:popupRatio>
	<div slot="header" class="kjv-memory-collections-header w-100">
		<div class="d-flex flex-row align-items-center ps-2 w-100 h-100">
			<div on:click={() => onBack()}>
				<Icon data={angleLeft} scale={2}></Icon>
			</div>
			<div class="d-flex d-flex justify-content-center align-items-center w-100 h-100">
				<span class="text-capitalize title">{title}</span>
			</div>
		</div>
	</div>
	<div
		slot="body"
		class="kjv-collections kjv-collections-{memoryId} w-100 h-100"
		let:bodyHeight
		style="max-height: {bodyHeight}px"
	>
		{#if buffer.bag.currentState == State.Collections && buffer.bag && buffer.bag.collections}
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

		{#if buffer.bag.currentState == State.Series}
			{#each buffer.bag.series as s}
				<div class="d-flex flex-column kjv-series-container">
					<div on:click={() => onSeries(s.topics)} class="d-flex flex-row align-items-center">
						<span class="kjv-series-name">{s.name}</span>
						<span class="d-flex flex-fill"></span>
						<div on:click={() => playAll(s)}>
							<Icon style="z-index: 10" class="m-2" data={playCircle} scale={2}></Icon>
						</div>
					</div>
				</div>
			{/each}
		{/if}

		{#if buffer.bag.currentState == State.Topic}
			{#each buffer.bag.topics as t}
				<div class="d-flex flex-column kjv-topic-container">
					<div on:click={() => onTopic(t.bcvs)} class="d-flex flex-row align-items-center">
						<span class="kjv-series-name">{t.name}</span>
						<span class="d-flex flex-fill"></span>
						<Icon class="m-2" data={playCircle} scale={2}></Icon>
					</div>
				</div>
			{/each}
		{/if}
		{#if buffer.bag.currentState == State.Verses}
			<svelte:component this={Verses} bind:bcvs={buffer.bag.bcvs} bind:buffer bind:height
			></svelte:component>
		{/if}
	</div>
	<div slot="footer" class="w-100 h-100"></div>
</Card>

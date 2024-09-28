<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import Icon from 'svelte-awesome';
	import { search, close, angleDown, angleUp } from 'svelte-awesome/icons';
	import { chapterService } from '../../../api/chapters.service';

	export let parentHeight: number;
	export let keyboardBindings: Map<string, Function>;
	export let data: string;
	export let parentId: string;

	let gotoID: string = uuidv4();

	let containerHeight: number;
	const dispatch = createEventDispatcher();

	let bookChapter: string = '';
	let bookListHeight: number = 0;

	$: popupHeight = parentHeight + 'px';
	$: booksOrdered = [];
	$: BooksAlphabetical = [];

	function compareNumbers(a: any, b: any) {
		return a - b;
	}

	onMount(() => {
		chapterService.getChapter('booknames').then((data: any) => {
			let bookNames: any = data;

			for (const k of Object.keys(bookNames['booknamesById']).sort(compareNumbers)) {
				booksOrdered.push({
					bookId: k,
					name: bookNames['booknamesById'][k],
					showChapters: false,
					maxChapter: bookNames['maxChapterById'][k],
					shortName: bookNames['shortNames'][k],
				});
			}

			booksOrdered = booksOrdered;
		});

		let el = document.getElementById('goto-popup-' + gotoID);
		let pel = el?.parentNode as HTMLElement;

		//	containerHeight = pel.getBoundingClientRect().height;
		let input = document.getElementById('goto-input-' + gotoID);

		let inputHeight = document.getElementById('kjv-chapter-goto-input-container-' + gotoID);
		console.log(inputHeight);
		if (inputHeight != null) {
			console.log(inputHeight.clientHeight + 'client height');
			bookListHeight = parentHeight - inputHeight.clientHeight;
		}

		if (input) {
			bookChapter = '';
		}

		setTimeout(() => {
			input?.focus();
		}, 1);

		// Get the input field

		input?.addEventListener('keypress', function (event) {
			if (event.key === 'Enter') {
				onSearch(event);
			}
		});
	});

	function onSearch(event: any) {
		event.preventDefault();
		dispatch('popupHandler', {
			chapter: bookChapter
		});
	}

	function onClose() {
		dispatch('popupHandler', {
			chapter: ''
		});
	}
</script>

<div id="goto-popup-{gotoID}" style:--height={popupHeight} class="w-100 popup-container">
	<div class="d-flex flex-column h-100 w-100">
		<div class="d-flex flex-row w-100">
			<span class="d-flex flex-fill"></span>

			<div class="me-2" on:click={onClose}>
				<Icon data={close}></Icon>
			</div>
		</div>

		<div class="kjv-goto-book-list" style:--height={bookListHeight - 20 + 'px'}>
			{#each booksOrdered as v}
				<div class="d-flex flex-row w-100 m-1">
					{v['name']}
					<span class="d-flex flex-fill"></span>
					<div class="d-flex flex-row me-4">
						{#if !v['showChapters']}
							<div
								on:click={() => {
									v['showChapters'] = true;
								}}
							>
								<Icon data={angleDown}></Icon>
							</div>
						{/if}
						{#if v['showChapters']}
							<div
								on:click={() => {
									v['showChapters'] = false;
								}}
							>
								<Icon data={angleUp}></Icon>
							</div>
						{/if}
					</div>
				</div>

				{#if v['showChapters']}
					<div class="row justify-content-center m-2">
						{#each { length: v['maxChapter'] } as _, i}
							<div
								on:click={(e) => {
									bookChapter = v['shortName'] + ' ' + (i + 1);
									onSearch(e);
								}}
								class="kjv-goto-chapter-number text-center m-2 col-2"
							>
								<span class="">{i + 1}</span>
							</div>
						{/each}
					</div>
				{/if}
			{/each}
		</div>
		<span class="d-flex flex-fill"></span>

		<div class="d-flex w-100">
			<div
				id="kjv-chapter-goto-input-container-{gotoID}"
				class="d-flex kjv-chapter-goto-input-container w-100"
			>
				<input
					id="goto-input-{gotoID}"
					class="kjv-chapter-goto-input w-100"
					bind:value={bookChapter}
					placeholder="short book chapter: joh 3 or deu 28"
				/>
				<span class="d-flex flex-fill"></span>
				<div on:click={onSearch} class="d-flex align-items-center me-4">
					<Icon data={search}></Icon>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.kjv-goto-book-list {
		overflow-y: scroll;
		display: flex;
		flex-direction: column;
	}
</style>

<script lang="ts">
	import tree from 'svelte-awesome/icons/tree';
	import Icon from 'svelte-awesome';
	import volumeUp from 'svelte-awesome/icons/volumeUp';

	export let learnVersesSelected = true;
	export let hearVersesSelected = false;

	function onLearnVersesSelected() {
		hearVersesSelected = false;
		learnVersesSelected = true;
	}
	function onHearVersesSelected() {
		hearVersesSelected = true;
		learnVersesSelected = false;
	}
</script>

<div class="kjv-myscore-container">
	<div class="kjv-myscore-header d-flex flex-row justify-content-between p-2">
		<span>my score</span>
		<span>0pts</span>
	</div>
	<div
		on:click={onLearnVersesSelected}
		class="kjv-myscore-learn-verses-container {learnVersesSelected
			? 'kjv-myscore-selected-container'
			: ''}  d-flex flex-row m-2 text-center align-content-center"
	>
    <Icon class="kjv-myscore-icon" data={tree}></Icon>
    <span class="ps-3">learn verses </span>
		<span class="d-flex flex-fill"></span>
		<span>0pts</span>
	</div>

	<div
		on:click={onHearVersesSelected}
		class="kjv-myscore-hear-my-verses-container {hearVersesSelected
			? 'kjv-myscore-selected-container'
			: ''} d-flex flex-row m-2 text-center align-content-center"
	>
		<Icon class="kjv-myscore-icon" data={volumeUp}></Icon>
		<span class="ps-3">hear my verses </span>
		<span class="d-flex flex-fill"></span>
		<span>0pts</span>
	</div>
</div>

<style>
</style>

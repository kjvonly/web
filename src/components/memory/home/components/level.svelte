<script lang="ts">
	import { Icon } from 'svelte-awesome';
	import flag from 'svelte-awesome/icons/flag';

    let completedVerses = 12;
    let totalLevelVerses = 65
</script>

<div class="kjv-level-container row p-3">
	<div class="col-12">
		<div class="d-flex flex-row">
			<Icon data={flag}></Icon>
			<span class="kjv-level-name ms-2">topical memory system</span>
		</div>
		<div class="d-flex flex-row">
			<span class="kjv-level">level 1</span>
		</div>
		<div class="kjv-level-progress-bar-container progress">
			<div class="kjv-level-progress-bar progress-inner" style="width: {Math.floor(completedVerses/totalLevelVerses * 100)}%"></div>
		</div>
		<div class="d-flex flex-row">
			<span class="kjv-level-to-next-level">to level 2</span>
			<span class="d-flex flex-fill"></span>
			<span>{completedVerses}/{totalLevelVerses}</span>
		</div>
	</div>
</div>

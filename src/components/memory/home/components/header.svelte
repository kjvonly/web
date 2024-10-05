<script lang="ts">
	import { Icon } from 'svelte-awesome';
	import { book } from 'svelte-awesome/icons';
	import fire from 'svelte-awesome/icons/fire';
	import userCircleO from 'svelte-awesome/icons/userCircleO';
</script>

<div class="kjv-memory-header d-flex flex-row">
	<span class="d-flex flex-fill"></span>

	<Icon data={book}></Icon>
	<div class="d-flex flex-row me-3 ms-3">
		<Icon data={fire}></Icon>
		<span class="ms-2">0</span>
	</div>
	<Icon class="me-3" data={userCircleO}></Icon>
</div>

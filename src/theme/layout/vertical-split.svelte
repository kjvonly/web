<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	let id = uuidv4();
</script>

<div class="row h-100">
	<div id="{id}-first" class="col-6 flex flex-fill" style="background-color: blue;">
		<slot name="first" />
	</div>
	<div id="{id}-second" class="col-6 flex flex-fill" style="background-color: red;">
		<slot name="second" />
	</div>
</div>

<style>
</style>

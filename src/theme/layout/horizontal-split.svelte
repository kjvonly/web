<script lang="ts">
import { v4 as uuidv4 } from 'uuid';



let id = uuidv4()
</script>

<div class="row h-50">
	<div id="{id}-top" class="col-6 flex flex-fill" style="background-color: green;">
		<slot name="top" />
	</div>
</div>
<div class="row h-50">
	<div id="{id}-bottom" class="col-6 flex flex-fill" style="background-color: yellow;">
		<slot name="bottom" />
	</div>
</div>

<style>
</style>


<script lang="ts">
import type { Buffer } from '../../models/buffer.model';
import Card from '../card/card.svelte';

export let buffer: Buffer;
let popup: any;

</script>


<Card bind:buffer bind:popup>
    <div slot="body" let:bodyHeight>
		<div class="kjv-memory" style="max-height: {bodyHeight}px;">
            <h1>it works</h1>    
        </div>
    </div>
    
</Card>
<script>
	import { Buffer } from "../../models/buffer.model";
import Card from "./card.svelte";

let buffer = new Buffer()
</script>

<Card bind:buffer={buffer}>
    <div>
        Hello world
    </div>
</Card>

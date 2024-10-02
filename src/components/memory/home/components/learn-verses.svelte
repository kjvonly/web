<script>
	import { createEventDispatcher } from 'svelte';
	import { Icon } from 'svelte-awesome';
	import tree from 'svelte-awesome/icons/tree';

    let dispatch = createEventDispatcher()
    function toCollections() {
        console.log('tocollections')
        dispatch('handler', {
            componentName: "collections"
        })
    }
</script>

<div class="row kjv-learn-verses-container">
	<div class="col-9">
		<div class="d-flex flex-row m-2 align-items-center">
			<Icon class="kjv-learn-verses-icon" data={tree}></Icon>
            <div class="d-flex flex-column ms-2">
                <span class="kjv-learn-verses-title text-capitalize ">learn verses </span>    
                <span class="kjv-learn-verses-series">
                    Series: Live the New Life
                </span>
            </div>
			
		</div>
        
	</div>

    <div class="col-3 d-flex align-items-center">
        <button on:click={() => toCollections()} type="button" class="btn kjv-learn-verses-button">Start</button>
    </div>
    
    
</div>

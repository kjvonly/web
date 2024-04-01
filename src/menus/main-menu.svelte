<script lang="ts">
	import { menu } from './menu';
    import Icon from 'svelte-awesome';
    import { paneService } from '../services/pane.service';
	import type { MenuItem } from '../components/bible/components/menu-item';


    function  onClick(m: MenuItem | any): void {
        alert(m.name + " menu item was clicked")
    }

</script>

{#each menu as m}
<div on:click={() => onClick(m)}  class="main-menu-item p-3 d-flex flex-row align-items-center">
    <Icon class="main-menu-item-icon" data={m.icon} scale={2} ></Icon>
	<p class="p-0 ms-2 me-0 mb-0 mt-0 text-centr">{m.name}</p>    
</div>

{/each}


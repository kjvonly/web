<script lang="ts">
	import { menu } from './menu';
	import Icon from 'svelte-awesome';
	import { paneService } from '../services/pane.service';
	import type { MenuItem } from '../components/bible/components/menu-item';
	import { Buffer } from '../models/buffer.model';
	import Chapter from '../components/bible/chapter.svelte';
	import { currentBuffer } from '../services/current-buffer.service';
	import Memory from '../components/memory/memory.svelte';
	export let active: boolean;

	function onClick(m: any): void {
		let b = new Buffer();
		switch (m.name) {
			case 'bible':
				b.componentName = 'Chapter';
				b.component = Chapter;
				paneService.setBuffer(b);
				currentBuffer.set(b);
				paneService.saveRootPane();
				active = false;
				break
			case 'memory':
				b.componentName = 'Memory';
				b.component = Memory;
				paneService.setBuffer(b);
				currentBuffer.set(b);
				paneService.saveRootPane();
				active = false
				break
		}
	}
</script>

{#each menu as m}
	<div on:click={() => onClick(m)} class="main-menu-item p-3 d-flex flex-row align-items-center">
		<Icon class="main-menu-item-icon" data={m.icon} scale={2}></Icon>
		<p class="p-0 ms-2 me-0 mb-0 mt-0 text-centr">{m.name}</p>
	</div>
{/each}

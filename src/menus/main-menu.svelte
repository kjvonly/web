<script lang="ts">
	import { menu } from './menu';
	import Icon from 'svelte-awesome';
	import { paneService } from '../services/pane.service';
	import type { MenuItem } from '../components/bible/components/menu-item';
	import { Buffer } from '../models/buffer.model';
	import Chapter from '../components/bible/chapter.svelte';
	import { currentBuffer } from '../services/current-buffer.service';
	function onClick(m: any): void {
		switch (m.name) {
			case 'bible':
				let b = new Buffer();
				b.componentName = 'Chapter';
				b.component = Chapter;
				paneService.setBuffer(b);
				currentBuffer.set(b);
				paneService.saveRootPane();
		}
	}
</script>

{#each menu as m}
	<div on:click={() => onClick(m)} class="main-menu-item p-3 d-flex flex-row align-items-center">
		<Icon class="main-menu-item-icon" data={m.icon} scale={2}></Icon>
		<p class="p-0 ms-2 me-0 mb-0 mt-0 text-centr">{m.name}</p>
	</div>
{/each}

<script lang="ts">
	import { menu } from './menu';
	import Icon from 'svelte-awesome';
	import { paneService } from '../services/pane.service';
	import type { MenuItem } from '../components/bible/components/menu-item';
	import { Buffer } from '../models/buffer.model';
	import Chapter from '../components/bible/chapter.svelte';
	import { currentBuffer } from '../services/current-buffer.service';
	import Memory from '../components/memory/memory.svelte';

	function onClick(m: any): void {
		let b = new Buffer();
		switch (m.name) {
			case 'home':
				b.componentName = 'home';
				b.component = Chapter;
				paneService.setBuffer(b);
				currentBuffer.set(b);
				paneService.saveRootPane();
				break
			case 'bible':
				b.componentName = 'Chapter';
				b.component = Chapter;
				paneService.setBuffer(b);
				currentBuffer.set(b);
				paneService.saveRootPane();
				break
			case 'memory':
				b.componentName = 'Memory';
				b.component = Memory;
				paneService.setBuffer(b);
				currentBuffer.set(b);
				paneService.saveRootPane();
				break
		}
	}
</script>

<div class="d-flex flex-row justify-content-between w-100">
	{#each menu as m}
		<div
			on:click={() => onClick(m)}
			class="mobile-menu-item p-2 d-flex flex-column align-items-center"
		>
			<Icon class="mobile-menu-item-icon" data={m.icon} scale={2}></Icon>
			<p class="m-0 text-center">{m.name}</p>
		</div>
	{/each}
</div>

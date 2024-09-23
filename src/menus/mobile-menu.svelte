<script lang="ts">
	import { menu } from './menu';
	import Icon from 'svelte-awesome';
	import { paneService } from '../services/pane.service';
	import type { MenuItem } from '../components/bible/components/menu-item';
	import { Buffer, NullBuffer } from '../models/buffer.model';
	import Chapter from '../components/bible/chapter.svelte';
	import { currentBuffer } from '../services/current-buffer.service';
	import Memory from '../components/memory/memory.svelte';
	import { bufferService } from '../services/buffer.service';

	function onClick(m: any): void {
		let b = new Buffer();
		switch (m.name) {
			case 'home':
				let hb = bufferService.get('hb');
				if (hb instanceof NullBuffer) {
					b.name = 'home';
					b.componentName = 'home';
					b.component = Chapter;
				} else {
					b = hb
				}

				paneService.setBuffer(b);
				currentBuffer.set(b);
				paneService.saveRootPane();
				break;
			case 'bible':
				let cb = bufferService.get('chapter');
				if (cb instanceof NullBuffer) {
					b.name = 'chapter';
					b.componentName = 'Chapter';
					b.component = Chapter;
				} else {
					b = cb;
				}

				paneService.setBuffer(b);
				currentBuffer.set(b);
				paneService.saveRootPane();
				break;
			case 'memory':
				let mb = bufferService.get('memory');
				if (mb instanceof NullBuffer) {
					b.name = 'memory';
					b.componentName = 'Memory';
					b.component = Memory;
				} else {
					b = mb;
				}
				paneService.setBuffer(b);
				currentBuffer.set(b);
				paneService.saveRootPane();
				break;
		}
	}
</script>

<div class="d-flex flex-row justify-content-between w-100">
	{#each menu as m}
		<div
			on:click={() => onClick(m)}
			class="mobile-menu-item p-2 d-flex flex-column align-items-center"
		>
			<Icon class="mobile-menu-item-icon" data={m.icon}></Icon>
			<p class="m-0 text-center">{m.name}</p>
		</div>
	{/each}
</div>

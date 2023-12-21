import { NullBuffer } from '../models/buffer.model';
import type { Pane } from '../models/pane.model';
import Chapter from '../components/bible/chapter.svelte';
import Editor from '../components/editor/editor.svelte';
export class ComponentMapping {
	getCompoent(component: string) {
		switch (component) {
			case 'Chapter':
				return Chapter;
			case 'Editor':
				return Editor;
		}
	}

	map(p: Pane) {
		if (p.leftPane) {
			this.map(p.leftPane);
		}

		if (p.rightPane) {
			this.map(p.rightPane);
		}

		if (p.buffer.componentName !== 'NullBuffer') {
			p.buffer.component = this.getCompoent(p.buffer.componentName);
			p.buffer.onFocus = () => {};
			p.buffer.keyboardBindings = new Map<string, Function>();
		} else {
			p.buffer = new NullBuffer();
		}
	}
}

export let componentMapping = new ComponentMapping();

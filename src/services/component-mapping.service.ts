import { NullBuffer } from '../models/buffer.model';
import type { Pane } from '../models/pane.model';
import Chapter from '../components/bible/chapter.svelte';
import Memory from '../components/memory/memory.svelte';
import Editor from '../components/editor/editor.svelte';
import TestCard from '../components/card/test-card.svelte';

/**
 * Component Mapping is responsible for converting the
 * string value of the component class.
 *
 */
export class ComponentMapping {
	/**
	 *
	 * @param componentName string of class to be returned
	 * @returns component class
	 */
	getCompoent(componentName: string): Object | null {
		switch (componentName) {
			case 'Chapter':
				return Chapter;
			case 'Memory':
				return Memory;
			case 'Editor':
				return Editor;
			case 'TestCard':
				return TestCard;
		}

		return null;
	}

	/**
	 * recursively traverses the pane tree
	 * updating the buffers with proper
	 * typescript type
	 *
	 * @param p Pane to map the buffer
	 */
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

import { writable } from 'svelte/store';
import { NullPane, Pane, PaneJson } from '../models/pane.model';

let storeName: string = 'paneStore';

function toJson(pane: Pane, p2j: PaneJson) {
	if (pane.leftPane) {
		p2j.leftPane = new PaneJson();
		toJson(pane.leftPane, p2j.leftPane);
	}

	if (pane.rightPane) {
		p2j.rightPane = new PaneJson();
		toJson(pane.rightPane, p2j.rightPane);
	}

	p2j.id = pane.id;
	p2j.leftPercentage = pane.leftPercentage;
	p2j.rightPercentage = pane.rightPercentage;
	p2j.buffer = pane.buffer;
	p2j.parentNodeId = pane.parentNode?.id || '';
	p2j.split = pane.split;
}

function fromJson(p2j: PaneJson, pane: Pane) {
	if (p2j.leftPane !== null) {
		let lp = new Pane();

		lp.parentNode = pane;
		pane.leftPane = lp;
		fromJson(p2j.leftPane, pane.leftPane);
	}

	if (p2j.rightPane !== null) {
		let rp = new Pane();
		rp.parentNode = pane;
		pane.rightPane = rp;
		fromJson(p2j.rightPane, pane.rightPane);
	}

	pane.id = p2j.id;
	pane.leftPercentage = p2j.leftPercentage;
	pane.rightPercentage = p2j.rightPercentage;
	pane.buffer = p2j.buffer;
	pane.split = p2j.split;
}

const _paneStore = () => {
	const { set, update, subscribe } = writable<Pane>(new NullPane());

	return {
		subscribe,
		set: set,
		update: update,
		useLocalStorage: () => {
			subscribe((val) => {
				if (!(val instanceof NullPane)) {
					let p2j = new PaneJson();
					toJson(val, p2j);
					localStorage.setItem(storeName, JSON.stringify(p2j));
				}
			});

			let ps = localStorage.getItem(storeName);
			if (ps !== null) {
				let pane = new Pane();
				fromJson(JSON.parse(ps), pane);
				set(pane);
			} else {
				set(new Pane());
			}
		}
	};
};

export const paneStore = _paneStore();

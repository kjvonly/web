<!-- https://jsfiddle.net/w33z4bo0/1/ -->
<!-- https://stackoverflow.com/questions/4909167/how-to-add-a-custom-right-click-menu-to-a-webpage#4909312 -->
<script lang="ts">
	import { onMount } from 'svelte';
	import NestedMenu from './nested-menu.svelte';
	import type { MenuItem } from './menu-item';

	export let parentId: string;
	//export let menuData: any;

	onMount(() => {
		var chapter = document.getElementById(parentId + '-chapter') as HTMLElement;
		chapter.addEventListener(
			'contextmenu',
			function (event) {
				event.preventDefault();
				var ctxMenu = document.getElementById(parentId + '-ctxMenu') as HTMLElement;
				ctxMenu.style.display = 'block';
				ctxMenu.style.left = event.pageX - 10 + 'px';
				ctxMenu.style.top = event.pageY - 10 + 'px';
			},
			false
		);
		var ctxMenu = document.getElementById(parentId + '-ctxMenu') as HTMLElement;
		ctxMenu.addEventListener(
			'click',
			function (event) {
				ctxMenu.style.display = '';
				ctxMenu.style.left = '';
				ctxMenu.style.top = '';
			},
			false
		);
	});
	function handler(what: string) {
		alert(`${what} clicked`);
	}
	let menu: MenuItem = {
		title: 'root',
		handler: () => {},
		children: [
			{
				title: 'File',
				handler: () => {},
				children: [
					{ children: [], title: 'Save', handler: () => handler('Save') },
					{ children: [], title: 'Save As', handler: () => handler('Save As') },
					{ children: [], title: 'Open', handler: () => handler('Open') }
				]
			},
			{
				title: 'Edit',
				handler: () => {},
				children: [
					{ children: [], title: 'Cut', handler: () => handler('Cut') },
					{ children: [], title: 'Copy', handler: () => handler('Copy') },
					{ children: [], title: 'Paste', handler: () => handler('Paste') }
				]
			}
		]
	};
</script>

<menu id="{parentId}-ctxMenu" class="kjv-chapter-menu">
	<NestedMenu bind:item={menu}></NestedMenu>
</menu>

<style>
	.kjv-chapter-menu {
		display: none;
		z-index: 100;
	}

	menu {
		position: absolute;
		display: block;
		left: 0px;
		top: 0px;
		height: 20px;
		width: 20px;
		padding: 0;
		margin: 0;
		border: 1px solid;
		background-color: white;
		font-weight: normal;
		white-space: nowrap;
	}
	menu:hover {
		background-color: #eef;
		font-weight: bold;
	}
	menu:hover > menu {
		display: block;
	}
	menu > menu {
		display: none;
		position: relative;
		top: -20px;
		left: 100%;
		width: 55px;
	}
	menu[title]:before {
		content: attr(title);
	}
	menu:not([title]):before {
		content: '\2630';
	}
</style>

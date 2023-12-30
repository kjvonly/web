<!-- https://jsfiddle.net/w33z4bo0/1/ -->
<script lang="ts">
	import { onMount } from 'svelte';

	export let parentId: string;

	onMount(() => {
		var chapter = document.getElementById(parentId + '-chapter');
		chapter.addEventListener(
			'contextmenu',
			function (event) {
				event.preventDefault();
				var ctxMenu = document.getElementById(parentId + '-ctxMenu');
				ctxMenu.style.display = 'block';
				ctxMenu.style.left = event.pageX - 10 + 'px';
				ctxMenu.style.top = event.pageY - 10 + 'px';
			},
			false
		);
        var ctxMenu = document.getElementById(parentId + '-ctxMenu');
		ctxMenu.addEventListener(
			'mouseleave',
			function (event) {				
				ctxMenu.style.display = '';
				ctxMenu.style.left = '';
				ctxMenu.style.top = '';
			},
			false
		);
	});
    function handler() {
        alert('clicked save')
    }
</script>

<menu id="{parentId}-ctxMenu" class="kjv-chapter-menu">
	<menu title="File">
		<menu  role="none" on:click={handler} title="Save"></menu>
		<menu title="Save As"></menu>
		<menu title="Open"></menu>
	</menu>
	<menu title="Edit">
		<menu title="Cut"></menu>
		<menu title="Copy"></menu>
		<menu title="Paste"></menu>
	</menu>
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

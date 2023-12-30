<!-- https://jsfiddle.net/w33z4bo0/1/ -->
<script lang="ts">
	var notepad = document.getElementById('notepad');
	notepad.addEventListener(
		'contextmenu',
		function (event) {
			event.preventDefault();
			var ctxMenu = document.getElementById('ctxMenu');
			ctxMenu.style.display = 'block';
			ctxMenu.style.left = event.pageX - 10 + 'px';
			ctxMenu.style.top = event.pageY - 10 + 'px';
		},
		false
	);
	notepad.addEventListener(
		'click',
		function (event) {
			var ctxMenu = document.getElementById('ctxMenu');
			ctxMenu.style.display = '';
			ctxMenu.style.left = '';
			ctxMenu.style.top = '';
		},
		false
	);
</script>

<menu id="ctxMenu">
	<menu title="File">
		<menu title="Save"></menu>
		<menu title="Save As"></menu>
		<menu title="Open"></menu>
	</menu>
	<menu title="Edit">
		<menu title="Cut"></menu>
		<menu title="Copy"></menu>
		<menu title="Paste"></menu>
	</menu>
</menu>
<div id="notepad"></div>

<style>
	#ctxMenu {
		display: none;
		z-index: 100;
	}

    #notepad {
		position: absolute;
		left: 25%;
		top: 10%;
		width: 300px;
		height: 300px;
		background-color: red;
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

<script lang="ts">
	import { onMount } from 'svelte';
	import { keydownStore } from '../services/keydown.service';
	import Navbar from '../theme/layout/navbar.svelte';
	import MainMenu from '../menus/main-menu.svelte'

	let menu = MainMenu
	// Import our custom CSS
	import '../scss/styles.scss';

	onMount(async () => {
		await import('bootstrap');
		keydownStore.add();
	});
</script>

<div class="layout">
	<Navbar bind:sidebar={menu}></Navbar>
	<slot />
</div>

<style>
	.layout {
		overflow: hidden;
		height: 100vh;
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import { keydownStore } from '../services/keydown.service';
	import  Navbar from '../theme/layout/navbar.svelte';

	// Import our custom CSS
	import '../scss/styles.scss';

	onMount(async () => {
		await import('bootstrap');
		keydownStore.add();
	});
</script>

<div class="layout">
	<Navbar></Navbar>
	<slot />
</div>

<style>
	.layout {
		overflow: hidden;
		height: 100vh;
	}

</style>

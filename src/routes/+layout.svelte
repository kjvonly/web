<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-seafoam.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { AppShell, AppRail, AppRailAnchor, AppRailTile } from '@skeletonlabs/skeleton';

	import book from 'svelte-awesome/icons/book';
	import bars from 'svelte-awesome/icons/bars';
	import refresh from 'svelte-awesome/icons/refresh';
	import user from 'svelte-awesome/icons/user';

	import Icon from 'svelte-awesome';

	let currentTile: number = 0;
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="sidebarLeft">
		<!-- App Bar -->

		<AppRail>
			<svelte:fragment slot="lead">
				<AppRailAnchor href="/">
					<Icon data={bars} scale={3} />
				</AppRailAnchor>
			</svelte:fragment>
			<!-- --- -->
			<AppRailTile href="/read" bind:group={currentTile} name="tile-1" value={0} title="tile-1">
				<svelte:fragment slot="lead">
					<Icon data={book} scale={3} />
				</svelte:fragment>
				<span>Bible</span>
			</AppRailTile>
			<AppRailTile bind:group={currentTile} name="tile-2" value={1} title="tile-2">
				<svelte:fragment slot="lead" ><Icon data={refresh} scale={3} /></svelte:fragment>
				<span>Memory</span>
			</AppRailTile>
			<!-- --- -->
			<svelte:fragment slot="trail">
				<AppRailAnchor href="/" target="_blank" title="Account">
					<Icon data={user} scale={3} />
				</AppRailAnchor>
			</svelte:fragment>
		</AppRail>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>

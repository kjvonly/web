<script lang="ts">
	import Icon from 'svelte-awesome';
	import bars from 'svelte-awesome/icons/bars';

	import logo from '$lib/assets/cross.svg';
</script>

<div class="kjv-navbar w-100">
	<div class="row w-100">
		<div class="d-flex flex-row align-items-center justify-content-between w-100">
			<div class="d-flex flex-row align-items-center">
				<Icon data={bars} scale="2"></Icon>
				<div class="title"><span class="font-weight-bold">KJV</span>only</div>
			</div>
			<div>
				<img class="logo" alt="app logo - cross" src={logo} />
			</div>
			<div class="d-flex flex-row">
				<div id="user">
					<span> m4c </span>
				</div>

				<div class="d-flex align-items-center ms-1">man4christ</div>
			</div>
		</div>
	</div>
</div>

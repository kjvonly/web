<script lang="ts">
	import Icon from 'svelte-awesome';
	import bars from 'svelte-awesome/icons/bars';

	import logo from '$lib/assets/cross.svg';
</script>

<div class="kjvonly-navbar w-100">
	<div class="row w-100">
		<div class="d-flex flex-row align-items-center justify-content-between w-100">
			<div class="d-flex flex-row align-items-center">
				<Icon data={bars} scale="2"></Icon>
				<div class="title"><span class="font-weight-bold">KVJ</span>only</div>
			</div>
            <div>
                <img class="logo" alt="The project logo" src={logo} />
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

<style lang="scss">
	@import '../../scss/styles.scss';

	.kjvonly-navbar {
		height: 4.75rem;
		padding: 1.25rem;
		width: 100%;
		background-color: $base-blue;
		color: white;
		align-items: center;
		display: flex;
	}

	#user {
		width: 3rem;
		height: 3rem;
		max-width: 3rem;
		max-height: 3rem;

		-webkit-border-radius: 1.5rem;
		-moz-border-radius: 1.5rem;
		border-radius: 1.5rem;
		background: $base-red;
	}
	#user > span {
		justify-content: center;
		align-content: center;
		display: flex;
		height: 100%;
		width: 100%;
		flex-wrap: wrap;
	}

	.logo {
		fill: $base-red !important;
		height: 3rem;
		margin-left: 0.5rem;
		margin-right: 0.5rem;
	}

    .title {
        margin-left: 1rem;
        margin-right: 1rem;
        span {
        font-weight: bold;
        color: $base-red
        }
        font-size: 1.75rem;
    } 
</style>

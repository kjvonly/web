<script lang="ts">
	import Icon from 'svelte-awesome';
	import bars from 'svelte-awesome/icons/bars';
</script>

<div class="kjvonly-navbar w-100">
	<div class="row w-100">
		<div class="d-flex flex-row align-items-center justify-content-between w-100">
			<div class="d-flex flex-row align-items-center">
				<Icon data={bars} scale="2"></Icon>
                <span style="font-size: 1.75rem;"></span>
                <div class="title ms-1">KVJonly</div>
			</div>
            <div class="d-flex flex-row">
				<div id="user">
					<span> m4c </span>
                </div>

                <div class="d-flex align-items-center ms-1">
                    man4christ
                </div>
                
            </div>
		</div>
	</div>
</div>

<style lang="scss">
	.kjvonly-navbar {
        height: 4.75rem;
        padding: 1.25rem;
        width: 100%;
		background-color: #002868;
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
		background: #BF0A30;
	}
    #user > span {
		justify-content: center;
        align-content: center;
        display: flex;
        height: 100%;
        width: 100%;
        flex-wrap: wrap;
    }
</style>

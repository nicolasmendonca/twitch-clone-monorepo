<script lang="ts">
	import Recommended from './Recommended.svelte';
	import Toggle from './Toggle.svelte';
	import Wrapper from './Wrapper.svelte';
	import Following from './Following.svelte';
</script>

<Wrapper>
	<Toggle />
	<div class="space-y-4">
		<Following />
		<Recommended />
	</div>
</Wrapper>

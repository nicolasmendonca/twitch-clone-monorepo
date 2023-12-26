<script lang="ts">
	import type { PageData } from './$types';
	import { ToggleCard } from './components/toggle-card';

	export let data: PageData;
</script>

<div class="p-6">
	<div class="mb-4">
		<h1 class="text-2xl font-bold">Chat settings</h1>
	</div>
	<div class="space-y-4">
		<ToggleCard field="isChatEnabled" label="Enable chat" value={data.stream.isChatEnabled} />
		<ToggleCard field="isChatDelayed" label="Enable chat delay" value={data.stream.isChatDelayed} />
		<ToggleCard
			field="isChartFollowersOnly"
			label="Enable chat for followers only"
			value={data.stream.isChartFollowersOnly}
		/>
	</div>
</div>

<script lang="ts">
	import type { Stream } from '$lib/repository/types';
	import * as Switch from '$lib/components/ui/switch';
	import * as Label from '$lib/components/ui/label';
	import { enhance } from '$app/forms';
	import { route } from '$lib/ROUTES';
	import { page } from '$app/stores';

	export let field: keyof Pick<Stream, 'isChartFollowersOnly' | 'isChatDelayed' | 'isChatEnabled'>;
	export let label: string;
	export let value: boolean;

	$: elementId = `${field}-switch`;
	$: formSubmitUrl =
		route('/dashboard/u/[username]/chat', { username: $page.params.username }) +
		'?/changeChatValue';
</script>

<div class="flex items-center space-x-2">
	<Switch.Root
		id={elementId}
		checked={value}
		name={field}
		onCheckedChange={async (value) => {
			const formData = new FormData();
			formData.append('field', field);
			formData.append('value', value.toString());
			await window.fetch(formSubmitUrl, {
				method: 'POST',
				body: formData,
				headers: {
					'x-sveltekit-action': 'true'
				}
			});
		}}
	/>
	<Label.Root for={elementId}>{label}</Label.Root>
</div>

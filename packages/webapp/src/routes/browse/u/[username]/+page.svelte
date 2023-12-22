<script lang="ts">
	import toast from 'svelte-french-toast';
	import { enhance } from '$app/forms';
	import * as Button from '$lib/components/ui/button';
	import { Loader2 } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let loading = false;
	let isFollowingUser = data.isFollowingUser;
</script>

<div class="flex flex-col gap-y-4">
	{data.user?.id}
	{isFollowingUser}

	{#if data.user && data.user.id !== data.authUser?.id}
		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					loading = false;
					if (result.type === 'success') {
						// @ts-ignore-next-line
						isFollowingUser = result.data.result.isFollowingUser;
						await update();
						toast.success(`Successfully ${isFollowingUser ? 'followed' : 'unfollowed'}`);
					} else {
						await update();
					}
				};
			}}
		>
			<Button.Root
				disabled={loading}
				type="submit"
				formaction="?/{isFollowingUser ? 'unfollowUser' : 'followUser'}"
			>
				{#if loading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Loading
				{:else if isFollowingUser}Unfollow User{:else}Follow User{/if}
			</Button.Root>
		</form>
	{/if}
</div>

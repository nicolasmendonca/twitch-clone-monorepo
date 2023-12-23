<script lang="ts">
	import toast from 'svelte-french-toast';
	import { enhance } from '$app/forms';
	import * as Button from '$lib/components/ui/button';
	import { Loader2 } from 'lucide-svelte';
	import type { PageData } from './$types';
	import UserAvatar from '$lib/components/user-avatar/UserAvatar.svelte';

	export let data: PageData;
	$: isFollowingUser = data.isFollowingUser;
	$: isBlockingUser = data.isBlockingUser;
	$: isAuthenticated = data.authUser !== undefined;
	$: userIsNotSelf = data.authUser?.id !== data.user.id;
	$: canPerformActions = isAuthenticated && userIsNotSelf;

	let loading = false;
</script>

<div class="w-full h-64 bg-black relative mb-12">
	<div class="absolute left-12 bottom-0 translate-y-10">
		<UserAvatar imageUrl={data.user.imageUrl} size="xl" />
	</div>
</div>

<div class="flex flex-col gap-y-4 p-8">
	{data.user?.id}

	{#if canPerformActions}
		<form
			method="POST"
			use:enhance={({ action }) => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type === 'success') {
						switch (action.search) {
							case '?/followUser':
								toast.success(`Successfully followed ${data.user.username}!`);
								break;
							case '?/unfollowUser':
								toast.success(`Successfully unfollowed ${data.user.username}!`);
								break;
							case '?/blockUser':
								toast.success(`Successfully blocked ${data.user.username}!`);
								break;
							case '?/unblockUser':
								toast.success(`Successfully unblocked ${data.user.username}!`);
								break;
						}
					} else if (result.type === 'error') {
						toast.error(result.error.message || JSON.stringify(result.error));
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
			<Button.Root
				variant="destructive"
				disabled={loading}
				type="submit"
				formaction="?/{isBlockingUser ? 'unblockUser' : 'blockUser'}"
			>
				{#if loading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Loading
				{:else if isBlockingUser}Unblock User{:else}Block User{/if}
			</Button.Root>
		</form>
	{/if}
</div>

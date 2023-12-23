<script lang="ts">
	import { sidebarStore } from '$lib/stores/sidebar';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import * as Skeleton from '$lib/components/ui/skeleton';
	import * as Button from '$lib/components/ui/button';
	import { route } from '$lib/ROUTES';
	import { UserAvatar } from '$lib/components/user-avatar';
	import type { RepositoryService } from '$lib/repository/repository-service';
	import LiveBadge from '$lib/components/LiveBadge.svelte';

	$: followedUsersPromise = $page.data.followedUsers as ReturnType<
		RepositoryService['getRecommendedUsers']
	>;
</script>

<div>
	{#if $sidebarStore.expanded}
		{#await followedUsersPromise then channels}
			{#if channels.length > 0}
				<div class="pl-6 mb-4 hidden lg:block">
					<p class="text-sm text-muted-foreground">Following</p>
				</div>
			{/if}
		{/await}
	{/if}
	<ul class="space-y-2 px-2">
		{#await followedUsersPromise}
			<!-- <Skeleton> Component -->
			<div class="space-y-4 px-2">
				{#each Array(4) as i}
					<div class="flex gap-4">
						<Skeleton.Root class="bg-muted rounded-full h-10 w-10" />
						<Skeleton.Root class="bg-muted flex-grow" />
					</div>
				{/each}
			</div>
		{:then followedUsers}
			{#each followedUsers as user (user.id)}
				<!-- <UserItem> component -->
				{@const isActive = $page.params.username === user.username}
				{@const isLive = true}
				<li>
					<a
						href={route('/u/[username]', { username: user.username })}
						class={Button.buttonVariants({
							variant: 'ghost',
							className: cn('w-full h-12', {
								'justify-center rounded-full': !$sidebarStore.expanded,
								'justify-start': $sidebarStore.expanded,
								'bg-accent': isActive
							})
						})}
					>
						<div
							class={cn('flex items-center w-full gap-x-4', {
								'justify-center': !$sidebarStore.expanded
							})}
						>
							<UserAvatar imageUrl={user.imageUrl} {isLive} />
							{#if $sidebarStore.expanded}
								<p class="truncate">{user.username}</p>
								{#if isLive}
									<LiveBadge class="ml-auto" />
								{/if}
							{/if}
						</div>
					</a>
				</li>
			{/each}
		{/await}
	</ul>
</div>

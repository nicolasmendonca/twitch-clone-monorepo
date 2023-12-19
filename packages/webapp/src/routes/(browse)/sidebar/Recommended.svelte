<script lang="ts">
	import { sidebarStore } from '$lib/stores/sidebar';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import * as Skeleton from '$lib/components/ui/skeleton';
	import * as Button from '$lib/components/ui/button';
	import { route } from '$lib/ROUTES';
	import { UserAvatar } from '$lib/components/user-avatar';
	import LiveBadge from '$lib/components/LiveBadge.svelte';
	import type { LayoutData } from '../$types';

	export let data: LayoutData;
</script>

<div>
	{#if $sidebarStore.expanded}
		{#await data.recommendedChannels then channels}
			{#if channels.length > 0}
				<div class="pl-6 mb-4 hidden lg:block">
					<p class="text-sm text-muted-foreground">Recommended</p>
				</div>
			{/if}
		{/await}
	{/if}
	<ul class="space-y-2 px-2">
		{#await data.recommendedChannels}
			<!-- <Skeleton> Component -->
			<div class="space-y-4 px-2">
				{#each Array(4) as i}
					<div class="flex gap-4">
						<Skeleton.Root class="bg-muted rounded-full h-10 w-10" />
						<Skeleton.Root class="bg-muted flex-grow" />
					</div>
				{/each}
			</div>
		{:then recommendedChannels}
			{#each recommendedChannels as channel (channel.id)}
				<!-- <UserItem> component -->
				{@const isActive = $page.params.username === channel.username}
				{@const isLive = true}
				<li>
					<a
						href={route('/u/[username]', { username: channel.username })}
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
							<UserAvatar imageUrl={channel.imageUrl} {isLive} />
							{#if $sidebarStore.expanded}
								<p class="truncate">{channel.username}</p>
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

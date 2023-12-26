<script lang="ts">
	import { Fullscreen, KeyRound, MessageSquare, Users } from 'lucide-svelte';
	import { route } from '$lib/ROUTES';
	import { page } from '$app/stores';
	import * as Button from '$lib/components/ui/button';
	import { creatorSidebarStore } from '$lib/stores/creatorSidebar';
	import { cn } from '$lib/utils';
	import type { User } from '$lib/repository/types';
	import { fade } from 'svelte/transition';

	$: authUser = $page.data.authUser as User;
	$: routeParams = { username: authUser.username };
	$: routes = [
		{
			label: 'Stream',
			href: route(`/dashboard/u/[username]`, routeParams),
			icon: Fullscreen
		},
		{
			label: 'Keys',
			href: route(`/dashboard/u/[username]/keys`, routeParams),
			icon: KeyRound
		},
		{
			label: 'Chat',
			href: route(`/dashboard/u/[username]/chat`, routeParams),
			icon: MessageSquare
		},
		{
			label: 'Community',
			href: route(`/dashboard/u/[username]/community`, routeParams),
			icon: Users
		}
	] as const;

	page.subscribe((_page) => {
		console.log('🚀 ~ file: Navigation.svelte:38 ~ _page.url.pathname:', _page.url.pathname);
	});
</script>

<ul class="space-y-2 pt-4 lg:pt-0">
	{#each routes as route}
		{@const isActiveRoute = $page.url.pathname === route.href}
		<li>
			<a
				class={Button.buttonVariants({
					variant: 'ghost',
					className: cn('w-full h-12 cursor-pointer items-center', {
						'justify-start': $creatorSidebarStore.expanded,
						'justify-center': !$creatorSidebarStore.expanded,
						'bg-accent': isActiveRoute
					})
				})}
				href={route.href}
			>
				<svelte:component
					this={route.icon}
					class={cn({
						'w-6 h-6 mr-4': $creatorSidebarStore.expanded,
						'w-6 h-6': !$creatorSidebarStore.expanded
					})}
				/>
				{#if $creatorSidebarStore.expanded}
					<div>
						{route.label}
					</div>
				{/if}
			</a>
		</li>
	{/each}
</ul>

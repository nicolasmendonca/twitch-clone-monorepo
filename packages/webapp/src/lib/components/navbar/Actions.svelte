<script lang="ts">
	import * as Button from '$lib/components/ui/button';
	import { Clapperboard } from 'lucide-svelte';
	import { route } from '$lib/ROUTES';
	import type { User } from '$lib/repository/types';
	import { page } from '$app/stores';

	$: authUser = $page.data.authUser as User;
</script>

{#await import('clerk-sveltekit/client/SignedOut.svelte') then SignedOut}
	<SignedOut.default>
		{#await import('clerk-sveltekit/client/SignInButton.svelte') then SignInButton}
			<SignInButton.default class={Button.buttonVariants({ variant: 'primary', size: 'sm' })}>
				Login
			</SignInButton.default>
		{/await}
	</SignedOut.default>
{/await}

{#await import('clerk-sveltekit/client/SignedIn.svelte') then SignedIn}
	<SignedIn.default let:user>
		<div class="flex items-center justify-center gap-x-2 ml-4 lg:ml-0">
			<Button.Root
				href={`/dashboard/u/${authUser?.username}`}
				class="flex items-center justify-center gap-2 text-muted-foreground group"
				variant="ghost"
			>
				<div>
					<Clapperboard
						class="h-5 w-5 text-muted-foreground stroke-muted-foreground group-hover:stroke-white transition-all"
					/>
				</div>
				<div class="hidden lg:block">Dashboard</div>
			</Button.Root>
			{#await import('clerk-sveltekit/client/UserButton.svelte') then UserButton}
				<UserButton.default afterSignOutUrl={route('/login')} />
			{/await}
		</div>
	</SignedIn.default>
{/await}

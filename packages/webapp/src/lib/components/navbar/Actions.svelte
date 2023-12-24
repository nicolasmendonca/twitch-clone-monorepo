<script lang="ts">
	import * as Button from '$lib/components/ui/button';
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';
	import SignInButton from 'clerk-sveltekit/client/SignInButton.svelte';
	import SignedOut from 'clerk-sveltekit/client/SignedOut.svelte';
	import UserButton from 'clerk-sveltekit/client/UserButton.svelte';
	import { Clapperboard } from 'lucide-svelte';
	import { route } from '$lib/ROUTES';
	import { page } from '$app/stores';
	import type { User } from '$lib/repository/types';

	$: authUser = $page.data.authUser as User;
</script>

<SignedOut>
	<SignInButton class={Button.buttonVariants({ variant: 'primary', size: 'sm' })}>
		Login
	</SignInButton>
</SignedOut>
<SignedIn let:user>
	<div class="flex items-center justify-center gap-x-2 ml-4 lg:ml-0">
		{#if authUser}
			<Button.Root
				href={route('/dashboard/u/[username]', {
					username: authUser.username
				})}
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
		{/if}
		<UserButton afterSignOutUrl={route('/login')} />
	</div>
</SignedIn>

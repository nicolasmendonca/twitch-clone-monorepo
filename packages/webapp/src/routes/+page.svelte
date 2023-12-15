<script lang="ts">
	import '../app.pcss';
	import UserButton from 'clerk-sveltekit/client/UserButton.svelte';
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';
	import SignedOut from 'clerk-sveltekit/client/SignedOut.svelte';
	import { route } from '../lib/ROUTES';
</script>

<div class="flex flex-col gap-y-4">
	<h1>Dashboard</h1>
	<SignedIn>
		<UserButton afterSignOutUrl="/" />
	</SignedIn>
	<SignedOut>
		<div class="flex gap-2">
			<a class="underline text-blue-500" href={route('/login')}>Sign in</a>
			<span>|</span>
			<a class="underline text-blue-500" href={route('/register')}>Sign up</a>
		</div>
	</SignedOut>
</div>

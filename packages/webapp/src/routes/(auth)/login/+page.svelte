<script lang="ts">
	import { dark } from '@clerk/themes';
	import { route } from '$lib/ROUTES';
	import { goto } from '$app/navigation';
</script>

<div class="flex flex-col gap-8 items-center min-h-screen py-24 bg-background">
	<img src="/spooky.svg" alt="" class="w-48 h-48 bg-white rounded-full fill-black" />
	{#await import('clerk-sveltekit/client/SignIn.svelte') then SignIn}
		<SignIn.default
			redirectUrl={route('/')}
			appearance={{
				baseTheme: dark
			}}
		/>
	{/await}
</div>

{#await import('clerk-sveltekit/client/SignedIn.svelte') then SignedIn}
	<SignedIn.default>
		{goto(route('/'))}
	</SignedIn.default>
{/await}

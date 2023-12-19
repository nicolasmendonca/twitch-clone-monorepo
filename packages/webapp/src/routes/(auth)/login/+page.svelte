<script lang="ts">
	import { dark } from '@clerk/themes';
	import SignIn from 'clerk-sveltekit/client/SignIn.svelte';
	import { route } from '$lib/ROUTES';
</script>

<div class="flex flex-col gap-8 items-center min-h-screen py-24 bg-background">
	<img src="/spooky.svg" alt="" class="w-48 h-48 bg-white rounded-full fill-black" />
	<SignIn
		redirectUrl={route('/')}
		appearance={{
			baseTheme: dark
		}}
	/>
</div>

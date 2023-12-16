<script lang="ts">
	import { dark } from '@clerk/themes';
	import SignIn from 'clerk-sveltekit/client/SignIn.svelte';
	import Spooky from '$lib/components/spooky.svelte';
</script>

<div class="flex flex-col gap-8 items-center h-screen pt-24">
	<Spooky fill="white" class="w-48 h-48" />
	<SignIn
		redirectUrl="/"
		appearance={{
			baseTheme: dark
		}}
	/>
</div>

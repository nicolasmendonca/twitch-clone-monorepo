<script lang="ts">
	import { dark } from '@clerk/themes';
	import SignUp from 'clerk-sveltekit/client/SignUp.svelte';
	import Spooky from '$lib/components/spooky.svelte';
</script>

<div class="flex flex-col gap-8 items-center h-screen pt-24">
	<Spooky fill="white" class="w-48 h-48" />
	<SignUp
		redirectUrl="/"
		appearance={{
			baseTheme: dark
		}}
	/>
</div>

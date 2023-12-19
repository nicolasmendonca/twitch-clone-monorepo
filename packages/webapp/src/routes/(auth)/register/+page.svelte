<script lang="ts">
	import { dark } from '@clerk/themes';
	import SignUp from 'clerk-sveltekit/client/SignUp.svelte';
	import { route } from '$lib/ROUTES';
</script>

<div class="flex flex-col gap-8 items-center h-screen pt-24">
	<img src="/spooky.svg" alt="" class="w-48 h-48 bg-white rounded-full fill-black" />
	<SignUp
		redirectUrl={route('/browse')}
		appearance={{
			baseTheme: dark
		}}
	/>
</div>

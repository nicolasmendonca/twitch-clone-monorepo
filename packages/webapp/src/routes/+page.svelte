<script lang="ts">
	import '../app.pcss';
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';
	import UserButton from 'clerk-sveltekit/client/UserButton.svelte';
	import Spooky from '$lib/components/spooky.svelte';
</script>

<div class="flex flex-col gap-8 items-center h-screen pt-24">
	<Spooky fill="white" class="w-48 h-48" />
	<SignedIn>
		<UserButton afterSignOutUrl="/login" />
	</SignedIn>
</div>

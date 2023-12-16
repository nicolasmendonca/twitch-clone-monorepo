<script lang="ts">
	import '../../../app.pcss';
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';
	import UserButton from 'clerk-sveltekit/client/UserButton.svelte';
</script>

<div class="flex flex-col gap-8 items-center h-screen pt-24">
	<SignedIn>
		<UserButton afterSignOutUrl="/login" />
	</SignedIn>
	<p>Dashboard</p>
</div>

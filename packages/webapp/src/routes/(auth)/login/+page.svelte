<script lang="ts">
	import SignIn from 'clerk-sveltekit/client/SignIn.svelte';
</script>

<div class="flex items-center justify-center h-screen bg-neutral-100">
	<SignIn redirectUrl="/admin" />
</div>

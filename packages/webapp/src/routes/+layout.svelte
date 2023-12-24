<script lang="ts">
	import '../app.pcss';
	import { Toaster } from 'svelte-french-toast';
	import { cn } from '$lib/utils';
	import { invalidateAll } from '$app/navigation';
	import ClerkLoading from 'clerk-sveltekit/client/ClerkLoading.svelte';
	import ClerkLoaded from 'clerk-sveltekit/client/ClerkLoaded.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		const eventName = 'clerk-sveltekit:user' as const;
		const callback = () => {
			console.log('ℹ️ received clerk session - calling `invalidateAll`');
			invalidateAll();
		};
		document.addEventListener(eventName, callback);

		return () => {
			document.removeEventListener(eventName, callback);
		};
	});
</script>

<ClerkLoading>
	<div class="w-screen h-screen flex flex-col items-center justify-center">
		<img src="/spooky.svg" alt="" class="w-48 h-48 bg-white rounded-full animate-pulse" />
	</div>
</ClerkLoading>
<ClerkLoaded let:clerk>
	<slot />
</ClerkLoaded>

<Toaster
	toastOptions={{
		className: cn('bg-background text-foreground'),
		position: 'bottom-center'
	}}
/>

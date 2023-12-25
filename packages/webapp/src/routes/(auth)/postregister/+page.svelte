<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { route } from '$lib/ROUTES';

	const redirect = () => {
		goto(route('/'), {
			invalidateAll: true
		});
	};
	onMount(() => {
		const eventName = 'clerk-sveltekit:user' as const;

		const callback = () => {
			goto(route('/'), {
				invalidateAll: true
			});
		};
		document.addEventListener(eventName, redirect);

		const interval = setInterval(() => {
			if (window.Clerk?.user) {
				redirect();
			}
		}, 100);

		return () => {
			document.removeEventListener(eventName, callback);
			clearInterval(interval);
		};
	});
</script>

<div
	class="flex flex-col gap-8 items-center justify-center min-h-screen bg-background animate-pulse"
>
	<img src="/spooky.svg" alt="" class="w-48 h-48 bg-white rounded-full fill-black" />
	<p class="text-muted-foreground text-xl font-light">Setting up your account...</p>
</div>

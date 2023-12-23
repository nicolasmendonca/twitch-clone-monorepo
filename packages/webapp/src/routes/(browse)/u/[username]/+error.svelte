<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import * as Button from '$lib/components/ui/button';
</script>

<div class="h-full w-full flex flex-col items-center justify-center gap-4">
	{#if $page.status}
		<p class="text-4xl font-extrabold">{$page.status}</p>
	{/if}
	<h1 class="text-3xl font-light">🤷‍♂️ {$page.error?.message}</h1>

	<Button.Root
		on:click={() => {
			goto($page.url);
		}}>Reload Site</Button.Root
	>
</div>

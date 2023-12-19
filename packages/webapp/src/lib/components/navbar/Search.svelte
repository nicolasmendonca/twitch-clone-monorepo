<script lang="ts">
	import { Search as SearchIcon } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
</script>

<form
	class="relative w-full md:w-[400px] flex items-center bg-background rounded-md border border-background focus-within:border"
	method="GET"
	action="/search"
	on:submit|preventDefault={async (event) => {
		const formData = new FormData(event.currentTarget);
		const query = formData.get('query')?.toString() ?? '';
		const searchParams = new URLSearchParams([['query', query]]);
		event.currentTarget.reset();
		await goto(`/search?${searchParams.toString()}`, {
			invalidateAll: true
		});
	}}
>
	<Input type="search" placeholder="Search" name="query" class="rounded-r-none" />
	<Button size="sm" variant="secondary" class="rounded-l-none" type="submit">
		<SearchIcon color="#A3A3A3" class="h-5 w-5 text-muted-foreground" />
	</Button>
</form>

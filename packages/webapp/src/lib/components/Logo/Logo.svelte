<script>
	import Spooky from '$lib/components/spooky.svelte';
</script>

<a href="/" class="group transition-all">
	<div class="flex gap-4">
		<div class="hidden lg:flex items-center gap-x-4 transition">
			<Spooky
				fill="black"
				class="w-12 h-12 bg-white rounded-full group-hover:bg-purple-100 transition-all"
			/>
		</div>
		<div class="group-hover:text-purple-100">
			<p class="text-lg font-semibold">Gamehub</p>
			<p class="text-xs text-muted-foreground">{"Let's play"}</p>
		</div>
	</div>
</a>

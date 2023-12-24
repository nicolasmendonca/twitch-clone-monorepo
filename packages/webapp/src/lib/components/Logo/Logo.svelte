<script lang="ts">
	import { route } from '$lib/ROUTES';
	export let label: string;
</script>

<a href={route('/')} class="group transition-all">
	<div class="flex gap-4">
		<div class="hidden md:block items-center gap-x-4 transition">
			<img src="/spooky.svg" class="w-10 h-10 bg-white rounded-full" alt="" />
		</div>
		<div class="group-hover:text-purple-100">
			<p class="text-lg font-semibold">Gamehub</p>
			<p class="text-xs text-muted-foreground">{label}</p>
		</div>
	</div>
</a>

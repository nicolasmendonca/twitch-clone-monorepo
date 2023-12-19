<script lang="ts">
	import { browser } from '$app/environment';
	import { sidebarStore } from '$lib/stores/sidebar';
	import { cn } from '$lib/utils';
</script>

<aside
	class={cn(
		'fixed top-20 left-0 flex flex-col h-full bg-background border-r border-[#2D2E35] z-50 overflow-x-hidden transition-all',
		{
			'w-[70px] lg:w-60': !browser,
			'lg:w-60': $sidebarStore.expanded,
			'w-[70px]': !$sidebarStore.expanded
		}
	)}
>
	<slot />
</aside>

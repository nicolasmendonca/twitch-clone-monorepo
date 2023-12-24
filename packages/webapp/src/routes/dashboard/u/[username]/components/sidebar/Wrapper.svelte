<script lang="ts">
	import { cn } from '$lib/utils';
	import { creatorSidebarStore } from '$lib/stores/creatorSidebar';
	import { browser } from '$app/environment';
</script>

<aside
	class={cn(
		'fixed top-20 left-0 flex flex-col h-full bg-[#2a2d39] border-r border-[#2D2E35] z-50 overflow-x-hidden transition-all',
		{
			'w-[70px] lg:w-60': !browser,
			'lg:w-60': $creatorSidebarStore.expanded,
			'w-[70px]': !$creatorSidebarStore.expanded
		}
	)}
>
	<slot />
</aside>

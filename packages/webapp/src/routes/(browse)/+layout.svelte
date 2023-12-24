<script lang="ts">
	import { screens } from 'tailwindcss/defaultTheme';
	import { Navbar } from '$lib/components/navbar';
	import { automaticallyChangeSidebar, sidebarStore } from '$lib/stores/sidebar';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { Sidebar } from './sidebar';

	onMount(() => {
		const minWidth = Number(screens.lg.replace('px', ''));
		const resizeObserver = new ResizeObserver(() => {
			automaticallyChangeSidebar(window.innerWidth >= minWidth);
		});

		automaticallyChangeSidebar(window.innerWidth >= minWidth);

		resizeObserver.observe(document.body);
		return () => resizeObserver.disconnect();
	});
</script>

<div class="h-full">
	<Navbar />
	<div class="flex h-full">
		<Sidebar />
		<div
			class={cn('w-full mt-20', {
				'ml-[70px] lg:ml-60': !browser,
				'lg:ml-60': $sidebarStore.expanded,
				'ml-[70px]': !$sidebarStore.expanded
			})}
		>
			<slot />
		</div>
	</div>
</div>

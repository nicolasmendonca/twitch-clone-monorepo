<script lang="ts">
	import { screens } from 'tailwindcss/defaultTheme';
	import { automaticallyChangeSidebar, creatorSidebarStore } from '$lib/stores/creatorSidebar';
	import { onMount } from 'svelte';
	import { Navbar } from './components/navbar';
	import { Sidebar } from './components/sidebar';
	import { browser } from '$app/environment';
	import { cn } from '$lib/utils';

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

<Navbar />
<div class="flex h-full pt-20">
	<Sidebar />
	<div
		class={cn('w-full mt-20', {
			'ml-[70px] lg:ml-60': !browser,
			'lg:ml-60': $creatorSidebarStore.expanded,
			'ml-[70px]': !$creatorSidebarStore.expanded
		})}
	>
		<slot />
	</div>
</div>

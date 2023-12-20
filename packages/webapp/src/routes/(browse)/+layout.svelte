<script lang="ts">
	import { screens } from 'tailwindcss/defaultTheme';
	import { Navbar } from '$lib/components/navbar';
	import { automaticallyChangeSidebar, sidebarStore } from '$lib/stores/sidebar';
	import Recommended from './sidebar/Recommended.svelte';
	import Toggle from './sidebar/Toggle.svelte';
	import Wrapper from './sidebar/Wrapper.svelte';
	import { cn } from '$lib/utils';
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

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
		<Wrapper>
			<Toggle />
			<div class="space-y-4">
				<Recommended />
			</div>
		</Wrapper>
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

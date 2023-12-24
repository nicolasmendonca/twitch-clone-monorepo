<script lang="ts">
	import * as Button from '$lib/components/ui/button';
	import { creatorSidebarStore, manuallyChangeSidebar } from '$lib/stores/creatorSidebar';
	import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { tick } from 'svelte';

	let button: HTMLButtonElement;
</script>

{#if $creatorSidebarStore.expanded}
	{@const label = 'Collapse'}
	<div class="p-3 pl-6 mb-2 flex items-center w-full">
		<Tooltip.Root openDelay={0}>
			<Tooltip.Trigger asChild>
				<p class="font-semibold text-primary hidden lg:block">Creator</p>
				<button
					bind:this={button}
					on:click={async () => {
						manuallyChangeSidebar(false);
						await tick();
						button.focus();
					}}
					class={Button.buttonVariants({ variant: 'ghost', className: 'h-auto p-2 ml-auto' })}
				>
					<ArrowLeftFromLine class="h-4 w-4" />
				</button>
			</Tooltip.Trigger>
			<Tooltip.Content side="bottom" class="bg-white text-black">
				<p>{label}</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
{:else}
	{@const label = 'Expand'}
	<div class="hidden lg:flex w-full items-center justify-center pt-4 mb-4">
		<Tooltip.Root openDelay={0}>
			<Tooltip.Trigger asChild>
				<button
					bind:this={button}
					on:click={async () => {
						manuallyChangeSidebar(true);
						await tick();
						button.focus();
					}}
					class={Button.buttonVariants({ variant: 'ghost', className: 'h-auto p-2' })}
				>
					<ArrowRightFromLine class="h-4 w-4" />
				</button>
				<Tooltip.Content side="bottom" class="bg-white text-black">
					<p>{label}</p>
				</Tooltip.Content>
			</Tooltip.Trigger>
		</Tooltip.Root>
	</div>
{/if}

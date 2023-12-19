<script lang="ts">
	import { tv, type VariantProps } from 'tailwind-variants';
	import { cn } from '$lib/utils';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Skeleton from '$lib/components/ui/skeleton';
	import type { User } from '$lib/repository/types';
	import LiveBadge from '../LiveBadge.svelte';

	const defaultSize = 'default';
	const avatarVariants = tv({
		variants: {
			size: {
				default: 'h-8 w-8',
				lg: 'h-14 w-14',
				xl: 'h-20 w-20'
			}
		},
		defaultVariants: {
			size: defaultSize
		}
	});

	type Size = VariantProps<typeof avatarVariants>['size'];

	export let imageUrl: User['imageUrl'];
	export let size: Size = defaultSize;
	export let isLive: boolean = false;
	export let showBadge: boolean = false;
	export let className: string = '';

	$: canShowBadge = showBadge && isLive;
</script>

<div class="relative">
	<Avatar.Root
		class={avatarVariants({
			size,
			className: cn(
				{
					'ring-2 ring-rose-500 border border-background': isLive
				},
				className
			)
		})}
	>
		<Avatar.Image src={imageUrl} alt="" class="object-cover" />
		<Avatar.Fallback>
			<Skeleton.Root
				class={avatarVariants({ size, className: 'rounded-full bg-muted-foreground' })}
			/>
		</Avatar.Fallback>
	</Avatar.Root>

	{#if canShowBadge}
		<div class="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
			<LiveBadge />
		</div>
	{/if}
</div>

<script lang="ts">
	import { cn } from '../utils';

	let className: string = '';
	export { className as class };
</script>

<div
	class={cn(
		'bg-rose-500 text-center p-0.5 px-1.5 rounded-md uppercase text-[10px] border border-background font-semibold tracking-wide',
		className
	)}
>
	live
</div>

<script>
	import { route } from '$lib/ROUTES';
	import { LogOut } from 'lucide-svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import UserButton from 'clerk-sveltekit/client/UserButton.svelte';
</script>

<div class="flex items-center justify-end gap-x-2">
	<a
		class={buttonVariants({
			size: 'sm',
			variant: 'ghost',
			className: 'text-muted-foreground hover:text-primary space-x-2'
		})}
		href={route('/')}
	>
		<LogOut class="w-5 h-5" />
		<div>Exit</div>
	</a>
	<UserButton />
</div>

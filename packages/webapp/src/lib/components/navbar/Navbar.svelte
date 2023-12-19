<script>
	import Logo from '$lib/components/Logo/Logo.svelte';
	import Search from '$lib/components/navbar/Search.svelte';
	import Actions from '$lib/components/navbar/Actions.svelte';
</script>

<nav
	class="fixed top-0 w-full h-20 z-[49] bg-[#252731] px-2 lg:px-4 flex justify-between items-center shadow-sm"
>
	<Logo />
	<Search />
	<Actions />
</nav>

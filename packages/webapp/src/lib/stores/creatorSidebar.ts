import { writable } from 'svelte/store';

export const creatorSidebarStore = writable({
	expanded: false,
	manuallyChanged: false
});

export const manuallyChangeSidebar = (expanded: boolean) => {
	creatorSidebarStore.update((state) => {
		state.expanded = expanded;
		state.manuallyChanged = true;
		return state;
	});
};

export const automaticallyChangeSidebar = (expanded: boolean) => {
	creatorSidebarStore.update((state) => {
		if (state.manuallyChanged) return state;
		state.expanded = expanded;
		return state;
	});
};

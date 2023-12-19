import { writable } from 'svelte/store';

export const sidebarStore = writable({
	expanded: true,
	manuallyChanged: false
});

export const manuallyChangeSidebar = (expanded: boolean) => {
	sidebarStore.update((state) => {
		state.expanded = expanded;
		state.manuallyChanged = true;
		return state;
	});
};

export const automaticallyChangeSidebar = (expanded: boolean) => {
	sidebarStore.update((state) => {
		if (state.manuallyChanged) return state;
		state.expanded = expanded;
		return state;
	});
};

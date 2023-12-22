import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { route } from '../lib/ROUTES';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.session?.userId && url.pathname !== '/login') {
		return redirect(302, route('/login'));
	} else if (locals.session?.userId && url.pathname === '/') {
		return redirect(302, route('/browse'));
	}
};

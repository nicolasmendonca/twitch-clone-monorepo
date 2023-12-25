import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	if (params.username !== locals.authUser?.username) {
		throw error(403, {
			message: 'Forbidden'
		});
	}

	return {
		authUser: locals.authUser
	};
};

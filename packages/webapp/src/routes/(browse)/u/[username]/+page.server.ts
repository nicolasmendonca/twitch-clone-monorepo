import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { UserAlreadyFollowedError } from '$lib/repository/errors';

export const load: PageServerLoad = async ({ locals, params }) => {
	const [user, isFollowingUser] = await Promise.all([
		locals.repository.getUserByUsername(params.username),
		locals.repository.isFollowingUser(params.username)
	]);

	if (!user) {
		throw error(404, {
			message: 'User not found'
		});
	}

	return {
		user,
		isFollowingUser
	};
};

export const actions: Actions = {
	followUser: async ({ params, locals }) => {
		try {
			await locals.repository.followUser(params.username);
			return {
				result: {
					isFollowingUser: true
				}
			};
		} catch (e) {
			if (e instanceof UserAlreadyFollowedError) {
				throw error(400, {
					message: e.message
				});
			} else if (e instanceof Error) {
				throw error(500, {
					message: e.message
				});
			}
		}
	},
	unfollowUser: async ({ params, locals }) => {
		try {
			await locals.repository.unfollowUser(params.username);
			return {
				result: {
					isFollowingUser: false
				}
			};
		} catch (e) {
			if (e instanceof UserAlreadyFollowedError) {
				throw error(400, {
					message: e.message
				});
			} else if (e instanceof Error) {
				throw error(500, {
					message: e.message
				});
			}
		}
	}
};

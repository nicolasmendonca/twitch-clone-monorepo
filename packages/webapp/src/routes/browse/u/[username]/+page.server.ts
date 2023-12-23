import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { UserAlreadyFollowedError } from '$lib/repository/errors';

export const load: PageServerLoad = async ({ locals, params }) => {
	const user = await locals.repository.getUserByUsername(params.username);

	if (!user) {
		throw error(404, {
			message: 'User not found'
		});
	}

	if (!locals.authUser) {
		return {
			user,
			isFollowingUser: false,
			isBlockingUser: false
		};
	}

	const [isFollowingUser, isBlockingUser] = await Promise.all([
		locals.repository.isFollowingUser(params.username),
		locals.repository.isBlockingUser(params.username)
	]);

	return {
		user,
		isFollowingUser,
		isBlockingUser
	};
};

export const actions: Actions = {
	followUser: async ({ params, locals }) => {
		try {
			await locals.repository.followUser(params.username);
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
	blockUser: async ({ params, locals }) => {
		try {
			await locals.repository.blockUser(params.username);
		} catch (e) {
			if (e instanceof Error) {
				throw error(500, {
					message: e.message
				});
			}
		}
	},
	unblockUser: async ({ params, locals }) => {
		try {
			await locals.repository.unblockUser(params.username);
		} catch (e) {
			if (e instanceof Error) {
				throw error(500, {
					message: e.message
				});
			}
		}
	}
};

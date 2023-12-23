import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		authUser: locals.authUser,
		followedUsers: locals.repository.getFollowedUsers(),
		recommendedChannels: locals.repository.getRecommendedUsers()
	};
};

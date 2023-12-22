import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	console.log(
		'🚀 ~ file: +layout.server.ts:7 ~ constload:LayoutServerLoad= ~ locals.session?.userId:',
		locals.session?.userId
	);

	const recommendedChannels = locals.session?.userId
		? locals.repository.getRecommendedUsers()
		: Promise.resolve([]);

	const followedUsers = locals.session?.userId
		? locals.repository.getFollowedUsers()
		: Promise.resolve([]);

	const authUserPromise = locals.session?.userId
		? locals.repository.getAuthUser()
		: Promise.resolve(undefined);

	return {
		authUser: await authUserPromise,
		followedUsers,
		recommendedChannels
	};
};
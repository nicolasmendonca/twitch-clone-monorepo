import { error } from '@sveltejs/kit';
import { prismaRepository } from '$lib/repository/prisma-repository';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.session?.userId) {
		throw error(401, 'Unauthorized');
	}

	const recommendedChannels = locals.session?.userId
		? prismaRepository.getRecommendedChannels(locals.session.userId)
		: Promise.resolve([]);

	return {
		recommendedChannels
	};
};

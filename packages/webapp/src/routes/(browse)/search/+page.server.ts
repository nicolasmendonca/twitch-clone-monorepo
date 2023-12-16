import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request }) => {
	const searchParams = new URL(request.url).searchParams;
	const query = searchParams.get('query') ?? '';
	return { query };
};

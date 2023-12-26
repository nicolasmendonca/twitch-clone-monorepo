import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const stream = await locals.repository.getStreamByUsername(params.username);

	return {
		stream
	};
};

export const actions: Actions = {
	changeChatValue: async ({ params, locals, request }) => {
		console.log({ params, locals, request });
		const json = await request.json();
		console.log({ json });

		return {};
	}
};

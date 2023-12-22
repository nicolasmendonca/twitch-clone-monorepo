import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleClerk } from 'clerk-sveltekit/server';
import { CLERK_SECRET_KEY } from '$env/static/private';
import { env } from '$env/dynamic/private';
import { PrismaRepository } from './lib/repository/prisma-repository';
import { route } from './lib/ROUTES';

export const handle: Handle = sequence(
	await handleClerk(CLERK_SECRET_KEY, {
		debug: env.NODE_ENV === 'development',
		protectedPaths: [route('/browse')],
		signInUrl: '/login'
	}),
	async ({ event, resolve }) => {
		const repository = new PrismaRepository();
		if (event.locals.session?.userId) {
			const authUser = await repository.getUserByExternalId(event.locals.session?.userId);
			repository.setAuthUser(authUser);
			event.locals.authUser = authUser;
		}
		event.locals.repository = repository;

		return resolve(event);
	}
);

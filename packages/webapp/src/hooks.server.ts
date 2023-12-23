import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleClerk } from 'clerk-sveltekit/server';
import { CLERK_SECRET_KEY } from '$env/static/private';
import { env } from '$env/dynamic/private';
import {
	AuthenticatedPrismaRepository,
	UnauthenticatedPrismaRepository
} from '$lib/repository/prisma-repository';
import { route } from '$lib/ROUTES';

export const handle: Handle = sequence(
	await handleClerk(CLERK_SECRET_KEY, {
		debug: env.NODE_ENV === 'development',
		protectedPaths: [],
		signInUrl: route('/login')
	}),
	async ({ event, resolve }) => {
		let repository = new UnauthenticatedPrismaRepository();
		if (event.locals.session?.userId) {
			const authUser = await repository.getUserByExternalId(event.locals.session?.userId);
			repository = new AuthenticatedPrismaRepository(authUser);
			event.locals.authUser = authUser;
		}
		event.locals.repository = repository;

		return resolve(event);
	}
);

import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleClerk } from 'clerk-sveltekit/server';
import { CLERK_SECRET_KEY } from '$env/static/private';
import { NODE_ENV } from '$env/static/private';
import {
	AuthenticatedPrismaRepository,
	UnauthenticatedPrismaRepository
} from '$lib/repository/prisma-repository';
import { route } from '$lib/ROUTES';

export const handle: Handle = sequence(
	await handleClerk(CLERK_SECRET_KEY, {
		debug: NODE_ENV === 'development',
		protectedPaths: ['/dashboard'],
		signInUrl: route('/login')
	}),
	async ({ event, resolve }) => {
		let repository = new UnauthenticatedPrismaRepository();
		if (event.locals.session?.userId) {
			try {
				const authUser = await repository.getUserByExternalId(event.locals.session?.userId);
				repository = new AuthenticatedPrismaRepository(authUser);
				event.locals.authUser = authUser;
			} catch (e) {
				// Maybe the webhook has not been fired yet
				console.error(e);
			}
		}
		event.locals.repository = repository;

		return resolve(event);
	}
);

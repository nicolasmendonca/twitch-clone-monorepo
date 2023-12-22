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
	({ event, resolve }) => {
		event.locals.repository = new PrismaRepository(event.locals.session?.userId);

		return resolve(event);
	}
);

import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleClerk } from 'clerk-sveltekit/server';
import { CLERK_SECRET_KEY } from '$env/static/private';
import { env } from '$env/dynamic/private';
import { PrismaRepository } from './lib/repository/prisma-repository';

export const handle: Handle = sequence(
	handleClerk(CLERK_SECRET_KEY, {
		debug: env.NODE_ENV === 'development',
		protectedPaths: [],
		signInUrl: '/login'
	}),
	({ event, resolve }) => {
		event.locals.repository = new PrismaRepository(event.locals.session?.userId);

		return resolve(event);
	}
);

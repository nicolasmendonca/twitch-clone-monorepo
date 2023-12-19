import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleClerk } from 'clerk-sveltekit/server';
import { CLERK_SECRET_KEY } from '$env/static/private';
import { env } from '$env/dynamic/private';
import { route } from './lib/ROUTES';

export const handle: Handle = sequence(
	handleClerk(CLERK_SECRET_KEY, {
		debug: env.NODE_ENV === 'development',
		protectedPaths: [route('/browse')],
		signInUrl: '/login'
	})
);

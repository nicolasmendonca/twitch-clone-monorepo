import type { HandleClientError } from '@sveltejs/kit';
// To use Clerk components:
import { initializeClerkClient } from 'clerk-sveltekit/client';
// Or for headless mode:
// import { initializeClerkClient } from 'clerk-sveltekit/headless'
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';
import { route } from './lib/ROUTES';

initializeClerkClient(PUBLIC_CLERK_PUBLISHABLE_KEY, {
	afterSignInUrl: route('/'),
	afterSignUpUrl: route('/'),
	signInUrl: route('/login'),
	signUpUrl: route('/register')
});

export const handleError: HandleClientError = async ({ error, event }) => {
	console.error(error, event);
};

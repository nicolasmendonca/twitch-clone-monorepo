import { env } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { prismaRepository } from '$lib/db';

export const POST: RequestHandler = async ({ request }) => {
	if (request.method !== 'POST') {
		return new Response(null, { status: 405 });
	}
	// You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
	const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET;

	if (!WEBHOOK_SECRET) {
		throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
	}

	// Get the headers
	const svix_id = request.headers.get('svix-id') as string;
	const svix_timestamp = request.headers.get('svix-timestamp') as string;
	const svix_signature = request.headers.get('svix-signature') as string;

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response('Error occured -- no svix headers', {
			status: 400
		});
	}

	// Get the body
	const payload = await request.json();
	const body = JSON.stringify(payload);

	// Create a new Svix instance with your secret.
	const wh = new Webhook(WEBHOOK_SECRET);

	try {
		const evt = wh.verify(body, {
			'svix-id': svix_id,
			'svix-timestamp': svix_timestamp,
			'svix-signature': svix_signature
		}) as WebhookEvent;

		// Get the ID and type
		const { id } = evt.data;
		const eventType = evt.type;

		console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
		console.log('Webhook body:', body);

		switch (eventType) {
			case 'user.created':
				console.log('User created');
				await prismaRepository.createUser({
					externalUserId: evt.data.id,
					imageUrl: evt.data.image_url,
					username: evt.data.username!
				});
				break;
			case 'user.updated':
				await prismaRepository.updateUser({
					externalUserId: evt.data.id,
					imageUrl: evt.data.image_url,
					username: evt.data.username!
				});
				break;
			case 'user.deleted':
				console.log('User deleted');
				await prismaRepository.deleteUser({
					externalUserId: evt.data.id!
				});
				break;
			default:
				console.log(`Unhandled event "${eventType}"`);
		}

		return new Response('', { status: 200 });
	} catch (err) {
		console.error('Error verifying webhook:', err);
		return new Response('Error occured', {
			status: 400
		});
	}
};

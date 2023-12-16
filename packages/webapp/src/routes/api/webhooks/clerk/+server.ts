import { env } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { prisma } from '../../../../lib/db';

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

		if (eventType === 'user.created') {
			await prisma.user.create({
				data: {
					externalUserId: payload.data.id,
					username: payload.data.username,
					imageUrl: payload.data.image_url
				}
			});
		}

		if (eventType === 'user.updated') {
			const currentUser = await prisma.user.findUnique({
				where: {
					externalUserId: payload.data.id
				}
			});

			if (!currentUser) {
				throw new Error(`User with externalUserId ${payload.data.id} does not exist`);
			}

			await prisma.user.update({
				where: {
					externalUserId: payload.data.id
				},
				data: {
					username: payload.data.username,
					imageUrl: payload.data.image_url
				}
			});
		}

		if (eventType === 'user.deleted') {
			const currentUser = await prisma.user.findUnique({
				where: {
					externalUserId: payload.data.id
				}
			});

			if (!currentUser) {
				throw new Error(`User with externalUserId ${payload.data.id} does not exist`);
			}

			await prisma.user.delete({
				where: {
					externalUserId: payload.data.id
				}
			});
		}

		return new Response('', { status: 200 });
	} catch (err) {
		console.error('Error verifying webhook:', err);
		return new Response('Error occured', {
			status: 400
		});
	}
};

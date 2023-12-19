import type { PrismaClient } from '@prisma/client';
import type { RepositoryService } from './repository-service';
import { prisma } from '$lib/db';
import type { User } from './types';

export class PrismaRepository implements RepositoryService {
	private readonly prisma: PrismaClient;
	constructor() {
		this.prisma = prisma;
	}

	createUser: RepositoryService['createUser'] = async (payload) => {
		await this.prisma.user.create({
			data: {
				externalUserId: payload.externalUserId,
				username: payload.username,
				imageUrl: payload.imageUrl
			}
		});
	};

	updateUser: RepositoryService['updateUser'] = async (payload) => {
		const currentUser = await this.prisma.user.findUnique({
			where: {
				externalUserId: payload.externalUserId
			}
		});

		if (!currentUser) {
			throw new Error(`User with externalUserId ${payload.externalUserId} does not exist`);
		}

		await this.prisma.user.update({
			where: {
				externalUserId: payload.externalUserId
			},
			data: {
				username: payload.username,
				imageUrl: payload.imageUrl
			}
		});
	};

	deleteUser: RepositoryService['deleteUser'] = async (payload) => {
		const currentUser = await this.prisma.user.findUnique({
			where: {
				externalUserId: payload.externalUserId
			}
		});

		if (!currentUser) {
			throw new Error(`User with externalUserId ${payload.externalUserId} does not exist`);
		}

		await this.prisma.user.delete({
			where: {
				externalUserId: payload.externalUserId
			}
		});
	};

	getRecommendedChannels: RepositoryService['getRecommendedChannels'] = async (
		externalUserId: User['externalUserId']
	) => {
		return this.prisma.user.findMany({
			where: {
				externalUserId: {
					not: externalUserId
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		});
	};
}

export const prismaRepository = new PrismaRepository();

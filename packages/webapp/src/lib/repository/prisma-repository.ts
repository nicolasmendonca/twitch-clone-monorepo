import type { PrismaClient } from '@prisma/client';
import type { RepositoryService } from './repository-service';
import { prisma } from '$lib/db';
import type { User } from './types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserAlreadyFollowedError, UserNotPreviouslyFollowedError } from './errors';

export class PrismaRepository implements RepositoryService {
	private readonly prisma: PrismaClient;
	private readonly externalUserId: User['externalUserId'] | undefined;

	constructor(externalUserId: User['externalUserId'] | undefined) {
		this.prisma = prisma;
		this.externalUserId = externalUserId;
	}

	// User --------------------------------------------------
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

	getRecommendedUsers: RepositoryService['getRecommendedUsers'] = async () => {
		return this.prisma.user.findMany({
			where: {
				externalUserId: {
					not: this.externalUserId
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		});
	};

	getUserByUsername: RepositoryService['getUserByUsername'] = async (username) => {
		return this.prisma.user.findUnique({
			where: {
				username
			}
		});
	};

	// Follow ------------------------------------------------
	isFollowingUser: RepositoryService['isFollowingUser'] = async (username: User['username']) => {
		const currentUser = await this.prisma.follow.findFirst({
			where: {
				follower: {
					externalUserId: this.externalUserId
				},
				following: {
					username
				}
			}
		});

		return !!currentUser;
	};

	followUser: RepositoryService['followUser'] = async (username: User['username']) => {
		try {
			await this.prisma.follow.create({
				data: {
					follower: {
						connect: {
							externalUserId: this.externalUserId
						}
					},
					following: {
						connect: {
							username
						}
					}
				}
			});
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError) {
				throw new UserAlreadyFollowedError();
			}
		}
	};

	unfollowUser: RepositoryService['unfollowUser'] = async (username: User['username']) => {
		try {
			const [currentUser, followed] = await Promise.all([
				this.prisma.user.findUnique({
					where: {
						externalUserId: this.externalUserId
					}
				}),
				this.prisma.user.findUnique({
					where: {
						username
					}
				})
			]);

			if (!currentUser) {
				throw new Error('Current user does not exist');
			}
			if (!followed) {
				throw new Error('Followed user does not exist');
			}

			await this.prisma.follow.delete({
				where: {
					followerId_followingId: {
						followerId: currentUser?.id,
						followingId: followed?.id
					}
				}
			});
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError) {
				throw new UserNotPreviouslyFollowedError();
			}
			throw e;
		}
	};
}

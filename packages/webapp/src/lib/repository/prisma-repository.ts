import type { PrismaClient } from '@prisma/client';
import type { RepositoryService } from './repository-service';
import { prisma } from '$lib/db';
import type { User } from './types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
	CannotFollowSelfError,
	UserAlreadyFollowedError,
	UserDoesNotExistError,
	UserNotAuthenticatedError,
	UserNotPreviouslyFollowedError
} from './errors';

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

	getAuthUser: RepositoryService['getAuthUser'] = async () => {
		const user = await this.prisma.user.findUnique({
			where: {
				externalUserId: this.externalUserId
			},
			select: {
				id: true,
				imageUrl: true,
				username: true
			}
		});

		if (!user || !this.externalUserId) {
			throw new UserNotAuthenticatedError();
		}

		return user;
	};

	getRecommendedUsers: RepositoryService['getRecommendedUsers'] = async () => {
		if (!this.externalUserId) throw new UserNotAuthenticatedError();

		return this.prisma.user.findMany({
			where: {
				AND: [
					{
						NOT: {
							externalUserId: this.externalUserId
						}
					},
					{
						NOT: {
							followers: {
								some: {
									follower: {
										externalUserId: this.externalUserId
									}
								}
							}
						}
					}
				]
			},
			orderBy: {
				createdAt: 'desc'
			},
			take: 5
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
		if (!this.externalUserId) throw new UserNotAuthenticatedError();

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
			const user = await this.prisma.user.findUnique({
				where: {
					username
				},
				select: {
					id: true,
					externalUserId: true
				}
			});

			if (!user) throw new UserDoesNotExistError();
			if (user.externalUserId === this.externalUserId) throw new CannotFollowSelfError();

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
				console.error(e);
				throw new UserAlreadyFollowedError();
			} else {
				throw e;
			}
		}
	};

	unfollowUser: RepositoryService['unfollowUser'] = async (username: User['username']) => {
		try {
			if (!this.externalUserId) throw new UserNotAuthenticatedError();
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

			if (!currentUser || !followed) throw new UserDoesNotExistError();
			if (currentUser.id === followed.id) throw new CannotFollowSelfError();

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
				console.error(e);
				throw new UserNotPreviouslyFollowedError();
			}
			throw e;
		}
	};

	getFollowedUsers: RepositoryService['getFollowedUsers'] = async () => {
		try {
			if (!this.externalUserId) throw new UserNotAuthenticatedError();

			const currentUser = await this.prisma.user.findUnique({
				where: {
					externalUserId: this.externalUserId
				},
				select: {
					id: true
				}
			});

			if (!currentUser) throw new UserDoesNotExistError();

			const followConnections = await this.prisma.follow.findMany({
				where: {
					followerId: currentUser.id
				},
				select: {
					following: {
						select: {
							id: true,
							imageUrl: true,
							username: true
						}
					}
				},
				take: 5
			});

			return followConnections.map((follow) => follow.following);
		} catch (e) {
			console.error(e);
			return [];
		}
	};
}

import type { PrismaClient } from '@prisma/client';
import type { RepositoryService } from './repository-service';
import { prisma } from '$lib/db';
import type { User } from './types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
	CannotFollowSelfError,
	UserAlreadyBlockedError,
	UserAlreadyFollowedError,
	UserNotAuthenticatedError,
	UserNotPreviouslyFollowedError
} from './errors';

export class PrismaRepository implements RepositoryService {
	private readonly prisma: PrismaClient;
	private authUser: User | undefined;

	constructor() {
		this.prisma = prisma;
	}

	public setAuthUser(authUser: User) {
		this.authUser = authUser;
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

	getUserByExternalId: RepositoryService['getUserByExternalId'] = async (externalUserId) => {
		const user = await this.prisma.user.findUnique({
			where: {
				externalUserId
			}
		});

		if (!user || !externalUserId) {
			throw new UserNotAuthenticatedError();
		}

		return user;
	};

	getRecommendedUsers: RepositoryService['getRecommendedUsers'] = async () => {
		if (!this.authUser) throw new UserNotAuthenticatedError();

		return this.prisma.user.findMany({
			where: {
				AND: [
					{
						// Exclude self
						NOT: {
							id: this.authUser.id
						}
					},
					{
						// Exclude users already followed
						NOT: {
							followers: {
								some: {
									follower: {
										id: this.authUser.id
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
	isFollowingUser: RepositoryService['isFollowingUser'] = async (username) => {
		if (!this.authUser) throw new UserNotAuthenticatedError();

		const currentUser = await this.prisma.follow.findFirst({
			where: {
				followerId: this.authUser.id,
				following: {
					username
				}
			}
		});

		return !!currentUser;
	};

	followUser: RepositoryService['followUser'] = async (username) => {
		if (!this.authUser) throw new UserNotAuthenticatedError();

		if (this.authUser.username === username) throw new CannotFollowSelfError();

		try {
			await this.prisma.follow.create({
				data: {
					follower: {
						connect: {
							id: this.authUser.id
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
			throw e;
		}
	};

	unfollowUser: RepositoryService['unfollowUser'] = async (username) => {
		if (!this.authUser) throw new UserNotAuthenticatedError();

		const existingFollow = await this.prisma.follow.findFirst({
			where: {
				followerId: this.authUser.id,
				following: {
					username
				}
			}
		});

		if (!existingFollow) throw new UserNotPreviouslyFollowedError();

		await this.prisma.follow.delete({
			where: {
				id: existingFollow.id
			}
		});
	};

	getFollowedUsers: RepositoryService['getFollowedUsers'] = async () => {
		try {
			if (!this.authUser) throw new UserNotAuthenticatedError();

			const followConnections = await this.prisma.follow.findMany({
				where: {
					followerId: this.authUser.id
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

	// Block
	isBlockedByUser: RepositoryService['isBlockedByUser'] = async (username) => {
		if (!this.authUser) throw new UserNotAuthenticatedError();

		const existingBlock = await this.prisma.block.findFirst({
			where: {
				blocked: {
					username
				},
				blockerId: this.authUser.id
			}
		});

		return !!existingBlock;
	};

	blockUser: RepositoryService['blockUser'] = async (username) => {
		if (!this.authUser) throw new UserNotAuthenticatedError();
		try {
			await this.prisma.block.create({
				data: {
					blocked: {
						connect: {
							username
						}
					},
					blocker: {
						connect: {
							id: this.authUser.id
						}
					}
				}
			});
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError) {
				throw new UserAlreadyBlockedError();
			}
			throw e;
		}
	};
}

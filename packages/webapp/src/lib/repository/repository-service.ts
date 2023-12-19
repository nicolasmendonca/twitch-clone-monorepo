import type { User } from './types';

export interface RepositoryService {
	// User
	createUser(payload: Pick<User, 'externalUserId' | 'username' | 'imageUrl'>): Promise<void>;
	updateUser(payload: Pick<User, 'externalUserId' | 'username' | 'imageUrl'>): Promise<void>;
	deleteUser(payload: Pick<User, 'externalUserId'>): Promise<void>;
	getRecommendedChannels(
		externalUserId: User['externalUserId']
	): Promise<Pick<User, 'id' | 'imageUrl' | 'username'>[]>;

	// Follow
	isFollowingUser(externalUserId: User['externalUserId'], channelId: string): Promise<boolean>;
}

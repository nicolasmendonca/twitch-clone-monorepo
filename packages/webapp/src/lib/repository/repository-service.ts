import type { User } from './types';

export interface RepositoryService {
	// User
	createUser(payload: Pick<User, 'externalUserId' | 'username' | 'imageUrl'>): Promise<void>;
	updateUser(payload: Pick<User, 'externalUserId' | 'username' | 'imageUrl'>): Promise<void>;
	deleteUser(payload: Pick<User, 'externalUserId'>): Promise<void>;
	getRecommendedUsers(): Promise<Pick<User, 'id' | 'imageUrl' | 'username'>[]>;
	getUserByUsername(username: User['username']): Promise<User | null>;

	// Follow
	isFollowingUser(username: User['username']): Promise<boolean>;
	followUser(username: User['username']): Promise<void>;
	unfollowUser(username: User['username']): Promise<void>;
}

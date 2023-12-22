import type { User } from './types';

type PublicUserData = Pick<User, 'id' | 'imageUrl' | 'username'>;

export interface RepositoryService {
	// User
	createUser(payload: Pick<User, 'externalUserId' | 'username' | 'imageUrl'>): Promise<void>;
	updateUser(payload: Pick<User, 'externalUserId' | 'username' | 'imageUrl'>): Promise<void>;
	deleteUser(payload: Pick<User, 'externalUserId'>): Promise<void>;
	getAuthUser(): Promise<PublicUserData>;
	getRecommendedUsers(): Promise<PublicUserData[]>;
	getUserByUsername(username: User['username']): Promise<User | null>;

	// Follow
	isFollowingUser(username: User['username']): Promise<boolean>;
	followUser(username: User['username']): Promise<void>;
	unfollowUser(username: User['username']): Promise<void>;
	getFollowedUsers(): Promise<PublicUserData[]>;
}

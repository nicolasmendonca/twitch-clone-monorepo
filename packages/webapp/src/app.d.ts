// See https://kit.svelte.dev/docs/types#app

import type { RepositoryService } from './lib/repository/repository-service';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session:
				| undefined
				| {
						userId: `user_${string}`;
				  };
			authUser: User | undefined;
			repository: RepositoryService;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

export class UserAlreadyFollowedError extends Error {
	constructor() {
		super();
		this.message = 'User already followed';
	}
}
export class UserNotPreviouslyFollowedError extends Error {
	constructor() {
		super();
		this.message = 'User was not previously followed';
	}
}

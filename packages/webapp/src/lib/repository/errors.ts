export class UserAlreadyFollowedError extends Error {
	constructor() {
		super();
		this.message = 'User already followed';
	}
}
export class UserAlreadyBlockedError extends Error {
	constructor() {
		super();
		this.message = 'User already blocked';
	}
}
export class UserNotPreviouslyFollowedError extends Error {
	constructor() {
		super();
		this.message = 'User was not previously followed';
	}
}
export class UserNotAuthenticatedError extends Error {
	constructor() {
		super();
		this.message = 'User is not authenticated';
	}
}
export class UserDoesNotExistError extends Error {
	constructor() {
		super();
		this.message = 'User does not exist';
	}
}
export class CannotFollowSelfError extends Error {
	constructor() {
		super();
		this.message = 'Cannot follow self';
	}
}
export class StreamNotFoundError extends Error {
	constructor() {
		super();
		this.message = 'Stream not found';
	}
}

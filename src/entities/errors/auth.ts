export class AuthenticationError extends Error {
	// biome-ignore lint/complexity/noUselessConstructor: <explanation>
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}

export class UnauthenticatedError extends Error {
	// biome-ignore lint/complexity/noUselessConstructor: <explanation>
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}

export class UnauthorizedError extends Error {
	// biome-ignore lint/complexity/noUselessConstructor: <explanation>
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}

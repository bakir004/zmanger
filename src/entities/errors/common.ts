export class DatabaseOperationError extends Error {
	// biome-ignore lint/complexity/noUselessConstructor: <explanation>
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}

export class NotFoundError extends Error {
	// biome-ignore lint/complexity/noUselessConstructor: <explanation>
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}

export class InputParseError extends Error {
	// biome-ignore lint/complexity/noUselessConstructor: <explanation>
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}

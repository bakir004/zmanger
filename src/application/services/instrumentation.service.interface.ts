import type winston from "winston";

export interface IInstrumentationService {
	startSpan<T>(
		options: { name: string; op?: string; attributes?: Record<string, any> },
		callback: () => T,
	): T;
	instrumentServerAction<T>(
		name: string,
		options: Record<string, any>,
		callback: () => T,
	): Promise<T>;

	// Logging methods
	log(level: string, message: string, meta?: any): void;
	error(message: string, meta?: any): void;
	warn(message: string, meta?: any): void;
	info(message: string, meta?: any): void;
	debug(message: string, meta?: any): void;
	getLogger(): winston.Logger;
}

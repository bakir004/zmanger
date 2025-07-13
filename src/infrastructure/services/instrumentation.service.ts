import * as Sentry from "@sentry/nextjs";
import winston from "winston";
import Transport from "winston-transport";

import type { IInstrumentationService } from "src/application/services/instrumentation.service.interface";

export class InstrumentationService implements IInstrumentationService {
	private logger: winston.Logger;

	constructor() {
		// Create Sentry Winston transport
		const SentryWinstonTransport =
			Sentry.createSentryWinstonTransport(Transport);

		this.logger = winston.createLogger({
			level: process.env.NODE_ENV === "production" ? "info" : "debug",
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.errors({ stack: true }),
				winston.format.json(),
			),
			transports: [
				// Console transport for development
				...(process.env.NODE_ENV === "development"
					? [
							new winston.transports.Console({
								format: winston.format.combine(
									winston.format.colorize(),
									winston.format.simple(),
								),
							}),
						]
					: []),
				// Sentry transport for error reporting
				new SentryWinstonTransport({
					level: "error", // Only send errors to Sentry
				}),
			],
		});
	}

	startSpan<T>(
		options: { name: string; op?: string; attributes?: Record<string, any> },
		callback: () => T,
	): T {
		return Sentry.startSpan(options, callback);
	}

	instrumentServerAction<T>(
		name: string,
		options: Record<string, any>,
		callback: () => T,
	): Promise<T> {
		return Sentry.withServerActionInstrumentation(name, options, callback);
	}

	// Add logging methods
	log(level: string, message: string, meta?: any): void {
		this.logger.log(level, message, meta);
	}

	error(message: string, meta?: any): void {
		this.logger.error(message, meta);
	}

	warn(message: string, meta?: any): void {
		this.logger.warn(message, meta);
	}

	info(message: string, meta?: any): void {
		this.logger.info(message, meta);
	}

	debug(message: string, meta?: any): void {
		this.logger.debug(message, meta);
	}

	getLogger(): winston.Logger {
		return this.logger;
	}
}

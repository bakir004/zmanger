import * as Sentry from "@sentry/nextjs";

import type { IInstrumentationService } from "src/application/services/instrumentation.service.interface";

export class InstrumentationService implements IInstrumentationService {
	startSpan<T>(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		options: { name: string; op?: string; attributes?: Record<string, any> },
		callback: () => T,
	): T {
		return Sentry.startSpan(options, callback);
	}

	instrumentServerAction<T>(
		name: string,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		options: Record<string, any>,
		callback: () => T,
	): Promise<T> {
		return Sentry.withServerActionInstrumentation(name, options, callback);
	}
}

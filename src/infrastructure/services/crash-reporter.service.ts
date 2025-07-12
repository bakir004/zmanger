import * as Sentry from "@sentry/nextjs";

import type { ICrashReporterService } from "~/application/services/crash-reporter.service.interface";

export class CrashReporterService implements ICrashReporterService {
	report(error: any): string {
		return Sentry.captureException(error);
	}
}

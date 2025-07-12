export interface ICrashReporterService {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	report(error: any): string;
}

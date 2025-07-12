export interface IInstrumentationService {
	startSpan<T>(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		options: { name: string; op?: string; attributes?: Record<string, any> },
		callback: () => T,
	): T;
	instrumentServerAction<T>(
		name: string,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		options: Record<string, any>,
		callback: () => T,
	): Promise<T>;
}

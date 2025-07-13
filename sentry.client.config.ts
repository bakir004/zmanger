import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

	// Performance Monitoring
	tracesSampleRate: 1.0,

	// Session Replay
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,

	// Environment
	environment: process.env.NODE_ENV,

	// Disable debug mode to stop internal logs
	debug: false,

	// Disable internal Sentry logging
	_experiments: {
		enableLogs: true,
	},
});

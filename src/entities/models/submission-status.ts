// This MUST match the submission status enum in the API

export enum SubmissionStatus {
	Accepted = 0,
	CoreAccepted = 1,
	WrongAnswer = 2,
	CompilationError = 3,
	TimeLimitExceeded = 4,
	MemoryLimitExceeded = 5,
	MemoryLeakDetected = 6,
	MemoryError = 7,
	RuntimeError = 8,
}

"use server";

interface Submission {
	code: string;
	stdin: string;
	stdout: string;
	language: "cpp" | "c";
}
export interface ExecutionResult {
	compile_output: string;
	stdout: string;
	stderr: string;
	time: number;
	runtime_status: number;
	submission_status: number;
	description: string;
}

export async function runTests(
	submission: Submission,
): Promise<ExecutionResult> {
	const codeRunnerUrl = process.env.CODE_RUNNER_URL;
	if (!codeRunnerUrl) throw new Error("CODE_RUNNER_URL is not set");

	const submissionFormattedForServer = {
		code: submission.code,
		stdin: submission.stdin,
		expected_output: [""],
		language_id: submission.language === "cpp" ? 1 : 2,
	};

	const res = await fetch(`${codeRunnerUrl}/submissions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(submissionFormattedForServer),
	});
	const contentType = res.headers.get("content-type");
	let result: ExecutionResult;
	if (contentType?.includes("application/json")) result = await res.json();
	else throw new Error(await res.text());

	console.log(result);
	return result;
}

"use server";

import { auth } from "@clerk/nextjs/server";

export async function addOffer() {
	const { userId } = await auth();
	const submission = {
		code: `
        #include <iostream>\n int main() { int a; std::cin >> a; std::cout << "niggas" << a; }
        `,
		language_id: 1,
		stdin: "1",
		expected_output: "",
	};

	const codeRunnerUrl = process.env.CODE_RUNNER_URL;
	if (!codeRunnerUrl) throw new Error("CODE_RUNNER_URL is not set");
	const res = await fetch(`${codeRunnerUrl}/submissions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(submission),
	});
	const contentType = res.headers.get("content-type");
	let result: Response | string;
	if (contentType?.includes("application/json")) result = await res.json();
	else result = await res.text();

	console.log(result);
}

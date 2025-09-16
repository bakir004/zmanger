import { z } from "zod";

const PatchSchema = z.object({
	position: z.string(),
	code: z.string(),
	use_markers: z.boolean().optional(),
});

const ExecuteSchema = z.object({
	environment: z
		.object({
			stdin: z.string().optional(),
		})
		.optional(),
	expect: z.array(z.string()).optional(),
});

const ToolPatchObjSchema = z.object({
	patch: z.array(PatchSchema),
});

const ToolExecuteObjSchema = z.object({
	execute: ExecuteSchema.optional(),
});

const TestSchema = z.object({
	tools: z.tuple([
		ToolPatchObjSchema,
		z.string(),
		z.union([ToolExecuteObjSchema, z.string()]),
		z.string(),
		z.string(),
	]),
	name: z.string(),
	id: z.number(),
	options: z.array(z.string()).optional(),
});

export const ZamgerTestsSchema = z.object({
	name: z.string(),
	languages: z.array(z.string()),
	tests: z.array(TestSchema),
});

export function decodeHtmlEntities(encodedStr: string): string {
	return encodedStr
		.replace(/&quot;/g, '"') // Replace &quot; with "
		.replace(/&amp;/g, "&") // Replace &amp; with &
		.replace(/&lt;/g, "<") // Replace &lt; with <
		.replace(/&gt;/g, ">") // Replace &gt; with >
		.replace(/&#39;/g, "'") // Replace &#39; with '
		.replace(/&apos;/g, "'") // Replace &apos; with '
		.replace(/\//g, "/"); // Replace / with /
}

export type Test = {
	id: number;
	code: {
		topOfFile: string;
		aboveMain: string;
		main: string;
	};
	expectedOutput: string[]; // TODO: [string]
	stdin: string;
	hidden: boolean;
};

export type Tests = {
	name: string;
	language: string;
	subject: string;
	public: boolean;
	tests: Test[];
};
type ZamgerTests = z.infer<typeof ZamgerTestsSchema>;

export const testJsonFormatter = (json: string): Tests => {
	let jsonToParse = json;
	if (json.includes('<input type="hidden"')) {
		const startIndex = json.indexOf("{");
		const endIndex = json.lastIndexOf("}") + 1;
		if (startIndex !== -1 && endIndex !== -1) {
			jsonToParse = json.substring(startIndex, endIndex);
		}
	}

	const formattedTestJson: Tests = {
		name: "",
		subject: "",
		public: false,
		tests: [],
		language: "",
	};
	const decodedHTML = decodeHtmlEntities(jsonToParse);

	try {
		const testJson: ZamgerTests = JSON.parse(decodedHTML);
		const parsedJson = ZamgerTestsSchema.parse(testJson);
		const tests = parsedJson.tests;
		formattedTestJson.name = parsedJson.name;
		formattedTestJson.language = parsedJson.languages[0] ?? "cpp";
		formattedTestJson.public = false;

		for (const item of tests) {
			const newTest: Test = {
				id: item.id,
				code: {
					topOfFile: "",
					aboveMain: "",
					main: "",
				},
				expectedOutput: [],
				stdin: "",
				hidden: !!item.options && item.options.includes("hidden"),
			};
			const patchArray = item.tools[0].patch;
			for (const patchElement of patchArray) {
				newTest.code[patchElement.position as keyof typeof newTest.code] =
					patchElement.code;
			}
			const executeObject = item.tools[2];
			if (typeof executeObject === "string" || !executeObject.execute) {
				formattedTestJson.tests.push(newTest);
				continue;
			}

			newTest.stdin = executeObject.execute.environment?.stdin ?? "";

			const expectedOutputs = executeObject.execute.expect;
			if (!expectedOutputs || expectedOutputs.length < 1) {
				formattedTestJson.tests.push(newTest);
				continue;
			}
			newTest.expectedOutput = expectedOutputs;

			formattedTestJson.tests.push(newTest);
		}
		return formattedTestJson;
	} catch (e) {
		console.error("An error occurred:", e);
		throw new Error(
			"Failed to format JSON, probably a wrong format in the original JSON",
		);
	}
};

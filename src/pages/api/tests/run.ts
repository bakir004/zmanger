/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
import { logger } from "~/lib/logger";
import { fromBase64, toBase64 } from "~/lib/base64";
import { Test } from "@prisma/client";
dotenv.config();

function compareStringsIgnoringWhitespace(str1: string, str2: string): boolean {
  const normalizeString = (str: string): string => {
    return str.replace(/\s+/g, ""); // Replace all whitespace (spaces, tabs, newlines) with nothing
  };

  const normalizedStr1 = normalizeString(str1);
  const normalizedStr2 = normalizeString(str2);

  return normalizedStr1 === normalizedStr2;
}

function renameMainFunction(cppCode: string): string {
  const mainFunctionRegex =
    /(int|void)\s+main\s*\(\s*(int\s+argc,\s*char\s*\*\s*argv\[\])?\s*\)\s*\{/;

  if (!mainFunctionRegex.test(cppCode)) {
    return cppCode; // Return original code if no main function is found
  }

  const renamedCode = cppCode.replace(
    mainFunctionRegex,
    (match, returnType, args) => {
      return `${returnType} _main(${args || ""}) {`;
    },
  );

  return renamedCode;
}

export default async function runTests(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { code, test }: { code: string; test: Test } = req.body;

    if (!code) {
      logger.error("Code not in request body");
      throw new Error("Code not in request body");
    }
    if (!test) {
      logger.error("Test not in request body");
      throw new Error("Test not in request body");
    }

    if (process.env.CODERUNNER_URL === undefined) {
      logger.error("CODERUNNER_URL not in .env");
      throw new Error("CODERUNNER_URL not in .env");
    }

    const renamedCode = renameMainFunction(code);

    let finalCode = "";
    finalCode += test.topOfFile ?? "";
    finalCode += test.topOfFile ? "\n\n" : "";
    finalCode += renamedCode;
    finalCode += "\n\n";
    finalCode += test.aboveMain ?? "";
    finalCode += test.aboveMain ? "\n\n" : "";
    finalCode += "int main() {\n";
    finalCode += test.main ?? "";
    finalCode += "\n}";

    const result = await fetch(
      process.env.CODERUNNER_URL + "/submissions?base64_encoded=true&wait=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_code: toBase64(finalCode),
          language_id: "2",
          stdin: toBase64(test.stdin ?? "") ?? "",
          expected_output: toBase64(test.expect[0]),
        }),
      },
    );
    const submissionResultEncoded = await result.clone().json();
    const submissionResult = {
      stdout: fromBase64(submissionResultEncoded.stdout),
      time: submissionResultEncoded.time,
      memory: submissionResultEncoded.memory,
      stderr: fromBase64(submissionResultEncoded.stderr),
      compile_output: fromBase64(submissionResultEncoded.compile_output),
      message: fromBase64(submissionResultEncoded.message),
      status: submissionResultEncoded.status,
    };
    if (submissionResult.status.description !== "Accepted") {
      test.expect.forEach((expect) => {
        if (compareStringsIgnoringWhitespace(submissionResult.stdout, expect)) {
          submissionResult.status.description = "Core accepted";
        }
      });
      test.expect.forEach((expect) => {
        if (submissionResult.stdout.trim() === expect.trim()) {
          submissionResult.status.description = "Accepted";
        }
      });
    }
    res.status(200).json({ submissionResult });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Error", error: error.message });
  }
}

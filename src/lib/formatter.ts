/* eslint-disable */
import { Test, Tests } from "./types";

export const testJsonFormatter = (json: any) => {
  const formattedTestJson: Tests = {
    tests: [],
  };

  try {
    const testJson = json;

    const tests = testJson.tests;
    tests.forEach((item: any, i: number) => {
      const newTest: Test = {
        id: 0,
        patch: [],
        expect: [],
        stdin: undefined,
      };
      const patchArray = item.tools[0].patch;
      const newPatchArray: Array<{
        position: "main" | "above_main" | "top_of_file";
        code: string;
      }> = [];
      patchArray.forEach((patch: any) => {
        newPatchArray.push({
          position: patch.position,
          code: patch.code,
        });
      });
      const expectedOutputs = item.tools[2].execute.expect;
      newTest.expect = [...expectedOutputs];
      newTest.id = i;
      newTest.patch = newPatchArray;
      if (item.tools[2].execute.environment)
        newTest.stdin = item.tools[2].execute.environment.stdin;
      formattedTestJson.tests.push(newTest);
    });
    return formattedTestJson;
  } catch (e) {
    console.error("An error occurred:", e);
  }
};

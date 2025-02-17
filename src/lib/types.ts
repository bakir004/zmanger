export interface TestResult {
  id: number;
  stdout: string | null;
  time: string;
  memory: number;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
}

export interface Test {
  id: number;
  patch: Array<{
    position: "main" | "above_main" | "top_of_file";
    code: string;
  }>;
  expect: Array<string>;
  stdin?: string;
}
export interface Tests {
  tests: Array<Test>;
}

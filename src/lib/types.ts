// {
//     "stdout": "hello, Judge0\n",
//     "time": "0.001",
//     "memory": 380,
//     "stderr": null,
//     "token": "eb0dd001-66db-47f4-8a69-b736c9bc23f6",
//     "compile_output": null,
//     "message": null,
//     "status": {
//       "id": 3,
//       "description": "Accepted"
//     }
//   }

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

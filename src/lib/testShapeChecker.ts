export interface Test {
  id: number;
  patch: Array<{ position: string; code: string }>;
  expect: string;
  stdin: string | undefined;
}
export interface Tests {
  tests: Array<Test>;
}

export function testShapeChecker(json: string) {
  const parsed: Tests = JSON.parse(json);
  const tests = parsed.tests;
  if (tests.length === 0) throw new Error("Nije unesen nijedan test.");
  for (const test of tests) {
    if (test.id === undefined) throw new Error("Nedostaje id testa.");
    if (test.patch === undefined)
      throw new Error("Nedostaje patch testa u testu " + test.id);
    if (test.expect === undefined)
      throw new Error("Nedostaje expected output testa u testu " + test.id);
    let mainFound = false;
    for (const patch of test.patch) {
      if (patch.position === undefined)
        throw new Error("Nedostaje position patcha u testu " + test.id);
      if (patch.code === undefined)
        throw new Error(
          "Nedostaje code patcha u testu " +
            test.id +
            " na poziciji " +
            patch.position,
        );
      if (patch.position === "main") mainFound = true;
    }
    if (!mainFound) throw new Error("Nedostaje main patch u testu " + test.id);
  }
  return parsed;
}

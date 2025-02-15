/* eslint-disable */
import { Tests } from "./types";

export function testShapeChecker(json: string) {
  let parsed: Tests;
  try {
    parsed = JSON.parse(json);
  } catch (e: any) {
    throw new Error(e.message);
  }

  if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.tests)) {
    throw new Error("Glavni JSON mora sadržavati polje 'tests' kao niz.");
  }

  if (parsed.tests.length === 0) {
    throw new Error("Nije unesen nijedan test.");
  }

  for (const test of parsed.tests) {
    if (typeof test !== "object" || test === null) {
      throw new Error("Neispravan format testa.");
    }

    if (typeof test.id !== "number" || isNaN(test.id)) {
      throw new Error(`ID testa ${test.id} mora biti broj.`);
    }

    if (!Array.isArray(test.patch) || test.patch.length === 0) {
      throw new Error(
        `Patch testa ${test.id} mora biti niz i ne može biti prazan.`,
      );
    }

    let mainFound = false;
    for (const patch of test.patch) {
      if (typeof patch !== "object" || patch === null) {
        throw new Error(`Neispravan format patcha u testu ${test.id}.`);
      }
      if (!["main", "above_main", "top_of_file"].includes(patch.position)) {
        throw new Error(
          `Neispravna vrijednost position patcha u testu ${test.id}.`,
        );
      }
      if (typeof patch.code !== "string") {
        throw new Error(
          `Code patcha u testu ${test.id} na poziciji ${patch.position} mora biti string.`,
        );
      }
      if (patch.position === "main") {
        mainFound = true;
      }
    }
    if (!mainFound) {
      throw new Error(`Nedostaje main patch u testu ${test.id}.`);
    }

    if (!Array.isArray(test.expect) || test.expect.length === 0) {
      throw new Error(
        `Expect u testu ${test.id} mora biti niz stringova i ne može biti prazan.`,
      );
    }
    for (const exp of test.expect) {
      if (typeof exp !== "string") {
        throw new Error(
          `Svi elementi expect niza u testu ${test.id} moraju biti stringovi.`,
        );
      }
    }

    if (test.stdin !== undefined && typeof test.stdin !== "string") {
      throw new Error(
        `Stdin u testu ${test.id}, ako postoji, mora biti string.`,
      );
    }
  }

  return parsed;
}

/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { testShapeChecker } from "~/lib/testShapeChecker";
import { Tests } from "~/lib/types";

const prisma = new PrismaClient();

export default async function update(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Only PUT requests allowed" });
  }
  const { id } = req.query;
  const testGroupId = id;
  try {
    const {
      testGroupName,
      testGroupSubject,
      testsObject,
    }: {
      testGroupName: string;
      testGroupSubject: string;
      testsObject: Tests;
    } = req.body;

    const tests = testsObject.tests;
    console.log(testGroupId, testGroupName, testGroupSubject);
    console.log(tests.length);

    if (
      !testGroupName ||
      !testGroupSubject ||
      !Array.isArray(tests) ||
      tests.length === 0
    ) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    try {
      testShapeChecker(JSON.stringify(testsObject));
    } catch (e: any) {
      return res
        .status(400)
        .json({ message: "Invalid tests shape", error: e.message });
    }

    const existingTestGroup = await prisma.testGroup.findFirst({
      where: {
        id: Number(testGroupId),
      },
    });

    if (!existingTestGroup) {
      return res.status(404).json({ message: "Test group not found" });
    }

    const { id } = existingTestGroup;

    const updatedTestGroup = await prisma.$transaction(async (prisma) => {
      const testIdsToKeep = tests.map((test) => test.id);

      await prisma.test.deleteMany({
        where: {
          testGroupId: id,
          NOT: {
            id: {
              in: testIdsToKeep,
            },
          },
        },
      });

      return prisma.testGroup.update({
        where: { id: id },
        data: {
          subject: testGroupSubject,
          name: testGroupName,
          tests: {
            upsert: tests.map((test) => {
              let aboveMain = null;
              let main = null;
              let topOfFile = null;

              test.patch.forEach(
                (p: {
                  position: "main" | "above_main" | "top_of_file";
                  code: string;
                }) => {
                  if (p.position === "main") main = p.code;
                  else if (p.position === "above_main") aboveMain = p.code;
                  else if (p.position === "top_of_file") topOfFile = p.code;
                },
              );

              if (!main) {
                throw new Error(
                  `Test with id ${test.id} is missing a "main" patch.`,
                );
              }

              return {
                where: { id: test.id },
                create: {
                  number: test.id,
                  aboveMain,
                  main,
                  topOfFile,
                  expect: Array.isArray(test.expect)
                    ? test.expect.join(" ")
                    : test.expect,
                  stdin: test.stdin ?? null,
                },
                update: {
                  aboveMain,
                  main,
                  topOfFile,
                  expect: Array.isArray(test.expect)
                    ? test.expect.join(" ")
                    : test.expect,
                  stdin: test.stdin ?? null,
                },
              };
            }),
          },
        },
      });
    });

    res.status(200).json({
      message: `TestGroup updated successfully: ${testGroupName}, ${testGroupSubject}`,
      updatedTestGroup,
    });
  } catch (error: any) {
    console.error("Error updating test group:", error);
    res
      .status(500)
      .json({ message: "Error updating test group", error: error.message });
  }
}

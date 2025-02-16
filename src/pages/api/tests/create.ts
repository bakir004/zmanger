/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { testShapeChecker } from "~/lib/testShapeChecker";
import { Tests } from "~/lib/types";
import test from "node:test";
import { delimiter } from "~/lib/utils";
import { logger } from "~/lib/logger";

const prisma = new PrismaClient();

export default async function create(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  try {
    const {
      testGroupName,
      testGroupSubject,
      testsObject,
      user,
    }: {
      testGroupName: string;
      testGroupSubject: string;
      testsObject: Tests;
      user: string;
    } = req.body;

    const tests = testsObject.tests;

    if (
      !testGroupName ||
      !testGroupSubject ||
      !Array.isArray(tests) ||
      tests.length === 0
    ) {
      logger.error("Invalid request body", req.body, {
        user,
      });
      return res.status(400).json({ message: "Invalid request body" });
    }

    try {
      testShapeChecker(JSON.stringify(testsObject));
    } catch (e: any) {
      logger.error("Invalid tests shape", e.message, {
        user,
      });
      return res
        .status(400)
        .json({ message: "Invalid tests shape", error: e.message });
    }
    const testGroup = await prisma.testGroup.create({
      data: {
        name: testGroupName,
        subject: testGroupSubject,
        tests: {
          create: tests.map((test) => {
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

            if (!Array.isArray(test.expect) || test.expect.length === 0) {
              throw new Error(
                `Test with id ${test.id} has an invalid or empty "expect" array.`,
              );
            }

            return {
              number: test.id,
              aboveMain,
              main,
              topOfFile,
              expect: test.expect,
              stdin: test.stdin ?? null,
            };
          }),
        },
      },
    });

    logger.info("TestGroup created successfully", {
      testGroupId: testGroup.id,
      testGroupName,
      testGroupSubject,
      user: user,
    });
    res.status(201).json({
      message:
        "TestGroup created successfully: " +
        testGroupName +
        ", " +
        testGroupSubject,
    });
  } catch (error: any) {
    logger.error("Error creating test group", { error: error.message });
    res
      .status(500)
      .json({ message: "Error creating test group", error: error.message });
  }
}

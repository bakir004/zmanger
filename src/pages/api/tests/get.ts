/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { logger } from "~/lib/logger";

const prisma = new PrismaClient();

export default async function getAllTestGroups(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const testGroups = await prisma.testGroup.findMany({
      include: {
        tests: true,
      },
    });

    const formattedTestGroups = testGroups.map((testGroup) => ({
      id: testGroup.id,
      name: testGroup.name,
      subject: testGroup.subject,
      json: {
        tests: testGroup.tests.map((test) => ({
          id: test.id,
          patch: [
            { position: "main", code: test.main },
            { position: "above_main", code: test.aboveMain || "" },
            { position: "top_of_file", code: test.topOfFile || "" },
          ],
          expect: test.expect,
        })),
      },
    }));

    res.status(200).json({ testGroups: formattedTestGroups });
  } catch (error: any) {
    logger.error("Error retrieving test groups:", error.message);
    res
      .status(500)
      .json({ message: "Error retrieving test groups", error: error.message });
  }
}

/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { logger } from "~/lib/logger";

const prisma = new PrismaClient();

export default async function deleteTestGroups(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { ids, user }: { ids: number[]; user: string } = req.body;
  const testGroupIds = ids;

  if (!testGroupIds || testGroupIds.length === 0) {
    logger.error("No test group IDs provided", req.body, { user });
    return res.status(400).json({ message: "No test group IDs provided" });
  }

  try {
    await prisma.test.deleteMany({
      where: {
        testGroupId: {
          in: testGroupIds,
        },
      },
    });

    await prisma.testGroup.deleteMany({
      where: {
        id: {
          in: testGroupIds,
        },
      },
    });

    logger.info("Test groups and associated tests deleted", {
      user,
      testGroupIds,
    });
    res
      .status(200)
      .json({ message: "Test groups and associated tests deleted" });
  } catch (error: any) {
    logger.error("Error deleting test groups", { error: error.message, user });
    res
      .status(500)
      .json({ message: "Error deleting test groups", error: error.message });
  }
}

/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function deleteTestGroups(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { ids }: { ids: number[] } = req.body;
  const testGroupIds = ids;

  if (!testGroupIds || testGroupIds.length === 0) {
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

    res
      .status(200)
      .json({ message: "Test groups and associated tests deleted" });
  } catch (error: any) {
    console.error("Error deleting test groups:", error);
    res
      .status(500)
      .json({ message: "Error deleting test groups", error: error.message });
  }
}

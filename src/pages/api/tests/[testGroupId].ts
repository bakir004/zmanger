/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "~/lib/logger";

const prisma = new PrismaClient();

export default async function getTestsByGroupId(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { testGroupId } = req.query;

    const tests = await prisma.test.findMany({
      where: {
        testGroupId: Number(testGroupId),
      },
    });

    return res.status(200).json(tests);
  } catch (error: any) {
    logger.error("Error retrieving tests:", error.message);
    return res
      .status(500)
      .json({ message: "Error retrieving tests", error: error.message });
  }
}

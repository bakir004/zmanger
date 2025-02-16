import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "~/lib/logger";

const prisma = new PrismaClient();

export default async function getTestsGroupsBySubject(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { subject } = req.query;

  if (typeof subject !== "string") {
    logger.error("Invalid subject in params", { subject });
    return res.status(400).json({ error: "Invalid subject in params" });
  }

  const testGroups = await prisma.testGroup.findMany({
    where: {
      subject,
    },
  });

  return res.status(200).json(testGroups);
}

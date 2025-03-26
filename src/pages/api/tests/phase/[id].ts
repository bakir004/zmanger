/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { logger } from "~/lib/logger";

const prisma = new PrismaClient();

export default async function updatePhase(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Only PUT requests allowed" });
  }

  try {
    const { id } = req.query;
    const { phase, user } = req.body;

    if (!phase || !["testing", "production"].includes(phase)) {
      logger.error("Invalid phase value", { phase, user });
      return res.status(400).json({ message: "Invalid phase value" });
    }

    const updatedTestGroup = await prisma.testGroup.update({
      where: { id: Number(id) },
      data: { phase },
    });

    logger.info("Test group phase updated", {
      testGroupId: id,
      phase,
      user,
    });

    res.status(200).json(updatedTestGroup);
  } catch (error: any) {
    logger.error("Error updating test group phase", { error: error.message });
    res.status(500).json({
      message: "Error updating test group phase",
      error: error.message,
    });
  }
}

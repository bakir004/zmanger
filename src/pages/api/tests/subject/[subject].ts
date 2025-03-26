/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "~/lib/logger";

const prisma = new PrismaClient();

export default async function getTestsGroupsBySubject(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { subject } = req.query;
  const userId = req.headers["x-user-id"] as string;
  const userRole = req.headers["x-user-role"] as string;

  if (typeof subject !== "string") {
    logger.error("Invalid subject in params", { subject });
    return res.status(400).json({ error: "Invalid subject in params" });
  }

  if (!userId) {
    logger.error("No user ID provided");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const isModeratorOrAdmin = userRole === "moderator" || userRole === "admin";

    const testGroups = await prisma.testGroup.findMany({
      where: {
        subject,
        ...(isModeratorOrAdmin ? {} : { phase: "production" }), // Only show production tests for non-moderator/admin users
      },
      select: {
        id: true,
        name: true,
        subject: true,
        phase: true,
      },
    });

    return res.status(200).json({ testGroups });
  } catch (error: any) {
    logger.error("Error fetching test groups:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

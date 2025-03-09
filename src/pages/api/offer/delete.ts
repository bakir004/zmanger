/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { logger } from "~/lib/logger";

const prisma = new PrismaClient();

export default async function deleteOffer(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Only DELETE requests allowed" });
  }

  try {
    const { id } = req.query;
    const userId = req.headers.authorization;

    if (!id || !userId) {
      logger.error("Invalid request - missing required fields", {
        userId,
        query: req.query,
      });
      return res
        .status(400)
        .json({ message: "Offer ID and user ID are required" });
    }

    // First check if the offer exists and belongs to the creator
    const existingOffer = await prisma.offer.findFirst({
      where: {
        id: Number(id),
        creatorId: userId,
      },
    });

    if (!existingOffer) {
      logger.error("Offer not found or unauthorized", {
        offerId: id,
        userId,
      });
      return res
        .status(404)
        .json({ message: "Offer not found or unauthorized" });
    }

    // Delete the offer
    await prisma.offer.delete({
      where: {
        id: Number(id),
      },
    });

    logger.info("Offer deleted successfully", {
      offerId: id,
      userId,
    });

    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error: any) {
    logger.error("Error deleting offer", { error: error.message });
    res
      .status(500)
      .json({ message: "Error deleting offer", error: error.message });
  }
}

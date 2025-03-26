/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { logger } from "~/lib/logger";

const prisma = new PrismaClient();

export default async function getOffers(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET requests allowed" });
  }

  try {
    const { year } = req.query;

    // Build where clause based on year filter
    const where = year ? { year: Number(year) } : {};

    const offers = await prisma.offer.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    logger.info("Offers retrieved successfully", {
      count: offers.length,
      yearFilter: year || "none",
    });

    res.status(200).json({
      message: "Offers retrieved successfully",
      offers,
    });
  } catch (error: any) {
    logger.error("Error retrieving offers", { error: error.message });
    res
      .status(500)
      .json({ message: "Error retrieving offers", error: error.message });
  }
}

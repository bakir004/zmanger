/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
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
      phoneNumber,
      creatorId,
      creatorName,
      subjectGive,
      timeGive,
      dayGive,
      subjectWant,
      timeWant,
      dayWant,
      year,
    } = req.body;

    if (
      !phoneNumber ||
      !creatorId ||
      !creatorName ||
      !subjectGive ||
      !timeGive ||
      !dayGive ||
      !subjectWant ||
      !timeWant ||
      !dayWant ||
      !year
    ) {
      logger.error("Invalid request body - missing required fields", {
        userId: creatorId,
        body: req.body,
      });
      return res.status(400).json({ message: "All fields are required" });
    }

    const offer = await prisma.offer.create({
      data: {
        phoneNumber,
        creatorId,
        creatorName,
        subjectGive,
        timeGive,
        dayGive,
        subjectWant,
        timeWant,
        dayWant,
        year: Number(year),
      },
    });

    logger.info("Offer created successfully", {
      offerId: offer.id,
      userId: creatorId,
    });

    res.status(201).json({
      message: "Offer created successfully",
      offer,
    });
  } catch (error: any) {
    logger.error("Error creating offer", { error: error.message });
    res
      .status(500)
      .json({ message: "Error creating offer", error: error.message });
  }
}

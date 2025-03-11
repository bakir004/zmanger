/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      userId,
      firstName,
      lastName,
      imageUrl,
      title,
      rating,
      description,
    } = req.body;

    if (
      !userId ||
      !firstName ||
      !lastName ||
      !title ||
      !description ||
      typeof rating !== "number"
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prisma = new PrismaClient();

    // Check if user already has a review
    const existingReview = await prisma.review.findFirst({
      where: { userId },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already submitted a review" });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        firstName,
        lastName,
        imageUrl,
        title,
        rating,
        description,
      },
    });

    return res.status(201).json({ review });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

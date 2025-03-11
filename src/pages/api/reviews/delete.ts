/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    const userId = req.headers.authorization;

    if (!id || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prisma = new PrismaClient();
    // Check if review exists and belongs to the user
    const review = await prisma.review.findUnique({
      where: { id: parseInt(id as string) },
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.userId !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: parseInt(id as string) },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

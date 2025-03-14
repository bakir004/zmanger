/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { flush, logger } from "~/lib/logger";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  logger.warn("Cron job started", { message: "Cron job started" });
  flush();
  res.status(200).end("Hello Cron!");
}

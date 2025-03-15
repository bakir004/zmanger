/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "~/lib/logger";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  logger.warn("Cron job started", { message: "Cron job started" });
  res.status(200).end("Hello Cron!");
}

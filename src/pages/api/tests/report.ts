/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "~/lib/logger";

export default async function sendReport(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { user, report }: { user: string; report: any } = req.body;
  logger.info(report.user + " ran some tests", { user, report });
  res.json({ message: "Report sent" });
}

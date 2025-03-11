/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
import { logger } from "~/lib/logger";
dotenv.config();

export default async function getJudgeStatistics(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const results = await fetch(process.env.CODERUNNER_URL + "/statistics");
    const data = await results.json();

    res.status(200).json(data);
  } catch (error: any) {
    logger.error("Error in getSubmissionCount", { error: error.message });
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

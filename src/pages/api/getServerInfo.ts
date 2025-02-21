/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
dotenv.config();

export default async function getServerInfo(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const results = await fetch(process.env.CODERUNNER_URL + "/system_info");
    const data = await results.json();

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching server info", error });
    console.error(error);
  }
}

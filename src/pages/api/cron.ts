/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { flush, logger } from "~/lib/logger";

export default function handler(req: NextRequest, res: NextApiResponse) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  logger.warn("Cron job started", { message: "Cron job started" });
  flush();
  res.status(200).end("Hello Cron!");
}

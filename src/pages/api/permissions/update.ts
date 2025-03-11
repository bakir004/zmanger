import { clerkClient } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, permission, value } = req.body;

    if (!userId || !permission || typeof value !== "boolean") {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const currentMetadata = user.publicMetadata as Record<string, boolean>;

    const newMetadata = { ...currentMetadata };
    if (value) {
      newMetadata[permission] = true;
    } else {
      delete newMetadata[permission];
    }

    await clerk.users.updateUser(userId, {
      publicMetadata: newMetadata,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating user permissions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

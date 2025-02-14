import dotenv from "dotenv";
dotenv.config();

export default async function getUserCount(req: any, res: any) {
  const isProduction = process.env.NODE_ENV === "production";
  const apiKey = isProduction
    ? process.env.CLERK_SECRET_KEY
    : process.env.CLERK_SECRET_PROD_KEY;
  const apiUrl = "https://api.clerk.dev/v1/users/count";

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return res.status(500).json({ message: "Error fetching users" });
    }

    const data: { object: string; total_count: number } = await response.json();
    const totalUsers = data.total_count;

    res.status(200).json({ totalUsers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
}

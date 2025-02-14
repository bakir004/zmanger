import { logger } from "~/lib/logger";

export default async function log(req: any, res: any) {
  logger.info("Hello warned", {
    userId: "123",
    username: "test",
    passedTests: 30,
  });
  console.log("logged");
}

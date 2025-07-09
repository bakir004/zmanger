import type { Config } from "drizzle-kit";

import { env } from "env";

export default {
	schema: "./drizzle/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	tablesFilter: ["zmanger_*"],
} satisfies Config;

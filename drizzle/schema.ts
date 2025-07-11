// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `zmanger_${name}`);

export const reviews = createTable(
	"review",
	(d) => ({
		id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
		userId: d.varchar({ length: 64 }),
		firstName: d.varchar({ length: 128 }),
		lastName: d.varchar({ length: 128 }),
		imageUrl: d.varchar({ length: 512 }),
		title: d.varchar({ length: 256 }),
		rating: d.integer(),
		description: d.varchar({ length: 512 }),
	}),
	(t) => [index("user_id_idx").on(t.userId)],
);

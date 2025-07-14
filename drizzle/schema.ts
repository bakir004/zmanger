// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
	index,
	pgTableCreator,
	pgTable,
	uuid,
	text,
	timestamp,
	type AnyPgColumn,
} from "drizzle-orm/pg-core";

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

export const testBatches = createTable(
	"test_batch",
	(d) => ({
		id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
		name: d.varchar({ length: 256 }).notNull(),
		subject: d.varchar({ length: 256 }).notNull(),
		language: d.varchar({ length: 50 }).notNull(),
	}),
	(t) => [index("name_idx").on(t.name)],
);

export const tests = createTable(
	"test",
	(d) => ({
		id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
		topOfFile: d.text().notNull(),
		aboveMain: d.text().notNull(),
		main: d.text().notNull(),
		stdin: d.text().notNull(),
		expectedOutput: d.text().array().notNull(),
		hidden: d.boolean().notNull().default(false),
		testBatchId: d
			.integer()
			.references(() => testBatches.id)
			.notNull(),
	}),
	(t) => [index("test_batch_id_idx").on(t.testBatchId)],
);

export const files = createTable(
	"files",
	(d) => ({
		id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
		userId: d.text().notNull(),
		name: d.text().notNull(),
		type: d.text({ enum: ["file", "folder"] }).notNull(),
		content: d.text(),
		createdAt: d.timestamp().defaultNow().notNull(),
		updatedAt: d.timestamp().defaultNow().notNull(),
		parentId: d.integer().references((): AnyPgColumn => files.id),
	}),
	(t) => [index("user_id_idx_files").on(t.userId)],
);

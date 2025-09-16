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
import { relations } from "drizzle-orm";

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
		createdAt: d
			.timestamp({ withTimezone: true })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		updatedAt: d
			.timestamp({ withTimezone: true })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`)
			.$onUpdate(() => new Date()),
		public: d.boolean().notNull().default(false),
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
			.references(() => testBatches.id, { onDelete: "cascade" })
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
		createdAt: d.timestamp().notNull().defaultNow(),
		updatedAt: d.timestamp().notNull().defaultNow(),
		parentId: d
			.integer()
			.references((): AnyPgColumn => files.id, { onDelete: "cascade" }),
	}),
	(t) => [index("user_id_idx_files").on(t.userId)],
);

export const notifications = createTable(
	"notification",
	(d) => ({
		id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
		title: d.varchar({ length: 256 }).notNull(),
		description: d.text(),
		type: d.varchar({ length: 50 }).notNull().default("info"), // info, success, warning, error
		actionUrl: d.varchar({ length: 512 }), // Optional URL for action button
		actionLabel: d.varchar({ length: 100 }), // Label for action button
		createdAt: d
			.timestamp({ withTimezone: true })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
	}),
	(t) => [
		index("created_at_idx_notifications").on(t.createdAt),
		index("type_idx_notifications").on(t.type),
	],
);

export const userSubmissions = createTable(
	"user_submission",
	(d) => ({
		id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
		userId: d.varchar({ length: 64 }).notNull(),
		testBatchId: d
			.integer()
			.references(() => testBatches.id, { onDelete: "cascade" })
			.notNull(),
		createdAt: d
			.timestamp({ withTimezone: true })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		updatedAt: d
			.timestamp({ withTimezone: true })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`)
			.$onUpdate(() => new Date()),
	}),
	(t) => [
		index("user_id_idx_submissions").on(t.userId),
		index("test_batch_id_idx_submissions").on(t.testBatchId),
		index("user_test_batch_idx_submissions").on(t.userId, t.testBatchId),
	],
);

export const userSubmissionTests = createTable(
	"user_submission_test",
	(d) => ({
		id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
		userSubmissionId: d
			.integer()
			.references(() => userSubmissions.id, { onDelete: "cascade" })
			.notNull(),
		testId: d
			.integer()
			.references(() => tests.id, { onDelete: "cascade" })
			.notNull(),
		compileOutput: d.text().notNull(),
		stdout: d.text().notNull(),
		stderr: d.text().notNull(),
		time: d.real().notNull(), // execution time in seconds
		runtimeStatus: d.integer().notNull(),
		submissionStatus: d.integer().notNull(),
		description: d.text().notNull(),
		createdAt: d
			.timestamp({ withTimezone: true })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
	}),
	(t) => [
		index("user_submission_id_idx").on(t.userSubmissionId),
		index("test_id_idx_submission_tests").on(t.testId),
		index("submission_status_idx").on(t.submissionStatus),
	],
);

// Relations
export const userSubmissionsRelations = relations(
	userSubmissions,
	({ many, one }) => ({
		tests: many(userSubmissionTests),
		testBatch: one(testBatches, {
			fields: [userSubmissions.testBatchId],
			references: [testBatches.id],
		}),
	}),
);

export const userSubmissionTestsRelations = relations(
	userSubmissionTests,
	({ one }) => ({
		userSubmission: one(userSubmissions, {
			fields: [userSubmissionTests.userSubmissionId],
			references: [userSubmissions.id],
		}),
		test: one(tests, {
			fields: [userSubmissionTests.testId],
			references: [tests.id],
		}),
	}),
);

export const testBatchesRelations = relations(testBatches, ({ many }) => ({
	tests: many(tests),
	userSubmissions: many(userSubmissions),
}));

export const testsRelations = relations(tests, ({ one, many }) => ({
	testBatch: one(testBatches, {
		fields: [tests.testBatchId],
		references: [testBatches.id],
	}),
	userSubmissionTests: many(userSubmissionTests),
}));

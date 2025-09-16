import type {
	UserSubmission,
	UserSubmissionInsert,
	UserSubmissionWithoutTests,
	UserSubmissionTest,
	UserSubmissionTestInsert,
	UserSubmissionOverview,
} from "src/entities/models/user-submission";

export interface IUserSubmissionsRepository {
	createUserSubmission(
		submission: UserSubmissionInsert,
		tx?: any,
	): Promise<UserSubmissionWithoutTests>;
	createUserSubmissionTest(
		submissionTest: UserSubmissionTestInsert,
		tx?: any,
	): Promise<UserSubmissionTest>;
	getUserSubmissionByUserAndBatch(
		userId: string,
		testBatchId: number,
	): Promise<UserSubmission | null>;
	getUserSubmissionById(id: number): Promise<UserSubmission | null>;
	getUserSubmissionsOverviewByUser(
		userId: string,
	): Promise<UserSubmissionOverview[]>;
	updateUserSubmission(
		id: number,
		updates: { updatedAt: Date },
		tx?: any,
	): Promise<UserSubmissionWithoutTests>;
	deleteUserSubmission(id: number, tx?: any): Promise<void>;
	deleteUserSubmissionsByTestBatchId(
		testBatchId: number,
		tx?: any,
	): Promise<void>;
}

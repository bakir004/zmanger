import { createModule } from "@evyweb/ioctopus";

import { createUserSubmissionController } from "~/interface-adapters/controllers/user-submissions/create-user-submission.controller";
import { getUserSubmissionsOverviewController } from "~/interface-adapters/controllers/user-submissions/get-user-submissions-overview.controller";
import { getUserSubmissionByBatchController } from "~/interface-adapters/controllers/user-submissions/get-user-submission-by-batch.controller";

import { DI_SYMBOLS } from "di/types";
import { UserSubmissionsRepository } from "~/infrastructure/repositories/user-submissions.repository";
import { createUserSubmissionUseCase } from "~/application/use-cases/user-submissions/create-user-submission.use-case";
import { getUserSubmissionsOverviewUseCase } from "~/application/use-cases/user-submissions/get-user-submissions-overview.use-case";
import { getUserSubmissionByBatchUseCase } from "~/application/use-cases/user-submissions/get-user-submission-by-batch.use-case";

export function createUserSubmissionsModule() {
	const userSubmissionsModule = createModule();

	userSubmissionsModule
		.bind(DI_SYMBOLS.IUserSubmissionsRepository)
		.toClass(UserSubmissionsRepository, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ICrashReporterService,
		]);

	userSubmissionsModule
		.bind(DI_SYMBOLS.ICreateUserSubmissionController)
		.toHigherOrderFunction(createUserSubmissionController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ICreateUserSubmissionUseCase,
		]);

	userSubmissionsModule
		.bind(DI_SYMBOLS.ICreateUserSubmissionUseCase)
		.toHigherOrderFunction(createUserSubmissionUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ITransactionManagerService,
			DI_SYMBOLS.IUserSubmissionsRepository,
		]);

	userSubmissionsModule
		.bind(DI_SYMBOLS.IGetUserSubmissionsOverviewController)
		.toHigherOrderFunction(getUserSubmissionsOverviewController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IGetUserSubmissionsOverviewUseCase,
		]);

	userSubmissionsModule
		.bind(DI_SYMBOLS.IGetUserSubmissionsOverviewUseCase)
		.toHigherOrderFunction(getUserSubmissionsOverviewUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IUserSubmissionsRepository,
		]);

	userSubmissionsModule
		.bind(DI_SYMBOLS.IGetUserSubmissionByBatchController)
		.toHigherOrderFunction(getUserSubmissionByBatchController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IGetUserSubmissionByBatchUseCase,
		]);

	userSubmissionsModule
		.bind(DI_SYMBOLS.IGetUserSubmissionByBatchUseCase)
		.toHigherOrderFunction(getUserSubmissionByBatchUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IUserSubmissionsRepository,
		]);

	return userSubmissionsModule;
}

import { createModule } from "@evyweb/ioctopus";
import { LanguageMapperService } from "src/infrastructure/services/language-mapper.service";
import { DI_SYMBOLS } from "di/types";
import { CodeJudgeService } from "~/infrastructure/services/code-judge.service";
import { ClerkService } from "~/infrastructure/services/clerk.service";
import { runSingleTestController } from "~/interface-adapters/controllers/tests/run-single-test.controller";
import { getUsersFromClerkUseCase } from "~/application/use-cases/users/get-users-from-clerk.use-case";
import { getUsersFromClerkController } from "~/interface-adapters/controllers/users/get-users-from-clerk.controller";
import { updateUserRoleUseCase } from "~/application/use-cases/users/update-user-role.use-case";
import { updateUserRoleController } from "~/interface-adapters/controllers/users/update-user-role.controller";
import { updateUserPlanUseCase } from "~/application/use-cases/users/update-user-plan.use-case";
import { updateUserPlanController } from "~/interface-adapters/controllers/users/update-user-plan.controller";

export function createExternalServicesModule() {
	const externalServicesModule = createModule();

	externalServicesModule
		.bind(DI_SYMBOLS.ILanguageMapperService)
		.toClass(LanguageMapperService);

	externalServicesModule
		.bind(DI_SYMBOLS.ICodeJudgeService)
		.toClass(CodeJudgeService, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ICrashReporterService,
		]);

	externalServicesModule
		.bind(DI_SYMBOLS.IClerkService)
		.toClass(ClerkService, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.ICrashReporterService,
		]);

	externalServicesModule
		.bind(DI_SYMBOLS.IGetUsersFromClerkUseCase)
		.toHigherOrderFunction(getUsersFromClerkUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IClerkService,
		]);

	externalServicesModule
		.bind(DI_SYMBOLS.IGetUsersFromClerkController)
		.toHigherOrderFunction(getUsersFromClerkController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IGetUsersFromClerkUseCase,
		]);

	externalServicesModule
		.bind(DI_SYMBOLS.IUpdateUserRoleUseCase)
		.toHigherOrderFunction(updateUserRoleUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IClerkService,
		]);

	externalServicesModule
		.bind(DI_SYMBOLS.IUpdateUserRoleController)
		.toHigherOrderFunction(updateUserRoleController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IUpdateUserRoleUseCase,
		]);

	externalServicesModule
		.bind(DI_SYMBOLS.IUpdateUserPlanUseCase)
		.toHigherOrderFunction(updateUserPlanUseCase, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IClerkService,
		]);

	externalServicesModule
		.bind(DI_SYMBOLS.IUpdateUserPlanController)
		.toHigherOrderFunction(updateUserPlanController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IUpdateUserPlanUseCase,
		]);

	externalServicesModule
		.bind(DI_SYMBOLS.IRunSingleTestController)
		.toHigherOrderFunction(runSingleTestController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IRunSingleTestUseCase,
		]);

	return externalServicesModule;
}

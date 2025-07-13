import { createModule } from "@evyweb/ioctopus";
import { LanguageMapperService } from "src/infrastructure/services/language-mapper.service";
import { DI_SYMBOLS } from "di/types";
import { CodeJudgeService } from "~/infrastructure/services/code-judge.service";
import { runSingleTestController } from "~/interface-adapters/controllers/run-single-test.controller";

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
		.bind(DI_SYMBOLS.IRunSingleTestController)
		.toHigherOrderFunction(runSingleTestController, [
			DI_SYMBOLS.IInstrumentationService,
			DI_SYMBOLS.IRunSingleTestUseCase,
		]);

	return externalServicesModule;
}

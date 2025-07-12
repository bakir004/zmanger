import { createModule } from "@evyweb/ioctopus";

import { createTestBatchController } from "~/interface-adapters/controllers/create-test-batch.controller";

import { DI_SYMBOLS } from "di/types";
import { InstrumentationService } from "~/infrastructure/services/instrumentation.service";

export function createTestsModule() {
	const testsModule = createModule();

	// BINDANJE KONTROLERA I USE CASEOVA

	testsModule
		.bind(DI_SYMBOLS.ICreateTestBatchController)
		.toHigherOrderFunction(createTestBatchController, [
			DI_SYMBOLS.IInstrumentationService,
			// DI_SYMBOLS.IAuthenticationService,
			// DI_SYMBOLS.ITransactionManagerService,
			// DI_SYMBOLS.ICreateTodoUseCase,
		]);

	return testsModule;
}

import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { ICrashReporterService } from "~/application/services/crash-reporter.service.interface";
import type { ICreateTestBatchController } from "~/interface-adapters/controllers/create-test-batch.controller";

export const DI_SYMBOLS = {
	// Services
	IInstrumentationService: Symbol.for("IInstrumentationService"),
	ICrashReporterService: Symbol.for("ICrashReporterService"),

	// Controllers
	ICreateTestBatchController: Symbol.for("ICreateTestBatchController"),
};
export interface DI_RETURN_TYPES {
	// Services
	IInstrumentationService: IInstrumentationService;
	ICrashReporterService: ICrashReporterService;

	// Controllers
	ICreateTestBatchController: ICreateTestBatchController;
}

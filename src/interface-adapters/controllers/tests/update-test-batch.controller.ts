import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IUpdateTestBatchUseCase } from "~/application/use-cases/tests/update-test-batch.use-case";
import type {
	TestBatchUpdate,
	TestBatchWithoutTests,
} from "~/entities/models/test-batch";

export type IUpdateTestBatchController = ReturnType<
	typeof updateTestBatchController
>;

export const updateTestBatchController =
	(
		instrumentationService: IInstrumentationService,
		updateTestBatchUseCase: IUpdateTestBatchUseCase,
	) =>
	async (
		id: number,
		updates: TestBatchUpdate,
	): Promise<TestBatchWithoutTests> => {
		return await instrumentationService.startSpan(
			{
				name: "updateTestBatchController",
			},
			async () => {
				return await updateTestBatchUseCase(id, updates);
			},
		);
	};

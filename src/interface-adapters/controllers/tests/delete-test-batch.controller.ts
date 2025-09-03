import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IDeleteTestBatchUseCase } from "~/application/use-cases/tests/delete-test-batch.use-case";
import { UnauthenticatedError } from "~/entities/errors/auth";

export type IDeleteTestBatchController = ReturnType<
	typeof deleteTestBatchController
>;

export const deleteTestBatchController =
	(
		instrumentationService: IInstrumentationService,
		deleteTestBatchUseCase: IDeleteTestBatchUseCase,
	) =>
	async (id: number): Promise<void> => {
		return await instrumentationService.startSpan(
			{
				name: "deleteTestBatchController",
			},
			async () => {
				await deleteTestBatchUseCase({ id });
			},
		);
	};

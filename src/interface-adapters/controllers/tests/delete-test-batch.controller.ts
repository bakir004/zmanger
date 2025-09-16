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
	async (userId: string | undefined, id: number): Promise<void> => {
		return await instrumentationService.startSpan(
			{
				name: "deleteTestBatchController",
			},
			async () => {
				if (!userId)
					throw new UnauthenticatedError(
						"Must be logged in to delete test batch",
					);

				await deleteTestBatchUseCase({ id });
			},
		);
	};

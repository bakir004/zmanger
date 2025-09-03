import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IDeleteTestUseCase } from "~/application/use-cases/tests/delete-test.use-case";

export type IDeleteTestController = ReturnType<typeof deleteTestController>;

export const deleteTestController =
	(
		instrumentationService: IInstrumentationService,
		deleteTestUseCase: IDeleteTestUseCase,
	) =>
	async (id: number): Promise<void> => {
		return await instrumentationService.startSpan(
			{
				name: "deleteTestController",
			},
			async () => {
				return await deleteTestUseCase(id);
			},
		);
	};

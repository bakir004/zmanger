import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IUpdateTestUseCase } from "~/application/use-cases/tests/update-test.use-case";
import type { Test, TestUpdate } from "~/entities/models/test";

export type IUpdateTestController = ReturnType<typeof updateTestController>;

export const updateTestController =
	(
		instrumentationService: IInstrumentationService,
		updateTestUseCase: IUpdateTestUseCase,
	) =>
	async (id: number, updates: TestUpdate): Promise<Test> => {
		return await instrumentationService.startSpan(
			{
				name: "updateTestController",
			},
			async () => {
				return await updateTestUseCase(id, updates);
			},
		);
	};

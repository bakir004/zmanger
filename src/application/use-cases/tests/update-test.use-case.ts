import type { ITestsRepository } from "~/application/repositories/tests.repository.interface";
import type { Test, TestUpdate } from "~/entities/models/test";

export type IUpdateTestUseCase = ReturnType<typeof updateTestUseCase>;

export const updateTestUseCase =
	(testsRepository: ITestsRepository) =>
	async (id: number, updates: TestUpdate): Promise<Test> => {
		return await testsRepository.updateTest(id, updates);
	};

import type { ITestsRepository } from "~/application/repositories/tests.repository.interface";

export type IDeleteTestUseCase = ReturnType<typeof deleteTestUseCase>;

export const deleteTestUseCase =
	(testsRepository: ITestsRepository) =>
	async (id: number): Promise<void> => {
		return await testsRepository.deleteTest(id);
	};

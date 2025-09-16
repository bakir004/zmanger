import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type {
	TestBatchInsert,
	TestBatchWithoutTests,
} from "~/entities/models/test-batch";
import type { ITestBatchesRepository } from "../../repositories/test-batches.repository.interface";
import type { Transaction } from "drizzle";
import { clerkClient } from "@clerk/nextjs/server";
import { UnauthorizedError } from "~/entities/errors/auth";

export type ICreateTestBatchUseCase = ReturnType<typeof createTestBatchUseCase>;

export const createTestBatchUseCase =
	(
		instrumentationService: IInstrumentationService,
		testBatchesRepository: ITestBatchesRepository,
	) =>
	(
		userId: string,
		input: {
			testBatch: TestBatchInsert;
		},
		tx?: Transaction,
	): Promise<TestBatchWithoutTests> => {
		return instrumentationService.startSpan(
			{ name: "createTestBatchUseCase", op: "function" },
			async () => {
				const clerk = await clerkClient();
				const user = await clerk.users.getUser(userId);
				const userRole: string = (user.publicMetadata as any)?.role;

				if (!["admin", "moderator"].includes(userRole))
					throw new UnauthorizedError(
						"User is not allowed to create test batches",
					);

				const createdTestBatch = await testBatchesRepository.createTestBatch(
					input.testBatch,
					tx,
				);

				return {
					id: createdTestBatch.id,
					name: createdTestBatch.name,
					subject: createdTestBatch.subject,
					language: createdTestBatch.language,
					public: createdTestBatch.public,
				};
			},
		);
	};

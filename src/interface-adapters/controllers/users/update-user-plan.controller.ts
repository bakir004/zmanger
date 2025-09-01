import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IUpdateUserPlanUseCase } from "~/application/use-cases/users/update-user-plan.use-case";

export type IUpdateUserPlanController = ReturnType<
	typeof updateUserPlanController
>;

export const updateUserPlanController =
	(
		instrumentationService: IInstrumentationService,
		updateUserPlanUseCase: IUpdateUserPlanUseCase,
	) =>
	async (clerkUserId: string, plan: string): Promise<void> => {
		return await instrumentationService.startSpan(
			{
				name: "updateUserPlanController",
			},
			async () => {
				return await updateUserPlanUseCase(clerkUserId, plan);
			},
		);
	};

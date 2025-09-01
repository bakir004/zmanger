import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IClerkService } from "~/application/services/clerk.service.interface";

export type IUpdateUserPlanUseCase = ReturnType<typeof updateUserPlanUseCase>;

export const updateUserPlanUseCase =
	(
		instrumentationService: IInstrumentationService,
		clerkService: IClerkService,
	) =>
	(clerkUserId: string, plan: string): Promise<void> => {
		return instrumentationService.startSpan(
			{ name: "updateUserPlan", op: "function" },
			async () => {
				return await clerkService.updateUserPlan(clerkUserId, plan);
			},
		);
	};

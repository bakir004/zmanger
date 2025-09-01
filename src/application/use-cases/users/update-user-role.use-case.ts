import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IClerkService } from "~/application/services/clerk.service.interface";

export type IUpdateUserRoleUseCase = ReturnType<typeof updateUserRoleUseCase>;

export const updateUserRoleUseCase =
	(
		instrumentationService: IInstrumentationService,
		clerkService: IClerkService,
	) =>
	(clerkUserId: string, role: string): Promise<void> => {
		return instrumentationService.startSpan(
			{ name: "updateUserRole", op: "function" },
			async () => {
				return await clerkService.updateUserRole(clerkUserId, role);
			},
		);
	};

import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IUpdateUserRoleUseCase } from "~/application/use-cases/users/update-user-role.use-case";

export type IUpdateUserRoleController = ReturnType<
	typeof updateUserRoleController
>;

export const updateUserRoleController =
	(
		instrumentationService: IInstrumentationService,
		updateUserRoleUseCase: IUpdateUserRoleUseCase,
	) =>
	async (clerkUserId: string, role: string): Promise<void> => {
		return await instrumentationService.startSpan(
			{
				name: "updateUserRoleController",
			},
			async () => {
				return await updateUserRoleUseCase(clerkUserId, role);
			},
		);
	};

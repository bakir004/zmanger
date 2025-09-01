import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type { IGetUsersFromClerkUseCase } from "~/application/use-cases/users/get-users-from-clerk.use-case";
import type { ClerkUser } from "~/application/services/clerk.service.interface";

export type IGetUsersFromClerkController = ReturnType<
	typeof getUsersFromClerkController
>;

export const getUsersFromClerkController =
	(
		instrumentationService: IInstrumentationService,
		getUsersFromClerkUseCase: IGetUsersFromClerkUseCase,
	) =>
	async (): Promise<ClerkUser[]> => {
		return await instrumentationService.startSpan(
			{
				name: "getUsersFromClerkController",
			},
			async () => {
				return await getUsersFromClerkUseCase();
			},
		);
	};

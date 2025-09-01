import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";
import type {
	IClerkService,
	ClerkUser,
} from "~/application/services/clerk.service.interface";

export type IGetUsersFromClerkUseCase = ReturnType<
	typeof getUsersFromClerkUseCase
>;

export const getUsersFromClerkUseCase =
	(
		instrumentationService: IInstrumentationService,
		clerkService: IClerkService,
	) =>
	(): Promise<ClerkUser[]> => {
		return instrumentationService.startSpan(
			{ name: "getUsersFromClerk", op: "function" },
			async () => {
				return await clerkService.getAllUsers();
			},
		);
	};

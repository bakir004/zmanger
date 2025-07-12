import { createContainer } from "@evyweb/ioctopus";

import { type DI_RETURN_TYPES, DI_SYMBOLS } from "di/types";

import { createTestsModule } from "./modules/tests.module";
import { createMonitoringModule } from "./modules/monitoring.module";
import { createTransactionManagerModule } from "./modules/database.module";
import type { IInstrumentationService } from "~/application/services/instrumentation.service.interface";

const ApplicationContainer = createContainer();

ApplicationContainer.load(Symbol("TestsModule"), createTestsModule());
ApplicationContainer.load(Symbol("MonitoringModule"), createMonitoringModule());
ApplicationContainer.load(
	Symbol("TransactionManagerModule"),
	createTransactionManagerModule(),
);

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
	symbol: K,
): DI_RETURN_TYPES[K] {
	const instrumentationService =
		ApplicationContainer.get<IInstrumentationService>(
			DI_SYMBOLS.IInstrumentationService,
		);

	return instrumentationService.startSpan(
		{
			name: "(di) getInjection",
			op: "function",
			attributes: { symbol: symbol.toString() },
		},
		() => ApplicationContainer.get(DI_SYMBOLS[symbol]),
	);
}

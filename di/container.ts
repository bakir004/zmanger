import { createContainer } from "@evyweb/ioctopus";

import { type DI_RETURN_TYPES, DI_SYMBOLS } from "di/types";

import { createTestsModule } from "./modules/tests.module";
import { createMonitoringModule } from "./modules/monitoring.module";
import { createTransactionManagerModule } from "./modules/database.module";

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
	return ApplicationContainer.get(DI_SYMBOLS[symbol]);
}

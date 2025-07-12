import { createModule } from "@evyweb/ioctopus";

import { TransactionManagerService } from "src/infrastructure/services/transaction-manager.service";

import { DI_SYMBOLS } from "di/types";

export function createTransactionManagerModule() {
	const transactionManagerModule = createModule();

	transactionManagerModule
		.bind(DI_SYMBOLS.ITransactionManagerService)
		.toClass(TransactionManagerService);

	return transactionManagerModule;
}

import type { Transaction } from "drizzle";

export interface ITransactionManagerService {
	startTransaction<T>(
		clb: (tx: Transaction) => Promise<T>,
		parent?: Transaction,
	): Promise<T>;
}

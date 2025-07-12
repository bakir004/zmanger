import type { ICreateTestBatchController } from "~/interface-adapters/controllers/create-test-batch.controller";

export const DI_SYMBOLS = {
	// Controllers
	ICreateTestBatchController: Symbol.for("ICreateTestBatchController"),
};
export interface DI_RETURN_TYPES {
	// Controllers
	ICreateTestBatchController: ICreateTestBatchController;
}

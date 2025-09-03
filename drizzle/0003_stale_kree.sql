ALTER TABLE "zmanger_test" DROP CONSTRAINT "zmanger_test_testBatchId_zmanger_test_batch_id_fk";
--> statement-breakpoint
ALTER TABLE "zmanger_test" ADD CONSTRAINT "zmanger_test_testBatchId_zmanger_test_batch_id_fk" FOREIGN KEY ("testBatchId") REFERENCES "public"."zmanger_test_batch"("id") ON DELETE cascade ON UPDATE no action;
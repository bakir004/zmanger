ALTER TABLE "zmanger_files" DROP CONSTRAINT "zmanger_files_parentId_zmanger_files_id_fk";
--> statement-breakpoint
ALTER TABLE "zmanger_files" ADD CONSTRAINT "zmanger_files_parentId_zmanger_files_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."zmanger_files"("id") ON DELETE cascade ON UPDATE no action;
import { AddTestsForm } from "./_components/add-tests-form";
import { Check, CheckCheck, Dot, Plus, Upload } from "lucide-react";
import ImportTestsDialog from "./_components/import-tests-dialog";

export default function Page() {
	return (
		<main className="px-6">
			<h1 className="mb-4 text-lg font-bold">Dodaj testove</h1>
			<ImportTestsDialog />
			<div className="flex flex-wrap gap-2 text-sm my-4 border rounded-md p-2">
				{[...Array(20)].map((item, i) => (
					<div
						className="w-fit flex items-center gap-1 text-nowrap border hover:bg-muted px-2 py-1 rounded cursor-pointer bg-background transition"
						key={i}
					>
						Test {i + 1}
						<CheckCheck className="w-4 h-4 text-green-400" />
					</div>
				))}
				<div className="w-fit flex items-center gap-1 text-nowrap border hover:bg-white/30 px-2 py-1 rounded cursor-pointer border-dashed bg-white/20 border-white/50 transition">
					<Plus className="w-4 h-4" />
					Dodaj test
				</div>
			</div>
			<AddTestsForm />
		</main>
	);
}

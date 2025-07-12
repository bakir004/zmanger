"use client";
import {
	Check,
	CheckCheck,
	Dot,
	EyeOff,
	Plus,
	Save,
	TriangleAlert,
	Upload,
	X,
} from "lucide-react";
import ImportTestsDialog from "./_components/import-tests-dialog";
import AddTestsEditors from "./_components/add-tests-editors";
import type { Test, Tests } from "./_utils/formatter";
import { useState, useCallback } from "react";
import { Button } from "app/_components/ui/button";
import { Checkbox } from "app/_components/ui/checkbox";
import { Input } from "app/_components/ui/input";

export default function Page() {
	const [testObject, setTestObject] = useState<Tests>({
		name: "",
		tests: [],
		languages: [],
	});
	const [selectedTestId, setSelectedTestId] = useState<number | undefined>();

	const getTestsFromImportDialog = (receivedTestsObject: Tests) => {
		setTestObject(receivedTestsObject);
		setSelectedTestId(receivedTestsObject.tests[0]?.id ?? 1);
	};

	const addTest = () => {
		setTestObject((prev) => {
			const newId = (prev.tests[prev.tests.length - 1]?.id ?? 0) + 1;
			setSelectedTestId(newId);
			return {
				...prev,
				tests: [
					...prev.tests,
					{
						id: newId,
						code: {
							topOfFile: "",
							aboveMain: "",
							main: "",
						},
						stdin: "",
						expectedOutput: [],
						hidden: false,
					},
				],
			};
		});
	};

	const updateTest = useCallback((testId: number, updatedTest: Test) => {
		setTestObject((prev) => ({
			...prev,
			tests: prev.tests.map((test) =>
				test.id === testId ? updatedTest : test,
			),
		}));
	}, []);

	const handleHiddenToggle = useCallback(
		(checked: boolean) => {
			if (selectedTestId !== undefined) {
				const currentTest = testObject.tests.find(
					(t) => t.id === selectedTestId,
				);
				if (currentTest) {
					const updatedTest = {
						...currentTest,
						hidden: checked,
					};
					updateTest(selectedTestId, updatedTest);
				}
			}
		},
		[selectedTestId, testObject.tests, updateTest],
	);

	// Get the currently selected test
	const selectedTest = selectedTestId
		? testObject.tests.find((test) => test.id === selectedTestId)
		: undefined;

	return (
		<main className="px-6">
			<h1 className="mb-4 text-lg font-bold">Dodaj testove</h1>
			<div className="mb-4 flex items-center justify-between">
				<ImportTestsDialog sendTests={getTestsFromImportDialog} />
				<Button
					disabled={
						!selectedTest ||
						testObject.name === "" ||
						testObject.tests.length === 0
					}
					className="flex items-center gap-2 cursor-pointer bg-primary-gradient"
				>
					Sačuvaj testove
					<Save className="w-4 h-4" />
				</Button>
			</div>
			<div className="flex items-center gap-2">
				<Input
					onChange={(e) =>
						setTestObject({ ...testObject, name: e.target.value })
					}
					className="max-w-sm"
					placeholder="Naziv testova"
				/>
			</div>
			<div className="flex flex-wrap gap-2 text-sm my-4 border rounded-md p-2">
				{testObject.tests.map((test: Test) => (
					<button
						type="button"
						className={`${test.id === selectedTestId ? "bg-muted" : "bg-background"} w-fit flex items-center gap-1 text-nowrap border hover:bg-muted px-2 py-1 rounded cursor-pointer transition`}
						key={test.id}
						onClick={() => setSelectedTestId(test.id)}
					>
						Test {test.id}
						{test.hidden && <EyeOff className="w-4 h-4 text-blue-400" />}
						{test.code.main === "" || test.expectedOutput.length === 0 ? (
							<TriangleAlert className="w-4 h-4 text-red-400" />
						) : (
							<CheckCheck className="w-4 h-4 text-green-400" />
						)}
					</button>
				))}
				<button
					onClick={addTest}
					type="button"
					className="w-fit flex items-center gap-1 text-nowrap border hover:bg-white/30 px-2 py-1 rounded cursor-pointer border-dashed bg-white/20 border-white/50 transition"
				>
					<Plus className="w-4 h-4" />
					Dodaj test
				</button>
			</div>
			<section>
				{selectedTestId !== undefined && selectedTest ? (
					<>
						<div className="flex items-center gap-4 mb-4">
							<h4 className="text-xl font-bold">Test {selectedTestId}</h4>
							<div className="flex items-center space-x-2">
								<Checkbox
									id="hidden"
									checked={selectedTest.hidden}
									onCheckedChange={handleHiddenToggle}
								/>
								<label
									htmlFor="hidden"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									Skriven test
								</label>
							</div>
						</div>
						<div className="h-[600px] pb-16">
							<AddTestsEditors test={selectedTest} onTestUpdate={updateTest} />
						</div>
					</>
				) : (
					<p className="italic opacity-70">
						Odaberite test za uređivanje iz liste iznad...
					</p>
				)}
			</section>
		</main>
	);
}

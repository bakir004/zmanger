"use client";
import {
	CheckCheck,
	EyeOff,
	Plus,
	RefreshCcw,
	Save,
	TriangleAlert,
	X,
} from "lucide-react";
import ImportTestsDialog from "./_components/import-tests-dialog";
import AddTestsEditors from "./_components/add-tests-editors";
import type { Test, Tests } from "./_utils/formatter";
import { useState, useCallback } from "react";
import { Button } from "app/_components/ui/button";
import { Checkbox } from "app/_components/ui/checkbox";
import { Input } from "app/_components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "app/_components/ui/select";
import { createTestBatch } from "./actions";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "app/_components/ui/tooltip";
import { useRouter } from "next/navigation";

export default function Page() {
	const router = useRouter();
	const [testObject, setTestObject] = useState<Tests>({
		name: "",
		subject: "",
		public: false,
		tests: [],
		language: "",
	});
	const [selectedTestId, setSelectedTestId] = useState<number | undefined>();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const getTestsFromImportDialog = (receivedTestsObject: Tests) => {
		// Sort imported tests by ID to ensure proper order
		const sortedTestsObject = {
			...receivedTestsObject,
			tests: receivedTestsObject.tests.sort((a, b) => a.id - b.id),
		};
		setTestObject(sortedTestsObject);
		setSelectedTestId(sortedTestsObject.tests[0]?.id ?? 1);
	};

	const addTest = () => {
		setTestObject((prev) => {
			const newId = (prev.tests[prev.tests.length - 1]?.id ?? 0) + 1;
			setSelectedTestId(newId);
			const updatedTests = [
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
			];
			return {
				...prev,
				tests: updatedTests.sort((a, b) => a.id - b.id),
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

	const submit = async () => {
		try {
			setIsSubmitting(true);
			await createTestBatch(testObject);
			router.push("/dashboard/testovi");
		} catch (error) {
			console.error("Failed to create test batch:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const updateTestNumbers = () => {
		setTestObject((prev) => {
			const newTests = prev.tests.map((test, index) => ({
				...test,
				id: index + 1,
			}));
			setSelectedTestId(newTests[0]?.id ?? 1);
			return {
				...prev,
				tests: newTests,
			};
		});
	};

	const deleteTest = (e: React.MouseEvent<SVGSVGElement>, testId: number) => {
		e.stopPropagation();
		setTestObject((prev) => ({
			...prev,
			tests: prev.tests.filter((t) => t.id !== testId),
		}));
		if (testId === selectedTestId) {
			setSelectedTestId(undefined);
		}
	};

	return (
		<main className="px-6">
			<h1 className="mb-4 text-lg font-bold">Dodaj testove</h1>
			<div className="mb-4 flex gap-2 flex-wrap items-center">
				<ImportTestsDialog sendTests={getTestsFromImportDialog} />
				<Input
					onChange={(e) =>
						setTestObject({ ...testObject, name: e.target.value })
					}
					className="w-fit"
					placeholder="Naziv testova"
				/>
				<Select
					onValueChange={(value) =>
						setTestObject({ ...testObject, language: value })
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Jezik" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="cpp">C++</SelectItem>
						<SelectItem value="c">C</SelectItem>
					</SelectContent>
				</Select>
				<Select
					onValueChange={(value) =>
						setTestObject({ ...testObject, subject: value })
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Predmet" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="tp">TP</SelectItem>
						<SelectItem value="asp">ASP</SelectItem>
						<SelectItem value="uup">UUP</SelectItem>
						<SelectItem value="na">NA</SelectItem>
					</SelectContent>
				</Select>
				<Button
					disabled={
						isSubmitting ||
						!selectedTest ||
						testObject.name === "" ||
						testObject.tests.length === 0 ||
						testObject.subject === "" ||
						testObject.language === ""
					}
					className="flex items-center gap-2 cursor-pointer bg-primary-gradient"
					onClick={submit}
				>
					{isSubmitting ? "Čuvam..." : "Sačuvaj testove"}
					<Save className="w-4 h-4" />
				</Button>
			</div>
			<div className="flex flex-wrap gap-2 text-sm my-4 border rounded-md p-2">
				{testObject.tests.map((test: Test) => (
					<button
						type="button"
						className={`${test.id === selectedTestId ? "bg-muted" : "bg-background"} group w-fit flex items-center gap-1 text-nowrap border hover:bg-muted px-2 py-1 rounded cursor-pointer transition`}
						key={test.id}
						onClick={() => setSelectedTestId(test.id)}
					>
						Test {test.id}
						{test.hidden && <EyeOff className="w-4 h-4 text-blue-400" />}
						<div className="group-hover:hidden">
							{test.code.main === "" || test.expectedOutput.length === 0 ? (
								<TriangleAlert className="w-4 h-4 text-red-400" />
							) : (
								<CheckCheck className="w-4 h-4 text-green-400" />
							)}
						</div>
						<X
							className="w-4 h-4 text-red-500 hidden group-hover:block hover:text-red-700 transition-colors"
							onMouseDown={(e) => deleteTest(e, test.id)}
						/>
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
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							onClick={updateTestNumbers}
							variant="outline"
							className="w-fit flex items-center gap-1 text-nowrap px-2 py-1 rounded cursor-pointer transition"
						>
							<RefreshCcw className="w-4 h-4" />
							Ažuriraj redne brojeve
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p className="text-center">
							Ažuriraj redne brojeve testova sekvencijalno od 1<br />
							<span className="italic">
								(Svakako će studentima biti prikazani sekvencijalno)
							</span>
						</p>
					</TooltipContent>
				</Tooltip>
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

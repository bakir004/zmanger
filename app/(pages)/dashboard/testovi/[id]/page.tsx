"use client";

import { useParams, useRouter } from "next/navigation";
import { useTestBatches } from "../hooks/use-test-batches";
import { useTestsByBatchId } from "../hooks/use-tests-by-batch-id";
import { useUpdateTestBatch } from "../hooks/use-update-test-batch";
import { useUpdateTest } from "../hooks/use-update-test";
import { useDeleteTest } from "../hooks/use-delete-test";
import { useCreateTest } from "../hooks/use-create-test";
import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "app/_components/ui/tooltip";
import {
	ArrowLeft,
	CheckCheck,
	EyeOff,
	Plus,
	Save,
	TriangleAlert,
	X,
	RefreshCcw,
	LoaderCircle,
} from "lucide-react";
import Link from "next/link";
import EditTestsEditors from "./_components/edit-tests-editors";
import type { Test } from "../dodaj/_utils/formatter";

export default function EditTestBatchPage() {
	const params = useParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const batchId = Number.parseInt(params.id as string, 10);

	const { data: testBatches, isLoading: batchesLoading } = useTestBatches();
	const { data: tests, isLoading: testsLoading } = useTestsByBatchId(batchId);
	const updateTestBatch = useUpdateTestBatch();
	const updateTest = useUpdateTest();
	const deleteTest = useDeleteTest();
	const createTest = useCreateTest();

	const [selectedTestId, setSelectedTestId] = useState<number | undefined>();
	const [localTestBatch, setLocalTestBatch] = useState({
		name: "",
		subject: "",
		language: "",
		public: false,
	});
	const [localTests, setLocalTests] = useState<Test[]>([]);

	// Initialize local state when data loads
	useEffect(() => {
		if (testBatches && tests) {
			const batch = testBatches.find((b) => b.id === batchId);
			if (batch) {
				setLocalTestBatch({
					name: batch.name,
					subject: batch.subject,
					language: batch.language,
					public: batch.public,
				});
			}

			// Convert FlatTest to Test format
			const convertedTests: Test[] = tests.map((test) => ({
				id: test.id,
				code: {
					topOfFile: test.code.topOfFile || "",
					aboveMain: test.code.aboveMain || "",
					main: test.code.main || "",
				},
				expectedOutput: Array.isArray(test.expectedOutput)
					? test.expectedOutput
					: [],
				stdin: test.stdin || "",
				hidden: test.hidden || false,
			}));

			// Sort tests by ID to ensure proper order
			const sortedTests = convertedTests.sort((a, b) => a.id - b.id);
			setLocalTests(sortedTests);
			if (sortedTests.length > 0 && sortedTests[0]) {
				setSelectedTestId(sortedTests[0].id);
			}
		}
	}, [testBatches, tests, batchId]);

	const handleTestBatchUpdate = useCallback(
		(field: keyof typeof localTestBatch, value: string | boolean) => {
			setLocalTestBatch((prev) => ({ ...prev, [field]: value }));
		},
		[],
	);

	const updateLocalTest = useCallback((testId: number, updatedTest: Test) => {
		setLocalTests((prev) =>
			prev.map((test) => (test.id === testId ? updatedTest : test)),
		);
	}, []);

	const handleHiddenToggle = useCallback(
		(checked: boolean) => {
			if (selectedTestId !== undefined) {
				const currentTest = localTests.find((t) => t.id === selectedTestId);
				if (currentTest) {
					const updatedTest = {
						...currentTest,
						hidden: checked,
					};
					updateLocalTest(selectedTestId, updatedTest);
				}
			}
		},
		[selectedTestId, localTests, updateLocalTest],
	);

	const addTest = () => {
		const newId =
			localTests.length > 0
				? Math.max(...localTests.map((t) => t.id), 0) + 1
				: 1;
		const newTest: Test = {
			id: newId,
			code: {
				topOfFile: "",
				aboveMain: "",
				main: "",
			},
			stdin: "",
			expectedOutput: [],
			hidden: false,
		};
		setLocalTests((prev) => {
			const updated = [...prev, newTest];
			return updated.sort((a, b) => a.id - b.id);
		});
		setSelectedTestId(newId);
	};

	const deleteLocalTest = async (
		e: React.MouseEvent<SVGSVGElement>,
		testId: number,
	) => {
		e.stopPropagation();

		try {
			// Check if this test exists in the original tests data (from database)
			const existsInDatabase = tests?.some((t) => t.id === testId);

			if (existsInDatabase) {
				// Delete from database first if it exists there
				await deleteTest.mutateAsync({ id: testId, batchId });
			}

			// Then remove from local state
			setLocalTests((prev) => prev.filter((t) => t.id !== testId));
			if (testId === selectedTestId) {
				const remainingTests = localTests.filter((t) => t.id !== testId);
				setSelectedTestId(
					remainingTests.length > 0 ? remainingTests[0]?.id : undefined,
				);
			}
		} catch (error) {
			console.error("Error deleting test:", error);
			// You could add a toast notification here for better UX
		}
	};

	const updateTestNumbers = () => {
		setLocalTests((prev) => {
			const newTests = prev.map((test, index) => ({
				...test,
				id: index + 1,
			}));
			setSelectedTestId(newTests[0]?.id ?? 1);
			return newTests;
		});
	};

	const saveChanges = async () => {
		try {
			// Update test batch
			await updateTestBatch.mutateAsync({
				id: batchId,
				updates: localTestBatch,
			});

			// Update existing tests and create new ones in parallel
			await Promise.all(
				localTests.map(async (test) => {
					const existsInDatabase = tests?.some((t) => t.id === test.id);

					if (existsInDatabase) {
						// Update existing test
						return updateTest.mutateAsync({
							id: test.id,
							batchId: batchId,
							updates: {
								topOfFile: test.code.topOfFile,
								aboveMain: test.code.aboveMain,
								main: test.code.main,
								stdin: test.stdin,
								expectedOutput: test.expectedOutput,
								hidden: test.hidden,
							},
						});
					}
					// Create new test
					return createTest.mutateAsync({
						testBatchId: batchId,
						topOfFile: test.code.topOfFile,
						aboveMain: test.code.aboveMain,
						main: test.code.main,
						stdin: test.stdin,
						expectedOutput: test.expectedOutput,
						hidden: test.hidden,
					});
				}),
			);

			// Ensure cache is properly updated after all mutations complete
			await queryClient.invalidateQueries({ queryKey: ["testBatches"] });
			await queryClient.invalidateQueries({
				queryKey: ["testsByBatchId", batchId],
			});

			// Redirect back to test batches list
			router.push("/dashboard/testovi");
		} catch (error) {
			console.error("Error saving changes:", error);
			// You could add a toast notification here for better UX
		}
	};

	const selectedTest =
		selectedTestId && localTests.length > 0
			? localTests.find((test) => test.id === selectedTestId)
			: undefined;

	if (batchesLoading || testsLoading) {
		return (
			<div className="px-6">
				<div className="animate-pulse space-y-4">
					<div className="h-8 bg-muted rounded w-1/3" />
					<div className="h-6 bg-muted rounded w-1/2" />
					<div className="h-4 bg-muted rounded w-1/4" />
				</div>
			</div>
		);
	}

	if (!testBatches || !tests || tests.length === 0) {
		return (
			<div className="px-6">
				<div className="text-center py-8">
					<p className="text-muted-foreground">
						{!testBatches
							? "Test batches not found"
							: !tests
								? "Tests not found"
								: "No tests found in this batch"}
					</p>
				</div>
			</div>
		);
	}

	const batch = testBatches.find((b) => b.id === batchId);
	if (!batch) {
		return (
			<div className="px-6">
				<div className="text-center py-8">
					<p className="text-muted-foreground">Test batch not found</p>
					<Link href="/dashboard/testovi">
						<Button variant="outline" className="mt-4">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Test Batches
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<main className="px-6">
			<div className="flex items-center gap-4 mb-4">
				<Link href="/dashboard/testovi">
					<Button variant="ghost" size="sm">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Test Batches
					</Button>
				</Link>
				<h1 className="text-lg font-bold">Edit Test Batch: {batch.name}</h1>
			</div>

			<div className="mb-4 flex gap-2 flex-wrap items-center">
				<Input
					value={localTestBatch.name}
					onChange={(e) => handleTestBatchUpdate("name", e.target.value)}
					className="w-fit"
					placeholder="Naziv testova"
				/>
				<Select
					value={localTestBatch.language}
					onValueChange={(value) => handleTestBatchUpdate("language", value)}
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
					value={localTestBatch.subject}
					onValueChange={(value) => handleTestBatchUpdate("subject", value)}
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
				<Checkbox
					id="public"
					checked={localTestBatch.public}
					onCheckedChange={(checked) =>
						handleTestBatchUpdate("public", checked as boolean)
					}
				/>
				<label htmlFor="public" className="text-sm font-medium">
					Javno
				</label>
				<Button
					disabled={
						localTestBatch.name === "" ||
						localTests.length === 0 ||
						localTestBatch.subject === "" ||
						localTestBatch.language === "" ||
						updateTestBatch.isPending ||
						updateTest.isPending
					}
					className="flex items-center gap-2 cursor-pointer bg-primary-gradient"
					onClick={saveChanges}
				>
					Spasi promjene
					{updateTestBatch.isPending || updateTest.isPending ? (
						<LoaderCircle className="animate-spin h-1 w-1" />
					) : (
						<Save className="w-4 h-4" />
					)}
				</Button>
			</div>

			<div className="flex flex-wrap gap-2 text-sm my-4 border rounded-md p-2">
				{localTests.map((test: Test) => (
					<button
						type="button"
						className={`${
							test.id === selectedTestId ? "bg-muted" : "bg-background"
						} group w-fit flex items-center gap-1 text-nowrap border hover:bg-muted px-2 py-1 rounded cursor-pointer transition`}
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
							onClick={(e) => deleteLocalTest(e, test.id)}
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
							<EditTestsEditors
								test={selectedTest}
								onTestUpdate={updateLocalTest}
							/>
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

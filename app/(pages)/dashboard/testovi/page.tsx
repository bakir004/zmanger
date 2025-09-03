"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "app/_components/ui/card";
import { Badge } from "app/_components/ui/badge";
import { Button } from "app/_components/ui/button";
import {
	Plus,
	Code,
	BookOpen,
	Loader2,
	RefreshCw,
	Globe,
	Lock,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useTestBatches } from "./hooks/use-test-batches";
import { useDeleteTestBatch } from "./hooks/use-delete-test-batch";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "app/_components/ui/dialog";
import { useState } from "react";

function TestBatchesList() {
	const { data: testBatches, isLoading, error, refetch } = useTestBatches();
	const deleteTestBatch = useDeleteTestBatch();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [batchToDelete, setBatchToDelete] = useState<number | null>(null);

	const handleDeleteClick = (batchId: number, e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setBatchToDelete(batchId);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (batchToDelete) {
			try {
				await deleteTestBatch.mutateAsync(batchToDelete);
				setDeleteDialogOpen(false);
				setBatchToDelete(null);
			} catch (error) {
				console.error("Failed to delete test batch:", error);
			}
		}
	};

	if (isLoading) {
		return (
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<Card key={i} className="animate-pulse">
						<CardHeader className="pb-3">
							<div className="space-y-3 mb-3">
								<div className="h-6 bg-muted rounded w-3/4" />
								<div className="h-4 bg-muted rounded w-1/2" />
							</div>
							<div className="flex items-center justify-between">
								<div className="flex gap-2">
									<div className="h-5 bg-muted rounded w-16" />
									<div className="h-5 bg-muted rounded w-20" />
								</div>
								<div className="h-4 bg-muted rounded w-12" />
							</div>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="flex items-center justify-between">
								<div className="h-4 bg-muted rounded w-20" />
								<div className="h-8 bg-muted rounded w-24" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
				<h3 className="text-lg font-semibold mb-2">
					Error loading test batches
				</h3>
				<p className="text-muted-foreground mb-4">
					{error instanceof Error ? error.message : "An error occurred"}
				</p>
				<Button onClick={() => refetch()}>
					<RefreshCw className="h-4 w-4 mr-2" />
					Retry
				</Button>
			</div>
		);
	}

	if (!testBatches || testBatches.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
				<h3 className="text-lg font-semibold mb-2">No test batches found</h3>
				<p className="text-muted-foreground mb-4">
					Get started by creating your first test batch
				</p>
				<Link href="/dashboard/testovi/dodaj">
					<Button>
						<Plus className="h-4 w-4 mr-2" />
						Create Test Batch
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{testBatches.map((batch) => (
				<Card
					key={batch.id}
					className="hover:shadow-md transition-shadow group"
				>
					<CardHeader className="pb-3">
						<div className="flex items-start justify-between mb-3">
							<div className="flex items-start gap-2">
								<CardTitle className="text-xl font-semibold leading-tight">
									{batch.name}
								</CardTitle>
								<CardDescription className="text-base uppercase text-muted-foreground">
									- {batch.subject}
								</CardDescription>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
								onClick={(e) => handleDeleteClick(batch.id, e)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Badge variant="secondary" className="text-sm font-medium">
									{batch.language}
								</Badge>
								<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
									{batch.public ? (
										<>
											<Globe className="h-3 w-3 text-blue-400" />
											<span className="text-blue-400">Public</span>
										</>
									) : (
										<>
											<Lock className="h-3 w-3 text-red-400" />
											<span className="text-red-400">Private</span>
										</>
									)}
								</div>
							</div>
							<div className="text-xs text-muted-foreground">
								ID: {batch.id}
							</div>
						</div>
					</CardHeader>

					<CardContent className="pt-0">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Link href={`/dashboard/testovi/${batch.id}`}>
									<Button variant="outline" size="sm">
										<Code className="h-4 w-4 mr-2" />
										Uredi testove
									</Button>
								</Link>
							</div>
						</div>
					</CardContent>
				</Card>
			))}

			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Obriši testove</DialogTitle>
						<DialogDescription>
							Jeste li sigurni da želite obrisati ove testove? Ova radnja se ne
							može poništiti. Svi testovi unutar ove grupe također će biti
							trajno obrisani.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialogOpen(false)}
							disabled={deleteTestBatch.isPending}
						>
							Otkaži
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteConfirm}
							disabled={deleteTestBatch.isPending}
						>
							{deleteTestBatch.isPending ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Brisanje...
								</>
							) : (
								"Obriši"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default function TestsPage() {
	const { refetch, isLoading } = useTestBatches();

	return (
		<div className="space-y-6 px-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Testovi</h1>
					<p className="text-muted-foreground">
						Upravljajte i organizujte svoje testove
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={() => refetch()}
						disabled={isLoading}
					>
						<RefreshCw
							className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
						/>
						Osvježi
					</Button>
					<Link href="/dashboard/testovi/dodaj">
						<Button>
							<Plus className="h-4 w-4" />
							Kreiraj test
						</Button>
					</Link>
				</div>
			</div>

			<TestBatchesList />
		</div>
	);
}

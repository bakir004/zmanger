"use client";

import dynamic from "next/dynamic";
import { Button } from "app/_components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "app/_components/ui/dialog";
import { Separator } from "app/_components/ui/separator";
import { LoaderCircle, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { testJsonFormatter, type Tests } from "../_utils/formatter";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
	ssr: false,
});

export default function ImportTestsDialog({
	sendTests,
}: { sendTests: (tests: Tests) => void }) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [fileText, setFileText] = useState<string>("");
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [monacoPreloaded, setMonacoPreloaded] = useState(false);

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			setFileText(event.target?.result as string);
		};
		reader.readAsText(file);
	};

	const handleAddTests = () => {
		sendTests(testJsonFormatter(fileText));
	};

	const handleDialogOpen = (isOpen: boolean) => {
		setOpen(isOpen);
		if (isOpen && !monacoPreloaded) {
			setMonacoPreloaded(true);
		}
	};

	return (
		<>
			{/* Preloading Monaco editor so the dialog doesn't lag on first open */}
			{monacoPreloaded && (
				<div className="hidden">
					<MonacoEditor
						value=""
						language="cpp"
						theme="vs-dark"
						options={{ minimap: { enabled: false } }}
					/>
				</div>
			)}
			<Dialog open={open} onOpenChange={handleDialogOpen}>
				<DialogTrigger asChild>
					<Button
						className="flex items-center gap-2 cursor-pointer bg-secondary-gradient"
						onClick={() => setOpen(true)}
					>
						Import Zamger testova
						<Upload className="w-4 h-4" />
					</Button>
				</DialogTrigger>
				<DialogContent forceMount>
					<DialogHeader>
						<DialogTitle>Import Zamger testova</DialogTitle>
						<DialogDescription>
							Uploadajte JSON datoteku sa Zamgera koja sadrži vaše testove
						</DialogDescription>
						<Button
							className="w-fit cursor-pointer bg-secondary-gradient"
							onClick={handleButtonClick}
						>
							Upload JSON
							<Upload className="w-4 h-4" />
						</Button>
						<input
							type="file"
							accept=".json"
							ref={fileInputRef}
							style={{ display: "none" }}
							onChange={handleFileChange}
						/>
						<div className="flex items-center gap-4">
							<Separator className="flex-1" />
							<span className="text-muted-foreground">ili</span>
							<Separator className="flex-1" />
						</div>
						<DialogDescription>
							Zalijepite JSON kod testova sa Zamgera
						</DialogDescription>
						<div className="h-screen max-h-[300px]">
							<MonacoEditor
								value={fileText ?? ""}
								onChange={(s) => setFileText(s ?? "")}
								theme="vs-dark"
								language="json"
								options={{
									fontFamily: "Geist Mono",
									minimap: { enabled: false },
								}}
							/>
						</div>
						<div className="flex gap-2 justify-end">
							<DialogClose asChild>
								<Button variant={"ghost"} className="cursor-pointer">
									Zatvori
								</Button>
							</DialogClose>
							<DialogClose asChild>
								<Button
									disabled={loading}
									className="cursor-pointer flex items-center gap-2 bg-primary-gradient"
									onClick={handleAddTests}
								>
									<LoaderCircle
										className={`w-4 h-4 animate-spin ${!loading ? "hidden" : ""}`}
									/>
									Dodaj testove
								</Button>
							</DialogClose>
						</div>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</>
	);
}

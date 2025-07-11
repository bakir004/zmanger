"use client";

import { Editor } from "@monaco-editor/react";
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

export default function ImportTestsDialog() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [fileText, setFileText] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

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
		setLoading(true);
		setTimeout(() => {
			setOpen(false);
			setLoading(false);
		}, 1000);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					onClick={() => setOpen(true)}
					className="flex items-center gap-2 cursor-pointer bg-secondary-gradient"
				>
					Import Zamger testova
					<Upload className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
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
						<Editor
							value={fileText ?? ""}
							theme="vs-dark"
							language="cpp"
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
						<Button
							disabled={loading}
							onClick={handleAddTests}
							className="cursor-pointer flex items-center gap-2 bg-primary-gradient"
						>
							<LoaderCircle
								className={`w-4 h-4 animate-spin ${!loading ? "hidden" : ""}`}
							/>
							Dodaj testove
						</Button>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}

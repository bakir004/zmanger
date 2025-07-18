import type React from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "app/_components/ui/dialog";
import { Button } from "app/_components/ui/button";
import { FilePlus2 } from "lucide-react";
import { FileCreateForm } from "./file-create-form";
import { useState } from "react";

export const FileCreateButton: React.FC = () => {
	const [open, setOpen] = useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon" className="cursor-pointer">
					<FilePlus2 className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Nova datoteka</DialogTitle>
				</DialogHeader>
				<FileCreateForm close={() => setOpen(false)} parentId={null} />
			</DialogContent>
		</Dialog>
	);
};

import type React from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "app/_components/ui/dialog";
import { Button } from "app/_components/ui/button";
import { FolderPlus } from "lucide-react";
import { FileCreateForm } from "./file-create-form";
import { useState } from "react";
import { FolderCreateForm } from "./folder-create-form";

export const FolderCreateButton: React.FC = () => {
	const [open, setOpen] = useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon" className="cursor-pointer">
					<FolderPlus className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Novi folder</DialogTitle>
				</DialogHeader>
				<FolderCreateForm close={() => setOpen(false)} parentId={null} />
			</DialogContent>
		</Dialog>
	);
};

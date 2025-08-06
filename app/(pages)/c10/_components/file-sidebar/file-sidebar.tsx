import React, { useState } from "react";
import {
	ChevronRight,
	File,
	Plus,
	Info,
	Loader2,
	MoveLeft,
	RefreshCcw,
	Pencil,
	Trash,
} from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../../../../_components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarRail,
} from "../../../../_components/ui/sidebar";
import {
	ContextMenu,
	ContextMenuItem,
	ContextMenuContent,
	ContextMenuTrigger,
	ContextMenuSeparator,
} from "../../../../_components/ui/context-menu";
import { Button } from "../../../../_components/ui/button";
import Link from "next/link";
import { NavUser } from "../../../../_components/nav-user";
import { useUser } from "@clerk/nextjs";
import {
	deleteFile,
	getFilesForUser,
	type SidebarTree,
} from "app/(pages)/c10/actions";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "app/_components/ui/tooltip";
import { FileCreateButton } from "./file-create-button";
import { FolderCreateButton } from "./folder-create-button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "app/_components/ui/dialog";
import { DialogContent } from "app/_components/ui/dialog";
import { Dialog, DialogTrigger } from "app/_components/ui/dialog";
import { FileCreateForm } from "./file-create-form";
import { FolderCreateForm } from "./folder-create-form";

export function FileSidebar({
	// files,
	// filesLoading,
	handleFileClick,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	// files: SidebarTree;
	// filesLoading: boolean;
	handleFileClick: (id: number) => void;
}) {
	const { user } = useUser();
	const userObject = {
		name: `${user?.firstName ?? "Učitavam..."} ${user?.lastName ?? ""}`,
		email: user?.emailAddresses[0]?.emailAddress ?? "Učitavam email adresu...",
		avatar: user?.imageUrl ?? "",
	};

	// Handler for dropping to root
	const handleRootDrop = (e: React.DragEvent) => {
		e.preventDefault();
		const type = e.dataTransfer.getData("application/x-item-type");
		const draggedName = e.dataTransfer.getData("application/x-item-name");
		if (type && draggedName) {
			console.log(`Dragged ${type} '${draggedName}' to root folder`);
		}
	};

	const handleRootDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const { data: files, isLoading: filesLoading } = useQuery({
		queryKey: ["files"],
		queryFn: getFilesForUser,
	});

	return (
		<Sidebar {...props} className="filetree">
			<SidebarContent
				className="md:bg-transparent bg-black/80"
				onDrop={handleRootDrop}
				onDragOver={handleRootDragOver}
			>
				<SidebarGroup>
					<SidebarGroupContent>
						<Link href="/dashboard">
							<Button variant="ghost" className="cursor-pointer">
								<MoveLeft className="h-4 w-4" />
								Dashboard
							</Button>
						</Link>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel className="flex items-center gap-1">
						Datoteke{" "}
						<Tooltip>
							<TooltipTrigger>
								<Info className="h-4 w-4" />
							</TooltipTrigger>
							<TooltipContent>
								<p className="text-center">
									Ove datoteke ne mogu imati međusobnog kontakta. <br />
									Pokušaj da čitate jednu datoteku iz druge neće uspjeti. <br />
									Ako želite čitati/pisati u datoteku: kreirajte je, pišite,
									<br /> pa čitajte iz nje u jednom pokretanju programa. <br />
									Bilo kakve kreirane datoteke se brišu automatski nakon <br />
									završetka programa.
								</p>
							</TooltipContent>
						</Tooltip>
					</SidebarGroupLabel>
					<div className="flex gap-2 mb-2 px-2">
						<FileCreateButton />
						<FolderCreateButton />
					</div>
					<SidebarGroupContent>
						<SidebarMenu>
							{filesLoading ? (
								<SidebarMenuButton>
									<Loader2 className="h-4 w-4 animate-spin" />
									Učitavanje Vaših datoteka...
								</SidebarMenuButton>
							) : (
								files?.map((item, index) => (
									<Tree
										handleFileClick={handleFileClick}
										key={index}
										item={item}
									/>
								))
							)}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={userObject} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

function Tree({
	item,
	handleFileClick,
}: {
	item: { id: number; name: string } | any[];
	handleFileClick: (id: number) => void;
}) {
	// Handle both object format {id, name} and array format
	const isObject = !Array.isArray(item);
	const name = isObject ? item.name : item[0].name;
	const id = isObject ? item.id : item[0].id;
	const items = isObject ? [] : item.slice(1);

	const dragGhostRef = React.useRef<HTMLDivElement | null>(null);
	const [isDragging, setIsDragging] = React.useState(false);
	const [isDragHover, setIsDragHover] = React.useState(false);

	const [fileDialogOpen, setFileDialogOpen] = useState(false);
	const [folderDialogOpen, setFolderDialogOpen] = useState(false);
	const [fileDeleteDialogOpen, setFileDeleteDialogOpen] = useState(false);

	const handleDragStart = (
		e: React.DragEvent,
		type: "file" | "folder",
		name: string,
	) => {
		e.stopPropagation();
		e.dataTransfer.setData("application/x-item-type", type);
		e.dataTransfer.setData("application/x-item-name", name);
		if (dragGhostRef.current) {
			dragGhostRef.current.style.display = "block";
			e.dataTransfer.setDragImage(dragGhostRef.current, 10, 10);
			setTimeout(() => {
				if (dragGhostRef.current) {
					dragGhostRef.current.style.display = "none";
				}
			}, 0);
		}
		setIsDragging(true);
	};

	const handleDragEnd = (e: React.DragEvent) => {
		e.stopPropagation();
		setIsDragging(false);
		setIsDragHover(false);
	};

	const handleDrop = (e: React.DragEvent, folderName: string) => {
		e.preventDefault();
		e.stopPropagation();
		const type = e.dataTransfer.getData("application/x-item-type");
		const draggedName = e.dataTransfer.getData("application/x-item-name");
		if (type && draggedName) {
			console.log(`Dragged ${type} '${draggedName}' to folder '${folderName}'`);
		}
		setIsDragHover(false);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDragEnter = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragHover(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragHover(false);
	};

	const queryClient = useQueryClient();

	const handleDeleteFile = async (fileId: number) => {
		try {
			await deleteFile(fileId);
			queryClient.invalidateQueries({ queryKey: ["files"] });
		} catch (error) {
			console.error(error);
		} finally {
			setFileDeleteDialogOpen(false);
		}
	};

	if (!items.length && isObject) {
		return (
			<>
				<div
					ref={dragGhostRef}
					style={{
						position: "fixed",
						top: "-1000px",
						left: "-1000px",
						pointerEvents: "none",
						background: "rgba(0,0,0,0.7)",
						color: "white",
						padding: "4px 12px",
						borderRadius: 4,
						zIndex: 9999,
						fontSize: 14,
					}}
				>
					<File className="inline-block mr-1 h-4 w-4" />
					{name}
				</div>
				<ContextMenu>
					<ContextMenuTrigger>
						<SidebarMenuButton
							isActive={name === "button.tsx"}
							className="data-[active=true]:bg-transparent"
							draggable
							onDragStart={(e) => handleDragStart(e, "file", name)}
							onDragEnd={handleDragEnd}
							style={{ opacity: isDragging ? 0.5 : 1 }}
							onDragOver={(e) => e.stopPropagation()}
							onDrop={(e) => e.stopPropagation()}
							onClick={() => handleFileClick(id)}
						>
							<File className="h-4 w-4" />
							{name}
						</SidebarMenuButton>
					</ContextMenuTrigger>
					<ContextMenuContent>
						<ContextMenuItem>Reimenuj</ContextMenuItem>
						<Dialog
							open={fileDeleteDialogOpen}
							onOpenChange={setFileDeleteDialogOpen}
						>
							<DialogTrigger asChild>
								<ContextMenuItem
									onClick={(e) => {
										e.preventDefault();
										setFileDeleteDialogOpen(true);
									}}
								>
									<Trash className="h-4 w-4" /> Izbriši
								</ContextMenuItem>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Izbriši datoteku?</DialogTitle>
								</DialogHeader>
								<DialogDescription>
									Želite li izbrisati datoteku {name}?
								</DialogDescription>
								<DialogFooter>
									<Button
										variant="ghost"
										onClick={() => setFileDeleteDialogOpen(false)}
									>
										Otkaži
									</Button>
									<Button
										className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
										onClick={() => handleDeleteFile(id)}
									>
										Izbriši
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</ContextMenuContent>
				</ContextMenu>
			</>
		);
	}

	// Folder
	return (
		<SidebarMenuItem>
			<div
				ref={dragGhostRef}
				style={{
					position: "fixed",
					top: "-1000px",
					left: "-1000px",
					pointerEvents: "none",
					background: "rgba(0,0,0,0.7)",
					color: "white",
					padding: "4px 12px",
					borderRadius: 4,
					zIndex: 9999,
					fontSize: 14,
				}}
			>
				<ChevronRight className="inline-block mr-1 h-4 w-4" />
				{name}
			</div>
			<ContextMenu>
				<ContextMenuTrigger asChild>
					<Collapsible
						data-collapsible
						className="group/collapsible"
						defaultOpen={name === "components" || name === "ui"}
						draggable
						onDragStart={(e) => handleDragStart(e, "folder", name)}
						onDragEnd={handleDragEnd}
					>
						<CollapsibleTrigger asChild>
							<SidebarMenuButton
								className={
									isDragHover
										? "[&[data-state=open]>svg:first-child]:rotate-90 drag-hover"
										: "[&[data-state=open]>svg:first-child]:rotate-90"
								}
								onDrop={(e) => handleDrop(e, name)}
								onDragOver={handleDragOver}
								onDragEnter={handleDragEnter}
								onDragLeave={handleDragLeave}
								style={{ opacity: isDragging ? 0.5 : 1 }}
							>
								<ChevronRight className="transition-transform" />
								{/* <Folder /> */}
								{name}
							</SidebarMenuButton>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<SidebarMenuSub>
								{items.map((subItem, index) => (
									<Tree
										handleFileClick={handleFileClick}
										key={index}
										item={subItem}
									/>
								))}
							</SidebarMenuSub>
						</CollapsibleContent>
					</Collapsible>
				</ContextMenuTrigger>
				<ContextMenuContent className="!text-white">
					<ContextMenuItem>
						<Pencil className="h-4 w-4" /> Reimenuj
					</ContextMenuItem>
					<Dialog
						open={fileDeleteDialogOpen}
						onOpenChange={setFileDeleteDialogOpen}
					>
						<DialogTrigger asChild>
							<ContextMenuItem
								onClick={(e) => {
									e.preventDefault();
									setFileDeleteDialogOpen(true);
								}}
							>
								<Trash className="h-4 w-4" /> Izbriši
							</ContextMenuItem>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Izbriši folder?</DialogTitle>
							</DialogHeader>
							<DialogDescription>
								Želite li izbrisati folder {name}?
							</DialogDescription>
							<DialogFooter>
								<Button
									variant="ghost"
									onClick={() => setFileDeleteDialogOpen(false)}
								>
									Otkaži
								</Button>
								<Button
									className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
									onClick={() => handleDeleteFile(id)}
								>
									Izbriši
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<Dialog open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
						<DialogTrigger asChild>
							<ContextMenuItem
								onClick={(e) => {
									e.preventDefault();
									setFileDialogOpen(true);
								}}
							>
								<Plus className="h-4 w-4" /> Datoteka
							</ContextMenuItem>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Nova datoteka</DialogTitle>
							</DialogHeader>
							<FileCreateForm
								close={() => setFileDialogOpen(false)}
								parentId={id}
							/>
						</DialogContent>
					</Dialog>
					<Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
						<DialogTrigger asChild>
							<ContextMenuItem
								onClick={(e) => {
									e.preventDefault();
									setFolderDialogOpen(true);
								}}
							>
								<Plus className="h-4 w-4" /> Folder
							</ContextMenuItem>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Novi folder</DialogTitle>
							</DialogHeader>
							<FolderCreateForm
								close={() => setFolderDialogOpen(false)}
								parentId={id}
							/>
						</DialogContent>
					</Dialog>
					<ContextMenuSeparator />
					<ContextMenuItem>Prikaži detalje</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		</SidebarMenuItem>
	);
}

// Add style for drag-hover effect
if (typeof window !== "undefined") {
	const style = document.createElement("style");
	style.innerHTML = ".drag-hover { background: #261c32 !important; }";
	document.head.appendChild(style);
}

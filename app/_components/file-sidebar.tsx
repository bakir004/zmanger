import React from "react";
import { ChevronRight, File, Loader2, MoveLeft } from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./ui/collapsible";
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
} from "./ui/sidebar";
import {
	ContextMenu,
	ContextMenuItem,
	ContextMenuContent,
	ContextMenuTrigger,
	ContextMenuSeparator,
} from "./ui/context-menu";
import { Button } from "./ui/button";
import Link from "next/link";
import { NavUser } from "./nav-user";
import { useUser } from "@clerk/nextjs";
import type { SidebarTree } from "app/(pages)/c10/actions";

export function FileSidebar({
	files,
	filesLoading,
	handleFileClick,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	files: SidebarTree;
	filesLoading: boolean;
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

	return (
		<Sidebar {...props} className="filetree">
			<SidebarContent
				className=""
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
					<SidebarGroupLabel>Datoteke</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{filesLoading ? (
								<SidebarMenuButton>
									<Loader2 className="h-4 w-4 animate-spin" />
									Učitavanje Vaših datoteka...
								</SidebarMenuButton>
							) : (
								files.map((item, index) => (
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

	if (!items.length) {
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
						<ContextMenuItem>niggas</ContextMenuItem>
						<ContextMenuItem>Billing</ContextMenuItem>
						<ContextMenuItem>Team</ContextMenuItem>
						<ContextMenuItem>Subscription</ContextMenuItem>
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
				<ContextMenuContent>
					<ContextMenuItem>Rename</ContextMenuItem>
					<ContextMenuItem>Delete</ContextMenuItem>
					<ContextMenuSeparator />
					<ContextMenuItem>Properties</ContextMenuItem>
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

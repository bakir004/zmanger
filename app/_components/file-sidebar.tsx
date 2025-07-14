import type * as React from "react";
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
	...props
}: React.ComponentProps<typeof Sidebar> & {
	files: SidebarTree;
	filesLoading: boolean;
}) {
	const { user } = useUser();
	const userObject = {
		name: `${user?.firstName ?? "Učitavam..."} ${user?.lastName ?? ""}`,
		email: user?.emailAddresses[0]?.emailAddress ?? "Učitavam email adresu...",
		avatar: user?.imageUrl ?? "",
	};
	return (
		<Sidebar {...props} className="filetree">
			<SidebarContent className="">
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
								files.map((item, index) => <Tree key={index} item={item} />)
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

function Tree({ item }: { item: string | any[] }) {
	const [name, ...items] = Array.isArray(item) ? item : [item];

	if (!items.length) {
		return (
			<ContextMenu>
				<ContextMenuTrigger>
					<SidebarMenuButton
						isActive={name === "button.tsx"}
						className="data-[active=true]:bg-transparent"
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
		);
	}

	return (
		<SidebarMenuItem>
			<ContextMenu>
				<ContextMenuTrigger asChild>
					<Collapsible
						data-collapsible
						className="group/collapsible"
						defaultOpen={name === "components" || name === "ui"}
					>
						<CollapsibleTrigger asChild>
							<SidebarMenuButton className="[&[data-state=open]>svg:first-child]:rotate-90">
								<ChevronRight className="transition-transform" />
								{/* <Folder /> */}
								{name}
							</SidebarMenuButton>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<SidebarMenuSub>
								{items.map((subItem, index) => (
									<Tree key={index} item={subItem} />
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

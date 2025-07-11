import type * as React from "react";
import { ChevronRight, File, Folder } from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuBadge,
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
} from "./ui/context-menu";

// This is sample data.
const data = {
	changes: [
		{
			file: "README.md",
			state: "M",
		},
		{
			file: "api/hello/route.ts",
			state: "U",
		},
		{
			file: "app/layout.tsx",
			state: "M",
		},
	],
	tree: [
		[
			"app",
			[
				"api",
				["hello", ["route.ts"]],
				"page.tsx",
				"layout.tsx",
				["blog", ["page.tsx"]],
			],
		],
		[
			"components",
			["ui", "button.tsx", "card.tsx"],
			"header.tsx",
			"footer.tsx",
		],
		["lib", ["util.ts"]],
		["public", "favicon.ico", "vercel.svg"],
		".eslintrc.json",
		".gitignore",
		"next.config.js",
		"tailwind.config.js",
		"package.json",
		"README.md",
	],
};

export function FileSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props} className="filetree">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Changes</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{data.changes.map((item, index) => (
								<SidebarMenuItem key={index}>
									<SidebarMenuButton>
										<File />
										{item.file}
									</SidebarMenuButton>
									<SidebarMenuBadge>{item.state}</SidebarMenuBadge>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Files</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{data.tree.map((item, index) => (
								<Tree key={index} item={item} />
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
						<File />
						{name}
					</SidebarMenuButton>
				</ContextMenuTrigger>

				<ContextMenuContent>
					<ContextMenuItem>Profile</ContextMenuItem>
					<ContextMenuItem>Billing</ContextMenuItem>
					<ContextMenuItem>Team</ContextMenuItem>
					<ContextMenuItem>Subscription</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		);
	}

	return (
		<SidebarMenuItem>
			<Collapsible
				className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
				defaultOpen={name === "components" || name === "ui"}
			>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton>
						<ChevronRight className="transition-transform" />
						<Folder />
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
		</SidebarMenuItem>
	);
}

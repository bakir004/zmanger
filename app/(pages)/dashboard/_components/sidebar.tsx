"use client";

import type * as React from "react";
import {
	BookOpen,
	Bot,
	Command,
	ExternalLink,
	FileCode2,
	Frame,
	LayoutTemplate,
	PieChart,
	Settings2,
	SquareTerminal,
} from "lucide-react";

import { NavMain } from "../../../_components/nav-main";
import { NavProjects } from "../../../_components/nav-projects";
import { NavUser } from "../../../_components/nav-user";
import { TeamSwitcher } from "../../../_components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
} from "../../../_components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { Button } from "../../../_components/ui/button";
import Link from "next/link";

const data = {
	navMain: [
		{
			title: "Testovi",
			url: "/testovi",
			icon: FileCode2,
			isActive: true,
			items: [
				{
					title: "Pregled testova",
					url: "/dashboard/testovi",
				},
				{
					title: "Dodaj testove",
					url: "/dashboard/testovi/dodaj",
				},
				{
					title: "Settings",
					url: "#",
				},
			],
		},
		{
			title: "Models",
			url: "#",
			icon: Bot,
			items: [
				{
					title: "Genesis",
					url: "#",
				},
				{
					title: "Explorer",
					url: "#",
				},
				{
					title: "Quantum",
					url: "#",
				},
			],
		},
		{
			title: "Documentation",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "Introduction",
					url: "#",
				},
				{
					title: "Get Started",
					url: "#",
				},
				{
					title: "Tutorials",
					url: "#",
				},
				{
					title: "Changelog",
					url: "#",
				},
			],
		},
		{
			title: "Settings",
			url: "#",
			icon: Settings2,
			items: [
				{
					title: "General",
					url: "#",
				},
				{
					title: "Team",
					url: "#",
				},
				{
					title: "Billing",
					url: "#",
				},
				{
					title: "Limits",
					url: "#",
				},
			],
		},
	],
	projects: [
		{
			name: "Design Engineering",
			url: "#",
			icon: Frame,
		},
		{
			name: "Sales & Marketing",
			url: "#",
			icon: PieChart,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user } = useUser();
	const userObject = {
		name: `${user?.firstName ?? "Učitavam..."} ${user?.lastName ?? ""}`,
		email: user?.emailAddresses[0]?.emailAddress ?? "Učitavam email adresu...",
		avatar: user?.imageUrl ?? "",
	};
	return (
		<Sidebar collapsible="icon" {...props} className="bg-transparent">
			<SidebarHeader>
				<TeamSwitcher />
			</SidebarHeader>
			<SidebarContent className="bg-transparent">
				<SidebarMenu>
					<SidebarMenuItem>
						<Link href="/c10" className="flex mx-4 items-center gap-2">
							<Button className="w-full group-data-[state=collapsed]:hidden cursor-pointer bg-primary-gradient">
								Otvori c10
								<ExternalLink className="-mt-0.5" />
							</Button>
						</Link>
					</SidebarMenuItem>
					<SidebarMenuItem className="px-2 mt-4">
						<Link href="/dashboard">
							<SidebarMenuButton className="cursor-pointer" tooltip={"ok"}>
								<LayoutTemplate />
								Dashboard
							</SidebarMenuButton>
						</Link>
					</SidebarMenuItem>
				</SidebarMenu>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={userObject} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

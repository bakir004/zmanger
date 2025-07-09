import type * as React from "react";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import Link from "next/link";

export function TeamSwitcher() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<Link
						href="/"
						className="data-[state=open]:bg-sidebar-accent flex gap-3 data-[state=open]:text-sidebar-accent-foreground"
					>
						<div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
							<img src="logo.png" alt="logo" />
						</div>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">Zmanger</span>
							<span className="truncate text-xs">v2.3.0</span>
						</div>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

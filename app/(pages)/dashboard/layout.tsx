"use client";
import { AppSidebar } from "app/(pages)/dashboard/_components/sidebar";
import DashboardHeader from "./_components/header";

import { SidebarInset, SidebarProvider } from "app/_components/ui/sidebar";
import { Toaster } from "app/_components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<DashboardHeader />
				{children}
				<Toaster />
			</SidebarInset>
		</SidebarProvider>
	);
}

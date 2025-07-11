import { AppSidebar } from "app/(pages)/dashboard/_components/dashboard-sidebar";
import DashboardHeader from "./_components/dashboard-header";

import { SidebarInset, SidebarProvider } from "app/_components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<DashboardHeader />
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}

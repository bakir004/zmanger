"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "app/_components/ui/breadcrumb";
import { Separator } from "app/_components/ui/separator";
import { SidebarTrigger } from "../../../_components/ui/sidebar";
import { Fragment } from "react";

export default function DashboardHeader() {
	const pathname = usePathname();
	const segments = pathname.split("/").filter(Boolean);
	const toTitleCase = (str: string) =>
		str.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
	return (
		<header className="flex h-16 shrink-0 bg-none items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
			<div className="flex items-center bg-none gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>
				<Breadcrumb>
					<BreadcrumbList>
						{segments.map((segment, index) => {
							const isLast = index === segments.length - 1;
							const href = `/${segments.slice(0, index + 1).join("/")}`;

							return (
								<Fragment key={index}>
									<BreadcrumbItem>
										{isLast ? (
											<BreadcrumbPage>{toTitleCase(segment)}</BreadcrumbPage>
										) : (
											<BreadcrumbLink asChild>
												<Link href={href}>{toTitleCase(segment)}</Link>
											</BreadcrumbLink>
										)}
									</BreadcrumbItem>
									{!isLast && <BreadcrumbSeparator />}
								</Fragment>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	);
}

"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { getUsersFromClerk } from "../actions";
import { Button } from "../../../_components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../../_components/ui/table";
import { Badge } from "../../../_components/ui/badge";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "../../../_components/ui/avatar";
import {
	Users,
	Search,
	MoreHorizontal,
	UserCheck,
	UserX,
	Mail,
	Calendar,
	Shield,
	Crown,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../../_components/ui/dropdown-menu";
import { Input } from "../../../_components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../../_components/ui/card";
import { lexend, inter } from "../../../_fonts/fonts";
import { UpdateUserRoleModal } from "./_components/update-user-role-modal";
import { UpdateUserPlanModal } from "./_components/update-user-plan-modal";

import type { ClerkUser } from "~/application/services/clerk.service.interface";

export default function KorisniciPage() {
	const { isLoaded } = useUser();
	const [searchTerm, setSearchTerm] = useState("");
	const [filterRole, setFilterRole] = useState<string>("all");
	const [roleModalOpen, setRoleModalOpen] = useState(false);
	const [planModalOpen, setPlanModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<ClerkUser | null>(null);

	const {
		data: users = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["clerk-users"],
		queryFn: async () => {
			return await getUsersFromClerk();
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 2,
		enabled: isLoaded,
	});

	const filteredUsers = users.filter((user: ClerkUser) => {
		const matchesSearch =
			user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.emailAddresses?.[0]?.emailAddress
				?.toLowerCase()
				.includes(searchTerm.toLowerCase());

		const matchesRole =
			filterRole === "all" || (user.publicMetadata as any)?.role === filterRole;

		return matchesSearch && matchesRole;
	});

	const getUserPlan = (user: ClerkUser) => {
		return (user.publicMetadata as any)?.plan || "free";
	};
	const getUserRole = (user: ClerkUser) => {
		return (user.publicMetadata as any)?.role || "korisnik";
	};

	const getRoleBadgeVariant = (role: string) => {
		switch (role) {
			case "admin":
				return "destructive";
			case "moderator":
				return "secondary";
			case "premium":
				return "default";
			default:
				return "outline";
		}
	};

	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleDateString("bs-BA", {
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getInitials = (firstName: string | null, lastName: string | null) => {
		const first = firstName?.charAt(0) || "";
		const last = lastName?.charAt(0) || "";
		return (first + last).toUpperCase();
	};

	const handleUpdateRole = (user: ClerkUser) => {
		setSelectedUser(user);
		setRoleModalOpen(true);
	};

	const handleUpdatePlan = (user: ClerkUser) => {
		setSelectedUser(user);
		setPlanModalOpen(true);
	};

	if (!isLoaded) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white" />
			</div>
		);
	}

	return (
		<div className="">
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-2">
						<Users className="h-8 w-8 text-blue-400" />
						<h1 className={`text-3xl font-bold ${lexend.className}`}>
							Upravljanje korisnicima
						</h1>
					</div>
					<p className="text-gray-400">
						Pregled i upravljanje svim korisnicima platforme
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-4">
					<Card className="">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-400">Ukupno korisnika</p>
									<p className="text-2xl font-bold">{users.length}</p>
								</div>
								<Users className="h-8 w-8 text-blue-400" />
							</div>
						</CardContent>
					</Card>
					<Card className="">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-400">Administratori</p>
									<p className="text-2xl font-bold">
										{
											users.filter((u: ClerkUser) => getUserRole(u) === "admin")
												.length
										}
									</p>
								</div>
								<Shield className="h-8 w-8 text-red-400" />
							</div>
						</CardContent>
					</Card>
					<Card className="">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-400">Pro/Pro+ korisnici</p>
									<p className="text-2xl font-bold">
										{`
											${
												users.filter((u: ClerkUser) => getUserPlan(u) === "pro")
													.length
											} / ${
												users.filter(
													(u: ClerkUser) => getUserPlan(u) === "pro+",
												).length
											}`}
									</p>
								</div>
								<UserCheck className="h-8 w-8 text-green-400" />
							</div>
						</CardContent>
					</Card>
					<Card className="">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-400">Aktivni danas</p>
									<p className="text-2xl font-bold">
										{
											users.filter((u: ClerkUser) => {
												if (!u.lastSignInAt) return false;
												const today = new Date();
												const lastSignIn = new Date(u.lastSignInAt);
												return (
													lastSignIn.toDateString() === today.toDateString()
												);
											}).length
										}
									</p>
								</div>
								<Calendar className="h-8 w-8 text-yellow-400" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<Card className="mb-4">
					<CardContent className="p-4">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<Input
										placeholder="Pretraži korisnike..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10 bg-gray-800 border-gray-600 text-white"
									/>
								</div>
							</div>
							<div className="flex gap-2">
								<Button
									variant={filterRole === "all" ? "default" : "outline"}
									onClick={() => setFilterRole("all")}
									size="sm"
								>
									Svi
								</Button>
								<Button
									variant={filterRole === "admin" ? "default" : "outline"}
									onClick={() => setFilterRole("admin")}
									size="sm"
								>
									Admini
								</Button>
								<Button
									variant={filterRole === "premium" ? "default" : "outline"}
									onClick={() => setFilterRole("premium")}
									size="sm"
								>
									Premium
								</Button>
								<Button
									variant={filterRole === "user" ? "default" : "outline"}
									onClick={() => setFilterRole("user")}
									size="sm"
								>
									Korisnici
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Users Table */}
				<Card className="">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5" />
							Korisnici ({filteredUsers.length})
						</CardTitle>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
							</div>
						) : error ? (
							<div className="flex items-center justify-center py-8">
								<div className="text-center">
									<p className="text-red-400 mb-2">
										Greška pri učitavanju korisnika
									</p>
									<p className="text-gray-400 text-sm">
										{error instanceof Error
											? error.message
											: "Nepoznata greška"}
									</p>
								</div>
							</div>
						) : (
							<div className="overflow-x-auto w-full">
								<Table className="min-w-full">
									<TableHeader>
										<TableRow className="border-gray-700">
											<TableHead className="text-gray-300">Korisnik</TableHead>
											<TableHead className="text-gray-300">Uloga</TableHead>
											<TableHead className="text-gray-300">Plan</TableHead>
											<TableHead className="text-gray-300">Želi</TableHead>
											<TableHead className="text-gray-300">
												Registracija
											</TableHead>
											<TableHead className="text-gray-300">Akcije</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredUsers.map((user: ClerkUser) => (
											<TableRow key={user.id} className="border-gray-700">
												<TableCell>
													<div className="flex items-center gap-3">
														<Avatar className="h-10 w-10">
															<AvatarImage src={user.imageUrl} />
															<AvatarFallback>
																{getInitials(user.firstName, user.lastName)}
															</AvatarFallback>
														</Avatar>
														<div>
															<p className="font-medium">
																{user.firstName} {user.lastName}
															</p>
															<p className="text-sm text-gray-400">
																{user.emailAddresses?.[0]?.emailAddress}
															</p>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<Badge
														variant={getRoleBadgeVariant(getUserRole(user))}
													>
														{getUserRole(user)}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant={
															(user.publicMetadata as any)?.plan === "pro+"
																? "default"
																: (user.publicMetadata as any)?.plan === "pro"
																	? "secondary"
																	: "outline"
														}
													>
														{(user.publicMetadata as any)?.plan || "free"}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant={
															(user.publicMetadata as any)?.wants === "pro+"
																? "default"
																: (user.publicMetadata as any)?.wants === "pro"
																	? "secondary"
																	: "outline"
														}
													>
														{(user.publicMetadata as any)?.wants || "free"}
													</Badge>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<Calendar className="h-4 w-4 text-gray-400" />
														<span>{formatDate(user.createdAt)}</span>
													</div>
												</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" size="sm">
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem
																onClick={() => handleUpdateRole(user)}
															>
																<UserCheck className="h-4 w-4 mr-2" />
																Promijeni ulogu
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => handleUpdatePlan(user)}
															>
																<Crown className="h-4 w-4 mr-2" />
																Promijeni plan
															</DropdownMenuItem>
															<DropdownMenuItem>
																<Mail className="h-4 w-4 mr-2" />
																Pošalji email
															</DropdownMenuItem>
															<DropdownMenuItem className="text-red-400">
																<UserX className="h-4 w-4 mr-2" />
																Deaktiviraj
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Modals */}
			{selectedUser && (
				<>
					<UpdateUserRoleModal
						open={roleModalOpen}
						onOpenChange={setRoleModalOpen}
						user={{
							id: selectedUser.id,
							firstName: selectedUser.firstName,
							lastName: selectedUser.lastName,
							currentRole: getUserRole(selectedUser),
						}}
					/>
					<UpdateUserPlanModal
						open={planModalOpen}
						onOpenChange={setPlanModalOpen}
						user={{
							id: selectedUser.id,
							firstName: selectedUser.firstName,
							lastName: selectedUser.lastName,
							currentPlan: (selectedUser.publicMetadata as any)?.plan || "free",
						}}
					/>
				</>
			)}
		</div>
	);
}

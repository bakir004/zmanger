/* eslint-disable */
"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Switch } from "~/components/ui/switch";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { authGuard } from "~/lib/authguard";
import DashboardPageWrapper from "~/components/DashboardPageWrapper";

type User = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddresses: { emailAddress: string }[];
  publicMetadata: {
    canTest?: boolean;
    moderator?: boolean;
  };
};

function PermissionsPage() {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [etfOnly, setEtfOnly] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/permissions/users");
      const data = await response.json();
      setUsers(data.users);
      setFilteredUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Greška pri dohvatanju korisnika");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = users.filter((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
      const email = user.emailAddresses[0]?.emailAddress.toLowerCase() || "";
      const matchesSearch = fullName.includes(query) || email.includes(query);
      const matchesEtf = !etfOnly || email.endsWith("@etf.unsa.ba");
      return matchesSearch && matchesEtf;
    });
    setFilteredUsers(filtered);
  }, [searchQuery, users, etfOnly]);

  const updatePermission = async (userId: string, permission: "canTest" | "moderator", value: boolean) => {
    try {
      const response = await fetch("/api/permissions/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          permission,
          value,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update permission");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.id === userId) {
            return {
              ...user,
              publicMetadata: {
                ...user.publicMetadata,
                [permission]: value,
              },
            };
          }
          return user;
        })
      );

      toast.success("Dozvola uspješno ažurirana");
    } catch (error) {
      console.error("Error updating permission:", error);
      toast.error("Greška pri ažuriranju dozvole");
    }
  };

  return (
    <DashboardPageWrapper>
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Permisije</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="my-4 text-3xl font-bold">Upravljanje permisijama</h1>
      <h3 className="mb-4 text-lg font-bold">Korisnika: {users.length} - {users.filter(user => user.publicMetadata.canTest).length - 9}</h3>

      <div className="flex flex-col gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pretraži po imenu ili email-u..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={etfOnly}
            onCheckedChange={setEtfOnly}
            id="etf-filter"
          />
          <label
            htmlFor="etf-filter"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Prikaži samo ETF email adrese
          </label>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-slate-600">
            <TableHead>Ime</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Testiranje</TableHead>
            <TableHead>Moderator</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Učitavanje...
              </TableCell>
            </TableRow>
          ) : filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                {searchQuery ? "Nema rezultata za pretragu." : "Nema korisnika."}
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-slate-600">
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.emailAddresses[0]?.emailAddress}</TableCell>
                <TableCell>
                  <Switch
                    checked={user.publicMetadata?.canTest || false}
                    onCheckedChange={(checked: boolean) =>
                      updatePermission(user.id, "canTest", checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={user.publicMetadata?.moderator || false}
                    onCheckedChange={(checked: boolean) =>
                      updatePermission(user.id, "moderator", checked)
                    }
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </DashboardPageWrapper>

  );
}

export default authGuard({
  Component: PermissionsPage,
  props: {},
  adminOnly: true,
});

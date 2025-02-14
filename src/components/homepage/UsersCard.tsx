"use client";
import { useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Users } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function UsersCard() {
  const [totalUsers, setTotalUsers] = useState(0);
  useEffect(() => {
    async function getUsersCount() {
      try {
        const response = await fetch("/api/getUserCount");

        if (!response.ok) {
          throw new Error("Error fetching data from backend");
        }

        // eslint-disable-next-line
        const data: { totalUsers: number } = await response.json();
        setTotalUsers(data.totalUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setTotalUsers(0);
      }
    }

    void getUsersCount();
  }, []);
  return (
    <Card className="w-1/4">
      <CardHeader className="relative">
        <Users className="absolute right-6 top-6 h-6 w-6 text-slate-400" />
        <p className="text-sm">Ukupno korisnika</p>
        {totalUsers > 0 ? (
          <CardTitle className="font-extrabold text-yellow-500">
            {totalUsers}
          </CardTitle>
        ) : (
          <Skeleton className="h-6 w-12" />
        )}
        <CardDescription>od 2024.</CardDescription>
      </CardHeader>
    </Card>
  );
}

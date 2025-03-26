/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

type TestGroup = {
  id: number;
  name: string;
  phase: string;
};

export default function TestGroupsCard() {
  const [testGroups, setTestGroups] = useState<TestGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchTestGroups = async () => {
      try {
        const res = await fetch("/api/tests/subject/TP", {
          headers: {
            "x-user-id": user?.id ?? "anonymous-" + Math.random().toString(36).substring(7),
            "x-user-role": "admin"
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (!data.testGroups) {
          console.error("No test groups in response:", data);
          return;
        }
        setTestGroups(data.testGroups);
      } catch (error) {
        console.error("Error fetching test groups:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchTestGroups();
  }, [user]);

  return (
    <Card className="w-full p-4 flex items-center gap-2">
      <p className="text-sm">Dostupni TP testovi:</p>
      <div className="flex flex-wrap gap-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-24" />
          ))
        ) : testGroups.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nema dostupnih testova</p>
        ) : (
          testGroups.map((group) => (
            <Link key={group.id} href={`/testovi?subject=TP`}>
              <Badge
                variant="secondary"
                className={`cursor-pointer ${group.phase === "testing"
                  ? "bg-orange-600  dark:hover:bg-orange-500 text-white"
                  : "bg-green-600  dark:hover:bg-green-500 text-white"
                  }`}
              >
                {group.name}
              </Badge>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
} 
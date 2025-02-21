"use client";
import { MoonStar } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export default function VaktijaCard({}) {
  const [vaktija, setVaktija] = useState<{
    lokacija: string;
    datum: string;
    vakat: string;
    naziv: string;
  }>({
    lokacija: "",
    datum: "",
    vakat: "",
    naziv: "",
  });
  useEffect(() => {
    async function getVakats() {
      try {
        const response = await fetch("/api/getVakat");

        if (!response.ok) {
          throw new Error("Error fetching data from backend");
        }

        // eslint-disable-next-line
        const data: {
          result: {
            lokacija: string;
            datum: string;
            vakat: string;
            naziv: string;
          };
        } = await response.json();
        setVaktija(data.result);
      } catch (error) {
        console.error("Error fetching users:", error);
        setVaktija({
          lokacija: "",
          datum: "Desila se greška na serveru...",
          vakat: "",
          naziv: "",
        });
      }
    }

    void getVakats();
  }, []);
  return (
    <Card className="w-full">
      <CardHeader className="relative">
        <MoonStar className="absolute right-6 top-6 hidden h-6 w-6 text-slate-400 lg:block" />
        {vaktija.naziv.length > 0 ? (
          <p className="text-sm">{vaktija.naziv}:</p>
        ) : (
          <Skeleton className="h-4 w-20" />
        )}
        {vaktija.vakat.length > 0 ? (
          <CardTitle className="font-extrabold text-green-600">
            {vaktija.vakat}
          </CardTitle>
        ) : (
          <Skeleton className="h-6 w-16" />
        )}
        {vaktija.lokacija.length > 0 ? (
          <CardDescription className="text-sm">
            {vaktija.datum}, {vaktija.lokacija}
          </CardDescription>
        ) : (
          <Skeleton className="h-4 w-full" />
        )}
      </CardHeader>
    </Card>
  );
}

import { DollarSign } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function CostCard({ }) {
  return (
    <Card className="w-full">
      <CardHeader className="relative">
        <DollarSign className="absolute right-6 top-6 hidden h-6 w-6 text-slate-400 lg:block" />
        <p className="text-sm">Ukupni trošak</p>
        <CardTitle className="font-extrabold text-blue-500">$220.73</CardTitle>
        <CardDescription>na servere.</CardDescription>
      </CardHeader>
    </Card>
  );
}

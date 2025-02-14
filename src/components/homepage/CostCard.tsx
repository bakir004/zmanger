import { DollarSign } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function CostCard({}) {
  return (
    <Card className="w-1/4">
      <CardHeader className="relative">
        <DollarSign className="absolute right-6 top-6 h-6 w-6 text-slate-400" />
        <p className="text-sm">Ukupni trošak</p>
        <CardTitle className="font-extrabold text-blue-500">$170.87</CardTitle>
        <CardDescription>na servere.</CardDescription>
      </CardHeader>
    </Card>
  );
}

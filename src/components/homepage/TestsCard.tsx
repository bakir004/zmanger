import { ClipboardCheck } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function TestsCard({}) {
  return (
    <Card className="w-1/4">
      <CardHeader className="relative">
        <ClipboardCheck className="absolute right-6 top-6 h-6 w-6 text-slate-400" />
        <p className="text-sm">Pokrenuto</p>
        <CardTitle className="font-extrabold text-purple-500">21429</CardTitle>
        <CardDescription>individualnih testova.</CardDescription>
      </CardHeader>
    </Card>
  );
}

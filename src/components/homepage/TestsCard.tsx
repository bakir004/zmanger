/* eslint-disable */
import { ClipboardCheck } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";

export default function TestsCard() {
  const [testCount, setTestCount] = useState<number>(0);
  useEffect(() => {
    const fetchTestCount = async () => {
      try {
        const res = await fetch("/api/getJudgeStatistics");
        const data = await res.json();
        setTestCount(data.submissions.total);
      } catch (error) {
        console.error(error);
      }
    };
    void fetchTestCount();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="relative">
        <ClipboardCheck className="absolute right-6 top-6 hidden h-6 w-6 text-slate-400 lg:block" />
        <p className="text-sm">Pokrenuto</p>
        <CardTitle className="font-extrabold text-purple-500">
          {211358}
        </CardTitle>
        <CardDescription>individualnih testova.</CardDescription>
      </CardHeader>
    </Card>
  );
}

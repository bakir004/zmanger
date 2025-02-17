/* eslint-disable */
"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { useEffect } from "react";

const chartConfig = {
  views: {
    label: "Broj testova",
  },
  desktop: {
    label: "Tests",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function TestNumberChart() {
  const [submissionsByDay, setSubmissionsByDay] = React.useState<
    { date: string; tests: number }[]
  >([]);
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await fetch("/api/getJudgeStatistics");
        const data = await res.json();
        const submissionsByDayArray: { date: string; tests: number }[] = [];
        Object.keys(data.submissions.last_30_days).forEach((key) => {
          submissionsByDayArray.push({
            date: key,
            tests: data.submissions.last_30_days[key],
          });
        });
        setSubmissionsByDay([...submissionsByDayArray]);
      } catch (error) {
        console.error(error);
      }
    };
    void fetchChartData();
  }, []);
  return (
    <Card className="w-2/3">
      <CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Broj pokrenutih testova</CardTitle>
          <CardDescription>
            Prikazani po danima za posljednji mjesec
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={submissionsByDay}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value: string) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={"tests"} fill={`hsl(var(--chart-1))`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

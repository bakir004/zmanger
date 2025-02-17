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
const chartData = [
  { date: "2024-04-01", tests: 222 },
  { date: "2024-04-02", tests: 97 },
  { date: "2024-04-03", tests: 167 },
  { date: "2024-04-04", tests: 242 },
  { date: "2024-04-05", tests: 373 },
  { date: "2024-04-06", tests: 301 },
  { date: "2024-04-07", tests: 245 },
  { date: "2024-04-08", tests: 409 },
  { date: "2024-04-09", tests: 59 },
  { date: "2024-04-10", tests: 261 },
  { date: "2024-04-11", tests: 327 },
  { date: "2024-04-12", tests: 292 },
  { date: "2024-04-13", tests: 342 },
  { date: "2024-04-14", tests: 137 },
  { date: "2024-04-15", tests: 120 },
  { date: "2024-04-16", tests: 138 },
  { date: "2024-04-17", tests: 446 },
  { date: "2024-04-18", tests: 364 },
  { date: "2024-04-19", tests: 243 },
  { date: "2024-04-20", tests: 89 },
  { date: "2024-04-21", tests: 137 },
  { date: "2024-04-22", tests: 224 },
  { date: "2024-04-23", tests: 138 },
  { date: "2024-04-24", tests: 387 },
  { date: "2024-04-25", tests: 215 },
  { date: "2024-04-26", tests: 75 },
  { date: "2024-04-27", tests: 383 },
  { date: "2024-04-28", tests: 122 },
  { date: "2024-04-29", tests: 315 },
  { date: "2024-04-30", tests: 454 },
  { date: "2024-05-01", tests: 165 },
  { date: "2024-05-02", tests: 293 },
  { date: "2024-05-03", tests: 247 },
  { date: "2024-05-04", tests: 385 },
  { date: "2024-05-05", tests: 481 },
  { date: "2024-05-06", tests: 498 },
  { date: "2024-05-07", tests: 388 },
  { date: "2024-05-08", tests: 149 },
  { date: "2024-05-09", tests: 227 },
  { date: "2024-05-10", tests: 293 },
  { date: "2024-05-11", tests: 335 },
  { date: "2024-05-12", tests: 197 },
  { date: "2024-05-13", tests: 197 },
  { date: "2024-05-14", tests: 448 },
  { date: "2024-05-15", tests: 473 },
  { date: "2024-05-16", tests: 338 },
  { date: "2024-05-17", tests: 499 },
  { date: "2024-05-18", tests: 315 },
  { date: "2024-05-19", tests: 235 },
  { date: "2024-05-20", tests: 177 },
  { date: "2024-05-21", tests: 82 },
  { date: "2024-05-22", tests: 81 },
  { date: "2024-05-23", tests: 252 },
  { date: "2024-05-24", tests: 294 },
  { date: "2024-05-25", tests: 201 },
  { date: "2024-05-26", tests: 213 },
  { date: "2024-05-27", tests: 420 },
  { date: "2024-05-28", tests: 233 },
  { date: "2024-05-29", tests: 78 },
  { date: "2024-05-30", tests: 340 },
  { date: "2024-05-31", tests: 178 },
  { date: "2024-06-01", tests: 178 },
  { date: "2024-06-02", tests: 470 },
  { date: "2024-06-03", tests: 103 },
  { date: "2024-06-04", tests: 439 },
  { date: "2024-06-05", tests: 88 },
  { date: "2024-06-06", tests: 294 },
  { date: "2024-06-07", tests: 323 },
  { date: "2024-06-08", tests: 385 },
  { date: "2024-06-09", tests: 438 },
  { date: "2024-06-10", tests: 155 },
  { date: "2024-06-11", tests: 92 },
  { date: "2024-06-12", tests: 492 },
  { date: "2024-06-13", tests: 81 },
  { date: "2024-06-14", tests: 426 },
  { date: "2024-06-15", tests: 307 },
  { date: "2024-06-16", tests: 371 },
  { date: "2024-06-17", tests: 475 },
  { date: "2024-06-18", tests: 107 },
  { date: "2024-06-19", tests: 341 },
  { date: "2024-06-20", tests: 408 },
  { date: "2024-06-21", tests: 169 },
  { date: "2024-06-22", tests: 317 },
  { date: "2024-06-23", tests: 480 },
  { date: "2024-06-24", tests: 132 },
  { date: "2024-06-25", tests: 141 },
  { date: "2024-06-26", tests: 434 },
  { date: "2024-06-27", tests: 448 },
  { date: "2024-06-28", tests: 149 },
  { date: "2024-06-29", tests: 103 },
  { date: "2024-06-30", tests: 446 },
];

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

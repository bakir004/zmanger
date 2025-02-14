"use client";
import CodeEditor from "~/components/CodeEditor";
import TestOutcomeListItem from "~/components/tests/TestOutcomeListItem";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function TestsPage() {
  const runTests = () => {
    // fetch("/api/log");
  };

  return (
    <main className="mx-auto w-full max-w-screen-1280 px-4 pt-8">
      <h1 className="mb-4 text-3xl font-bold">Testovi</h1>
      <section className="flex gap-4">
        <Select defaultValue="TP">
          <SelectTrigger className="w-[180px] focus:outline-none focus:ring-0">
            <SelectValue placeholder="Predmet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TP">TP</SelectItem>
            <SelectItem value="ASP">ASP</SelectItem>
            <SelectItem value="NA">NA</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="Zadaca1-Z1">
          <SelectTrigger className="w-[180px] focus:outline-none focus:ring-0">
            <SelectValue placeholder="Zadatak" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Zadaca1-Z1">Zadaca1-Z1</SelectItem>
            <SelectItem value="Zadaca1-Z2">Zadaca1-Z2</SelectItem>
            <SelectItem value="Zadaca1-Z3">Zadaca1-Z3</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={runTests}
          className="bg-blue-500 hover:bg-blue-400 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
        >
          Pokreni
        </Button>
        <Button
          disabled
          className="bg-red-500 hover:bg-red-400 dark:bg-red-600 dark:text-white dark:hover:bg-red-500"
        >
          Otkaži
        </Button>
      </section>
      <section className="mt-4 flex h-[calc(100dvh-300px)] gap-4">
        <div className="h-full w-5/6">
          <CodeEditor language="cpp" />
        </div>
        <div className="flex w-1/6 flex-col gap-2 text-sm">
          <TestOutcomeListItem passed={true}>Test 1</TestOutcomeListItem>
          <TestOutcomeListItem passed={false}>Test 2</TestOutcomeListItem>
        </div>
      </section>
    </main>
  );
}

"use client";
import { Test, TestGroup } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import CodeEditor from "~/components/CodeEditor";
import TestOutcomeListItem from "~/components/tests/TestOutcomeListItem";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function TestsPage() {
  const [value, setValue] = useState(
    '// Nemojte ovdje kodirati, vas kod nece biti spasen...\n#include <iostream>\nint main(){\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}',
  );
  const [testGroups, setTestGroups] = useState<TestGroup[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("TP");
  const [tests, setTests] = useState<Test[]>([]);
  const onChange = useCallback((val: string) => {
    setValue(val);
  }, []);

  const fetchTestGroups = async (subject: string) => {
    try {
      const res = await fetch("/api/tests/subject/" + subject);
      const data = await res.json();
      setTestGroups(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubjectChange = (value: string) => {
    try {
      setSelectedSubject(value);
      void fetchTestGroups(value);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTestGroupChange = async (value: string) => {
    try {
      const res = await fetch("/api/tests/" + value);
      const data = await res.json();
      data.sort((a: Test, b: Test) => a.id - b.id);
      setTests(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void fetchTestGroups(selectedSubject);
  }, []);

  return (
    <main className="mx-auto w-full max-w-screen-1280 px-4 pt-8">
      <h1 className="mb-4 text-3xl font-bold">Testovi</h1>
      <section className="flex gap-4">
        <Select
          defaultValue="TP"
          value={selectedSubject}
          onValueChange={handleSubjectChange}
        >
          <SelectTrigger className="w-[180px] focus:outline-none focus:ring-0">
            <SelectValue placeholder="Predmet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TP">TP</SelectItem>
            <SelectItem value="ASP">ASP</SelectItem>
            <SelectItem value="NA">NA</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleTestGroupChange}>
          <SelectTrigger className="w-[180px] focus:outline-none focus:ring-0">
            <SelectValue placeholder="Zadatak" />
          </SelectTrigger>
          <SelectContent>
            {testGroups.map((group) => (
              <SelectItem key={group.id} value={group.id.toString()}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          // onClick={runTests}
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
        <div className="h-full w-3/4 md:w-5/6">
          <CodeEditor
            language="cpp"
            value={value}
            onChange={onChange}
            height="100%"
          />
        </div>
        <div className="h-full w-1/4 md:w-1/6">
          <h3 className="h-6">Prošlo 36/50</h3>
          <ScrollArea className="flex h-[calc(100%-1.5rem)] w-full flex-col gap-2 text-sm">
            {tests.map((test: Test) => (
              <TestOutcomeListItem key={test.id} passed={true} test={test}>
                {`Test ${test.number + 1}`}
              </TestOutcomeListItem>
            ))}
          </ScrollArea>
        </div>
      </section>
    </main>
  );
}

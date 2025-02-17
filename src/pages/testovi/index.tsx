/* eslint-disable */
"use client";
import { useUser } from "@clerk/nextjs";
import { Test, TestGroup } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import MonacoCodeEditor from "~/components/MonacoCodeEditor";
import TestOutcomeListItem from "~/components/tests/TestOutcomeListItem";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { TestResult } from "~/lib/types";

let intervalId: NodeJS.Timeout | null = null;

export default function TestsPage() {
  const { user } = useUser();
  const [value, setValue] = useState(
    '// Nemojte ovdje kodirati, vas kod nece biti spasen...\n#include <iostream>\nint main(){\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}',
  );
  const [testGroups, setTestGroups] = useState<TestGroup[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("TP");
  const [selectedTestGroup, setSelectedTestGroup] = useState<string>("");
  const [tests, setTests] = useState<Test[]>([]);
  const onChange = useCallback((val: string | undefined) => {
    if (!val) return;
    setValue(val);
  }, []);
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

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
      setSelectedTestGroup(value);
      setTests(data);
      setTestResults([]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void fetchTestGroups(selectedSubject);
  }, []);

  const runOneTest = async (test: Test) => {
    const filtered = testResults.filter((result) => result.id !== test.number);
    setTestResults([...filtered]);
    const res = await fetch("/api/tests/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: value,
        test: test,
      }),
    });
    const data = await res.json();
    const testResult = data.submissionResult;
    testResult.id = test.number;
    setTestResults((prev) => [...prev, testResult]);
    void fetch("/api/tests/reportSingle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user?.id,
        report: {
          user: user?.fullName,
          email: user?.emailAddresses[0]?.emailAddress ?? "unknown",
          id: test.id,
          number: test.number,
          subject: selectedSubject,
          testGroup: selectedTestGroup,
        },
      }),
    });
  };

  const runTest = (test: Test) => {
    void runOneTest(test);
  };

  const runTests = async () => {
    setTestResults([]);
    setRunning(true);

    let testCounter = 0;
    const runIndividualTest = async () => {
      if (testCounter >= tests.length) {
        if (intervalId) clearInterval(intervalId);
        void fetch("/api/tests/report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user?.id,
            report: {
              user: user?.fullName,
              email: user?.emailAddresses[0]?.emailAddress ?? "unknown",
              passed: testResults.filter(
                (result) =>
                  result.status.description === "Accepted" ||
                  result.status.description === "Core accepted",
              ).length,
              subject: selectedSubject,
              testGroup: selectedTestGroup,
            },
          }),
        });
        console.log(`Stopping tests. ${testCounter} tests ran.`);
        setRunning(false);
        return;
      }
      console.log(`Running test ${testCounter + 1}...`);
      const test = tests[testCounter];
      try {
        testCounter++;
        const res = await fetch("/api/tests/run", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: value,
            test: test,
          }),
        });
        if (!res.ok) {
          const errorData = await res.json();
          console.error(`Error: ${res.status} - ${res.statusText}`, errorData);
          if (intervalId) clearInterval(intervalId);
          return;
        }
        const data = await res.json();
        const testResult = data.submissionResult;
        testResult.id = test?.number;
        setTestResults((prev) => [...prev, testResult]);
      } catch (error) {
        console.error(error);
      }
    };

    await runIndividualTest();
    const DELAY_IN_MILLIS = 400;

    intervalId = setInterval(runIndividualTest, DELAY_IN_MILLIS);
  };

  const cancel = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      setRunning(false);
      console.log("Tests stopped.");
    } else {
      console.log("Tests weren't running.");
    }
  };

  return (
    <main className="mx-auto w-full max-w-screen-1280 px-4 pt-8">
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Testovi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
          onClick={runTests}
          disabled={running}
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-400 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
        >
          Pokreni
          {running && <Loader2 className="animate-spin"></Loader2>}
        </Button>
        <Button
          disabled={!running}
          className="bg-red-500 hover:bg-red-400 dark:bg-red-600 dark:text-white dark:hover:bg-red-500"
          onClick={cancel}
        >
          Otkaži
        </Button>
      </section>
      <section className="mt-4 flex h-[calc(100dvh-400px)] gap-4">
        <div className="h-full w-3/4 md:w-5/6">
          <MonacoCodeEditor
            height="100%"
            value={value}
            onChange={onChange}
            language="cpp"
            options={{
              minimap: { enabled: false },
              lineNumbers: "on",
              lineDecorationsWidth: 0,
              folding: false,
              scrollBeyondLastLine: false,
              stickyScroll: {
                enabled: false,
              },
              fontSize: 14,
            }}
          ></MonacoCodeEditor>
        </div>
        <div className="h-full w-1/4 md:w-1/6">
          {tests.length > 0 && (
            <h3 className="h-6">
              Prošlo{" "}
              {
                testResults.filter(
                  (result) =>
                    result.status.description === "Accepted" ||
                    result.status.description === "Core accepted",
                ).length
              }
              /{testResults.length}
            </h3>
          )}
          <ScrollArea className="flex h-[calc(100%-1.5rem)] w-full flex-col gap-2 text-sm">
            {tests.map((test: Test) => (
              <TestOutcomeListItem
                key={test.id}
                testResult={testResults.find(
                  (testRes) => testRes.id === test.number,
                )}
                test={test}
                onRun={(test: Test) => runTest(test)}
              >
                {`Test ${test.number + 1}`}
              </TestOutcomeListItem>
            ))}
          </ScrollArea>
        </div>
      </section>
    </main>
  );
}

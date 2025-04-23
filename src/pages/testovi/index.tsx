/* eslint-disable */
"use client";
import { useUser } from "@clerk/nextjs";
import { Test, TestGroup } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
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
import { Progress } from "~/components/ui/progress";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { authGuard } from "~/lib/authguard";
import { TestResult } from "~/lib/types";

let intervalId: NodeJS.Timeout | null = null;
const DELAY_IN_MILLIS = 200;

function TestsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [value, setValue] = useState(
    '// Nemojte ovdje kodirati, vas kod nece biti spasen...\n#include <iostream>\nint main(){\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}',
  );
  const [stdinValue, setStdinValue] = useState("");
  const [testGroups, setTestGroups] = useState<TestGroup[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTestGroup, setSelectedTestGroup] = useState<string>("");
  const [loadingTestGroups, setLoadingTestGroups] = useState(false);
  const [loadingSubject, setLoadingSubject] = useState(false);
  const [tests, setTests] = useState<Test[]>([]);
  const onChange = useCallback((val: string | undefined) => {
    if (!val) return;
    setValue(val);
  }, []);
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const onStdinChange = useCallback((val: string | undefined) => {
    if (!val) return;
    setStdinValue(val);
  }, []);

  useEffect(() => {
    if (router.isReady && router.query.subject) {
      setSelectedSubject(router.query.subject as string);
      void fetchTestGroups(router.query.subject as string);
    }
    if (router.isReady && !router.query.subject) {
      setSelectedSubject("TP");
      void fetchTestGroups("TP");
    }
  }, [router.isReady, router.query]);

  const fetchTestGroups = async (subject: string) => {
    try {
      const res = await fetch("/api/tests/subject/" + subject, {
        headers: {
          "x-user-id": user?.id ?? "",
          "x-user-role": user?.publicMetadata?.admin ? "admin" : user?.publicMetadata?.moderator ? "moderator" : "user",
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (!data.testGroups) {
        console.error("No test groups in response:", data);
        return;
      }
      const testGroupResult = data.testGroups;
      console.log(testGroupResult);
      // Sort test groups by name
      testGroupResult.sort((a: TestGroup, b: TestGroup) => (a.name > b.name ? 1 : -1));
      setTestGroups(testGroupResult);
      if (testGroupResult.length > 0) handleTestGroupChange(testGroupResult[0].id.toString());
    } catch (error) {
      console.error("Error fetching test groups:", error);
      setTestGroups([]);
    }
  };

  const handleSubjectChange = async (value: string) => {
    try {
      setLoadingSubject(true);
      setSelectedSubject(value);
      await fetchTestGroups(value);
      setLoadingSubject(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTestGroupChange = async (value: string) => {
    try {
      setLoadingTestGroups(true);
      const res = await fetch("/api/tests/" + value);
      const data = await res.json();
      // Ensure each test has the stdin field
      data.forEach((test: Test) => {
        if (!test.stdin) {
          test.stdin = null;
        }
      });
      data.sort((a: Test, b: Test) => a.id - b.id);
      setSelectedTestGroup(value);
      setTests(data);
      setTestResults([]);
      setLoadingTestGroups(false);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

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
        stdin: selectedSubject === "SOLO" ? stdinValue : undefined,
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
            stdin: selectedSubject === "SOLO" ? stdinValue : undefined,
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
      <section className="flex flex-wrap items-center gap-4">
        <Select
          defaultValue="TP"
          value={selectedSubject}
          onValueChange={handleSubjectChange}
        >
          <SelectTrigger className="w-[180px] focus:outline-none focus:ring-0">
            <SelectValue placeholder="Predmet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SOLO">Solo</SelectItem>
            <SelectItem value="TP">TP</SelectItem>
            <SelectItem value="ASP">ASP</SelectItem>
            <SelectItem value="NA">NA</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={selectedTestGroup}
          onValueChange={handleTestGroupChange}
          disabled={loadingSubject}
        >
          <SelectTrigger className="w-[180px] focus:outline-none focus:ring-0">
            <SelectValue placeholder="Odaberi zadatak" />
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
          disabled={
            running ||
            loadingTestGroups ||
            tests.length === 0 ||
            loadingSubject ||
            selectedSubject === "" ||
            selectedTestGroup === ""
          }
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
        {loadingTestGroups && <p>Učitavam...</p>}
      </section>
      <p className="mt-2 text-red-400 italic font-bold text-sm">Za bilo kakve bugove ili nepoklapanja sa Zamgerom javite se na bakir.cinjarevic@gmail.com.</p>
      <p className="mt-2 text-purple-400 italic font-bold text-sm">Neki testovi vam mogu proći ovdje, ali ne na Zamgeru,
        i to što nekada u Zamger testovima se koriste biblioteke koje vi niste direktno includeali. Vi ih ne biste svakako u svojim kodovima trebali includeati
        - to je Zamgerova odgovornost, ali je takva situacija. Vidjećete na Zamgeru kada vam izbaci grešku koje biblioteke trebaju, a ako želite odmah da vidite
        šta vam treba, pogledajte koje se biblioteke koriste u testovima pa njih includeajte sebi u kod, iako one vama ne trebaju za svrhe samo vašeg koda.</p>
      {selectedSubject === "SOLO" && <p className="mt-2 italic text-sm">
        Kada testirate svoj main, dodajte <code>return 0;</code> na kraj, inače ćete dobivati error &quot;Illegal instruction&quot;.</p>}
      <section className="mt-4 flex gap-4">
        <div className="h-[calc(100dvh-400px)] w-3/4 md:w-5/6">
          <MonacoCodeEditor
            height="75%"
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

          {selectedSubject === "SOLO" && (
            <>
              <p className="px-4 py-2 text-sm text-muted-foreground">
                Standard Input (stdin)
              </p>
              <MonacoCodeEditor
                height="25%"
                language="cpp"
                value={stdinValue}
                onChange={onStdinChange}
                options={{
                  minimap: { enabled: false },
                  lineNumbers: "off",
                  glyphMargin: false,
                  folding: false,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 0,
                }}
              />
            </>
          )}
        </div>
        <div className="h-full w-1/4 md:w-1/6">
          {tests.length > 0 && (
            <>
              <Progress
                className="mb-1 h-2"
                value={(testResults.length / tests.length) * 100}
              />
              <h3 className="h-6">
                {"Prošlo " +
                  testResults.filter(
                    (result) =>
                      result.status.description === "Accepted" ||
                      result.status.description === "Core accepted",
                  ).length +
                  "/" +
                  testResults.length}
              </h3>
            </>
          )}
          <ScrollArea className="flex h-[calc(100%-2.25rem)] w-full flex-col gap-2 text-sm">
            {loadingTestGroups
              ? Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="my-1 h-8 w-full"></Skeleton>
              ))
              : tests.map((test: Test, i: number) => (
                <TestOutcomeListItem
                  index={i}
                  key={i}
                  testResult={testResults.find(
                    (testRes) => testRes.id === test.number,
                  )}
                  test={test}
                  onRun={(test: Test) => runTest(test)}
                >
                  {`Test ${i + 1}`}
                </TestOutcomeListItem>
              ))}
          </ScrollArea>
        </div>
      </section>
    </main>
  );
}

export default authGuard({
  Component: TestsPage,
  props: {},
  requiresTestingPermissions: true,
});

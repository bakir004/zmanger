/* eslint-disable */
import { Test } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import MonacoCodeEditor from "../MonacoCodeEditor";
import { TestResult } from "~/lib/types";
import { Check, CircleHelp, Clock, Loader2, Play, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function TestOutcomeListItem({
  children,
  test,
  testResult,
  onRun,
}: {
  children: React.ReactNode;
  test: Test;
  testResult: TestResult | undefined;
  onRun: (test: Test) => void;
}) {
  const code = test.topOfFile
    ? test.topOfFile + "\n\n"
    : "" +
      "// Vaš kod ide ovdje...\n\n" +
      (test.aboveMain ? test.aboveMain + "\n\n" : "") +
      "int main() {\n" +
      test.main +
      "\n}";

  const leak = testResult?.stderr?.includes("detected memory leaks");
  const passed =
    testResult?.status.description === "Accepted" &&
    !testResult?.stderr &&
    !leak;
  const passedMaybe =
    testResult?.status.description === "Core accepted" &&
    !testResult?.stderr &&
    !leak;
  const [isRunning, setIsRunning] = useState(false);
  useEffect(() => {
    if (testResult) setIsRunning(false);
  }, [testResult]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`my-1 flex w-full cursor-pointer items-center justify-between gap-1 rounded border-l-4 ${!testResult ? "border-l-gray-600" : passed ? "border-l-green-500" : passedMaybe ? "border-l-orange-400" : "border-l-red-500"} bg-slate-100 px-3 py-1 transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800`}
        >
          {children}
          {!isRunning ? (
            <div
              className="rounded bg-slate-200 p-0.5 transition dark:bg-slate-800 dark:hover:bg-slate-700"
              onClick={(e) => {
                e.stopPropagation();
                onRun(test);
                setIsRunning(true);
              }}
            >
              <Play className="h-4 w-4" />
            </div>
          ) : (
            <div className="p-0.5">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-200px)] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Nalaz testa {test.number + 1} -{" "}
            {leak ? "Detected memory leaks" : testResult?.status.description}
          </DialogTitle>
          <DialogDescription>
            Testovi možda nisu u istom redoslijedu kao na Zamgeru
          </DialogDescription>
        </DialogHeader>
        {passedMaybe && (
          <p className="text-sm italic text-orange-400 dark:text-orange-300">
            Test označen narandžastom bojom ili sa &quot;Core accepted&quot;
            znači da se suštinski (ignorišući nevidljive znakove poput \n, \t
            ili razmak) poklapaju vaš izlaz i očekivani izlaz. Ovako obilježeni
            testovi najčešće prolaze na Zamgeru.
          </p>
        )}
        <section>
          <div className="w-full">
            <h3 className="font-semibold">Kod testa</h3>
            <MonacoCodeEditor
              width={"100%"}
              height={"300px"}
              readonly
              value={code}
              language="cpp"
              options={{
                minimap: { enabled: false },
                lineNumbers: "off",
                lineDecorationsWidth: 0,
                folding: false,
                scrollBeyondLastLine: false,
                stickyScroll: {
                  enabled: false,
                },
                fontSize: 13,
              }}
            ></MonacoCodeEditor>
          </div>
          <div>
            <h3 className="my-2 font-semibold">
              Standardni ulaz (<code>stdin</code>){" "}
              {!test.stdin && "- ovaj test ne koristi standardni ulaz"}
            </h3>
            {test.stdin ? (
              <p className="whitespace-pre-wrap rounded bg-slate-200 px-4 py-2 font-mono dark:bg-slate-900">
                {test.stdin}
              </p>
            ) : null}
          </div>
          <div>
            <h3 className="my-2 font-semibold">
              Očekivani izlaz
              {test.expect.length > 1 && "i"}
            </h3>

            {test.expect.map((e, i) => (
              <p
                key={i}
                className="my-2 whitespace-pre-wrap rounded bg-slate-200 px-4 py-2 font-mono dark:bg-slate-900"
              >
                {e}
              </p>
            ))}
          </div>
          <div>
            <h3 className="my-2 font-semibold">Vaš izlaz</h3>
            <div className="whitespace-pre-wrap rounded bg-slate-200 px-4 py-2 font-mono dark:bg-slate-900">
              {testResult?.stdout}
              <p className="text-xs text-red-500 dark:text-red-400">
                {testResult?.stderr
                  ? testResult?.stderr
                  : testResult?.compile_output}
              </p>
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}

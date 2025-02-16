/* eslint-disable */
import { Test } from "@prisma/client";
import CodeEditor from "../CodeEditor";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function TestOutcomeListItem({
  passed,
  children,
  test,
}: {
  passed: boolean;
  children: React.ReactNode;
  test: Test;
}) {
  const code = test.topOfFile
    ? test.topOfFile + "\n\n"
    : "" +
      (test.aboveMain ? test.aboveMain + "\n\n" : "") +
      "int main() {\n" +
      test.main +
      "\n}";
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`my-1 w-full cursor-pointer rounded border-l-4 ${passed ? "border-l-green-400" : "border-l-red-400"} bg-slate-100 px-3 py-1 transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800`}
        >
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Nalaz testa {test.number + 1} - Test je prošao!
          </DialogTitle>
          <DialogDescription>
            Testovi možda nisu u istom redoslijedu kao na Zamgeru
          </DialogDescription>
        </DialogHeader>
        <section>
          <div className="w-full max-w-3xl text-sm">
            <h3 className="text-md font-semibold">Kod testa</h3>
            <CodeEditor
              width="100%"
              maxHeight="400px"
              language="cpp"
              value={code}
              readonly
            />
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
                className="my-2 rounded bg-slate-200 px-4 py-2 font-mono dark:bg-slate-900"
              >
                {e}
              </p>
            ))}
          </div>
          <div>
            <h3 className="my-2 font-semibold">Vaš izlaz</h3>
            <p className="rounded bg-slate-200 px-4 py-2 font-mono dark:bg-slate-900">
              9999
            </p>
          </div>
        </section>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            {/* <Button type="button" variant="secondary">
              Close
            </Button> */}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

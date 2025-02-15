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
}: {
  passed: boolean;
  children: React.ReactNode;
}) {
  const stdin = `1 2 2\n3 4`;
  const code =
    "// Test performansi BinStabloMape\nBinStabloMapa <int, int> m;\nfor (int i(1000); i>-1000; i--)\n    m[i] = i*i;\ncout << m[-100];";
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`w-full cursor-pointer rounded border-l-4 ${passed ? "border-l-green-400" : "border-l-red-400"} bg-slate-100 px-3 py-1 transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800`}
        >
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Nalaz testa - Test je prošao!</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <section>
          <div className="w-full max-w-full overflow-hidden">
            <h3 className="font-semibold">Kod testa</h3>
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
              Standardni ulaz (<code>stdin</code>)
            </h3>
            <p className="whitespace-pre-wrap rounded px-4 py-2 font-mono dark:bg-slate-900">
              {stdin}
            </p>
          </div>
          <div>
            <h3 className="my-2 font-semibold">Očekivani izlaz</h3>
            <p className="rounded px-4 py-2 font-mono dark:bg-slate-900">
              10000
            </p>
          </div>
          <div>
            <h3 className="my-2 font-semibold">Vaš izlaz</h3>
            <p className="rounded px-4 py-2 font-mono dark:bg-slate-900">
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

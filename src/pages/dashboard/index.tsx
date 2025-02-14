/* eslint-disable */
"use client";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "next-themes";
import { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { FileJson } from "lucide-react";
import { testJsonFormatter } from "~/lib/formatter";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import CodeEditor from "~/components/CodeEditor";
import { decodeHtmlEntities, formattedJsonTemplate } from "~/lib/utils";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { testShapeChecker } from "~/lib/testShapeChecker";

export default function DashboardPage() {
  const { theme } = useTheme();
  const [valueOriginal, setValueOriginal] = useState("");
  const [valueFormatted, setValueFormatted] = useState("");
  const [testGroupName, setTestGroupName] = useState("");
  const [testGroupSubject, setTestGroupSubject] = useState("");
  const [error, setError] = useState<string | null>(null);
  const onChangeOriginal = useCallback((val: string) => {
    setValueOriginal(val);
    setError(null);
  }, []);
  const onChangeFormatted = useCallback((val: string) => {
    setValueFormatted(val);
    setError(null);
  }, []);
  const codeMirrorTheme = theme === "dark" ? vscodeDark : vscodeLight;

  const autoformatJSON = () => {
    try {
      const json = JSON.parse(valueOriginal);
      const formattedJson = testJsonFormatter(json);
      setValueFormatted(JSON.stringify(formattedJson, null, 2));
    } catch (e: any) {
      setError("JSON nije validan: " + e.message);
    }
  };

  const autoformatRaw = () => {
    try {
      const formattedJsonString = decodeHtmlEntities(valueOriginal);
      const parsed = JSON.parse(formattedJsonString);
      const formattedJson = testJsonFormatter(parsed);
      setValueFormatted(JSON.stringify(formattedJson, null, 2));
    } catch (e: any) {
      setError("JSON nije validan: " + e.message);
    }
  };

  const submit = () => {
    try {
      const json = testShapeChecker(valueFormatted);
      console.log(json);
    } catch (e: any) {
      setError("JSON nije validan: " + e.message);
    }
  };

  return (
    <main className="mx-auto max-w-screen-1280 px-4 pt-8">
      <h1 className="text-2xl font-bold">Dodavanje testova</h1>
      <p className="my-2">
        Pasteati originalni JSON sa Zamgera u lijevi dio, pa pritisnite dugme
        &quot;Autoformat&quot; na dnu stranice. Ako nakon toga JSON ne prati{" "}
        <Dialog>
          <DialogTrigger asChild>
            <span className="cursor-pointer font-extrabold underline">
              traženi format
            </span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Pravilan oblik JSON objekta</DialogTitle>
              <DialogDescription>
                Ne pridržavanje ovoga će rezultirati velikim problemima
              </DialogDescription>
              <div>
                Format JSON objekta u desnom (formatiranom) dijelu mora pratiti
                sljedeći oblik:
              </div>
              <CodeEditor
                language="json"
                initCode={formattedJsonTemplate}
                readonly
              />
              <div>
                Dakle, <code>tests</code> je niz objekata. Svaki objekt mora
                imati svoj <code>id</code>, <code>patch</code>, i{" "}
                <code>expect</code> (<code>stdin</code> je neobavezan).{" "}
                <code>patch</code> je niz od maksimalno 3 elementa koji opisuje
                strukturu testa. Samo je objekat sa poljem{" "}
                <code>position: &quot;main&quot;</code> obavezan.
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        , popravite ga unutar desnog dijela i submitajte.
      </p>
      <section className="mb-4 flex gap-4">
        <div className="w-[calc(50%-0.5rem)]">
          <h3 className="text-lg font-semibold">Originalni JSON</h3>
          <div className="h-[600px] w-full text-xs">
            <CodeMirror
              value={valueOriginal}
              width="100%"
              height="100%"
              extensions={[json()]}
              onChange={onChangeOriginal}
              theme={codeMirrorTheme}
            />
          </div>
        </div>
        <div className="w-[calc(50%-0.5rem)]">
          <h3 className="text-lg font-semibold">Formatirani JSON</h3>
          <div className="h-[600px] w-full text-xs">
            <CodeMirror
              value={valueFormatted}
              width="100%"
              height="100%"
              extensions={[json()]}
              onChange={onChangeFormatted}
              theme={codeMirrorTheme}
            />
          </div>
        </div>
      </section>
      <div className="flex w-full items-center justify-between gap-4">
        <Button onClick={autoformatJSON} className="">
          Autoformat JSON
        </Button>
        <Button onClick={autoformatRaw} className="">
          Autoformat sa konverzijom specijalnih karaktera
        </Button>
        {/* <Label htmlFor="testgroup">Dadnite ime skupu testova:</Label> */}
        <Input
          id="testgroup"
          required
          placeholder="Naziv skupa testova (npr. Zadaca1-Z1)"
          onChange={(e) => setTestGroupName(e.target.value)}
        ></Input>
        <Select onValueChange={(val) => setTestGroupSubject(val)}>
          <SelectTrigger className="w-[300px] focus:outline-none focus:ring-0">
            <SelectValue placeholder="Predmet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TP">TP</SelectItem>
            <SelectItem value="ASP">ASP</SelectItem>
            <SelectItem value="NA">NA</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={submit}
          className="bg-blue-500 hover:bg-blue-400 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400"
          disabled={
            valueFormatted.length <= 0 ||
            testGroupName.length <= 0 ||
            testGroupSubject.length <= 0
          }
        >
          Potvrdi
        </Button>
      </div>
      {error && (
        <Alert variant={"destructive"} className="mt-4">
          <FileJson className="h-4 w-4" />
          <AlertTitle>Zmanger ne može autoformatirati vaš kod</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </main>
  );
}

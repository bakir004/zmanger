/* eslint-disable */
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { FileJson } from "lucide-react";
import { testJsonFormatter } from "~/lib/formatter";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
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
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { authGuard } from "~/lib/authguard";
import DashboardPageWrapper from "~/components/DashboardPageWrapper";
import MonacoCodeEditor from "~/components/MonacoCodeEditor";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";

function AddTestsPage() {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  const [valueOriginal, setValueOriginal] = useState("");
  const [valueFormatted, setValueFormatted] = useState("");
  const [testGroupName, setTestGroupName] = useState("");
  const [testGroupSubject, setTestGroupSubject] = useState("");
  const [error, setError] = useState<string | null>(null);
  const onChangeOriginal = useCallback((val: string | undefined) => {
    if (!val) return;
    setValueOriginal(val);
    setError(null);
  }, []);
  const onChangeFormatted = useCallback((val: string | undefined) => {
    if (!val) return;
    setValueFormatted(val);
    setError(null);
  }, []);

  const autoformatJSON = () => {
    try {
      const formattedJsonString = decodeHtmlEntities(valueOriginal);
      const parsed = JSON.parse(formattedJsonString);
      const formattedJson = testJsonFormatter(parsed);
      setValueFormatted(JSON.stringify(formattedJson, null, 2));
    } catch (e: any) {
      setError("JSON nije validan: " + e.message);
    }
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log("asd");
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn]);

  const submit = async () => {
    try {
      const json = testShapeChecker(valueFormatted);
      const res = fetch("/api/tests/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify({
          user: user?.id,
          testsObject: json,
          testGroupName,
          testGroupSubject,
        }),
      });
      toast.promise(res, {
        loading: "Testovi se dodaju...",
        success: () => {
          return `Testovi su uspješno dodani!`;
        },
        error: "Desila se greška prilikom dodavanja testova",
      });
      const resres = await res;
      if (resres.ok) {
        router.push("/dashboard/tests");
      }
    } catch (e: any) {
      setError("JSON nije validan: " + e.message);
    }
  };

  return (
    <DashboardPageWrapper>
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dodaj testove</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader className="text-left">
              <DialogTitle>Pravilan oblik JSON objekta</DialogTitle>
              <DialogDescription>
                Ne pridržavanje ovoga će rezultirati velikim problemima
              </DialogDescription>
            </DialogHeader>
            <div>
              Format JSON objekta u desnom (formatiranom) dijelu mora pratiti
              sljedeći oblik:
            </div>
            <div className="w-full overflow-x-hidden">
              <MonacoCodeEditor
                height="400px"
                value={formattedJsonTemplate}
                language="json"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  lineNumbers: "off",
                  lineDecorationsWidth: 0,
                  folding: false,
                  scrollBeyondLastLine: false,
                  guides: {
                    indentation: false,
                  },
                }}
              ></MonacoCodeEditor>
            </div>
            <div>
              Dakle, <code>tests</code> je niz objekata. Svaki objekt mora imati
              svoj <code>id</code>, <code>patch</code>, i <code>expect</code> (
              <code>stdin</code> je neobavezan). <code>patch</code> je niz od
              maksimalno 3 elementa koji opisuje strukturu testa. Ako ne postoji
              kod na poziciji <code>main</code>, smatra se da se koristi
              korisnikov main. <code>expect</code> je niz stringova.
            </div>
          </DialogContent>
        </Dialog>
        , popravite ga unutar desnog dijela. Nakon toga, dadnite ime skupu
        testova i odaberite za koji predmet važe.
      </p>
      <section className="mb-4 flex w-full gap-4 overflow-x-hidden">
        <div className="w-1/2 overflow-x-hidden">
          <h3 className="text-lg font-semibold">Originalni JSON</h3>
          <MonacoCodeEditor
            height="400px"
            value={valueOriginal}
            onChange={onChangeOriginal}
            language="json"
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

        <div className="w-1/2 overflow-x-hidden">
          <h3 className="text-lg font-semibold">Formatirani JSON</h3>
          <MonacoCodeEditor
            height="400px"
            value={valueFormatted}
            onChange={onChangeFormatted}
            language="json"
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
      </section>
      <div className="flex w-full flex-wrap items-center justify-between gap-4">
        <div className="flex flex-grow gap-4">
          <Button onClick={autoformatJSON} className="">
            Autoformat JSON
          </Button>
          <Input
            id="testgroup"
            required
            placeholder="Naziv skupa testova (npr. Zadaca1-Z1)"
            onChange={(e) => setTestGroupName(e.target.value)}
          //   className="max-w-[300px]"
          ></Input>
        </div>
        <div className="flex flex-wrap gap-4">
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
      </div>
      {error && (
        <Alert variant={"destructive"} className="mt-4">
          <FileJson className="h-4 w-4" />
          <AlertTitle>Zmanger ne može autoformatirati vaš kod</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </DashboardPageWrapper>
  );
}

export default authGuard({
  Component: AddTestsPage,
  props: {},
  needModerator: true,
});

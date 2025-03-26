/* eslint-disable */
"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Edit, FileJson, RefreshCcw } from "lucide-react";

import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { testShapeChecker } from "~/lib/testShapeChecker";
import { toast } from "sonner";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Tests } from "~/lib/types";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useUser } from "@clerk/nextjs";
import MonacoCodeEditor from "./MonacoCodeEditor";

export type TestGroup = {
  id: number;
  name: string;
  subject: string;
  phase: string;
  json: Tests;
};

export const columns: ColumnDef<TestGroup>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Ime grupe testova",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "testCount",
    header: () => {
      return "Broj testova";
    },
    cell: ({ row }) => (
      <div className="text-center lowercase">
        {row.original.json.tests.length}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "subject",
    header: () => <div className="text-right">Predmet</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("subject")}</div>
      );
    },
  },
  {
    accessorKey: "phase",
    header: () => <div className="text-right">Faza</div>,
    cell: ({ row }) => {
      const phase = (row.getValue("phase") ?? "testing") as string;
      const { user } = useUser();

      const togglePhase = async () => {
        const newPhase = phase === "testing" ? "production" : "testing";
        try {
          const res = await fetch("/api/tests/phase/" + row.original.id, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phase: newPhase,
              user: user?.id,
            }),
          });
          if (res.ok) {
            toast.success(`Faza promijenjena u ${newPhase}`);
          } else {
            toast.error("Greška pri promjeni faze");
          }
        } catch (error) {
          toast.error("Greška pri promjeni faze");
        }
      };

      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant={phase === "production" ? "default" : "outline"}
            size="sm"
            onClick={togglePhase}
          >
            {phase === "production" ? "Produkcija" : "Testiranje"}
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-right">Ažuriranje</div>,
    cell: ({ row }) => {
      const { user } = useUser();
      const [value, setValue] = React.useState(
        JSON.stringify(row.original.json, null, 2),
      );
      const [error, setError] = React.useState("");
      const [testGroupName, setTestGroupName] = React.useState(
        row.original.name,
      );
      const [testGroupSubject, setTestGroupSubject] = React.useState(
        row.original.subject,
      );
      const onChange = React.useCallback((val: string | undefined) => {
        if (!val) return;
        setValue(val);
        setError("");
      }, []);
      const handleTestGroupNameChange = (
        e: React.ChangeEvent<HTMLInputElement>,
      ) => {
        setTestGroupName(e.target.value);
      };
      const submit = async () => {
        try {
          const json = testShapeChecker(value);
          const res = fetch("/api/tests/update/" + row.original.id, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              testsObject: json,
              testGroupName,
              testGroupSubject,
              user: user?.id,
            }),
          });
          toast.promise(res, {
            loading: "Testovi se ažuriraju...",
            success: () => {
              return `Testovi su se uspješno ažurirali! Refreshujte da vidite promjene.`;
            },
            error: "Desila se greška prilikom ažuriranja testova",
          });
        } catch (e: any) {
          setError("JSON nije validan: " + e.message);
        }
      };
      return (
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex w-full justify-end text-right">
              <Edit className="h-5 w-5 cursor-pointer"></Edit>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Ažuriraj {row.original.name}</DialogTitle>
              <DialogDescription>
                Zatvaranje ovog prozora bez spašavanja će odbaciti sve promjene.
              </DialogDescription>
            </DialogHeader>
            <div className="w-full max-w-full overflow-hidden text-sm">
              <MonacoCodeEditor
                height="400px"
                value={value}
                onChange={onChange}
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
            {error && (
              <Alert variant={"destructive"} className="mt-4">
                <FileJson className="h-4 w-4" />
                <AlertTitle>Promjene se ne mogu spasiti</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <DialogFooter className="flex justify-start gap-2 sm:justify-end">
              <Input
                id="testgroup"
                required
                placeholder="Naziv skupa testova (npr. Zadaca1-Z1)"
                onChange={handleTestGroupNameChange}
                value={testGroupName}
              ></Input>
              <Select
                value={testGroupSubject}
                onValueChange={(val) => setTestGroupSubject(val)}
              >
                <SelectTrigger className="w-[300px] focus:outline-none focus:ring-0">
                  <SelectValue placeholder="Predmet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TP">TP</SelectItem>
                  <SelectItem value="ASP">ASP</SelectItem>
                  <SelectItem value="NA">NA</SelectItem>
                </SelectContent>
              </Select>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Zatvori
                </Button>
              </DialogClose>
              <Button type="button" onClick={submit}>
                Spasi promjene
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

export function TestsDataTable() {
  const { user } = useUser();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [testGroups, setTestGroups] = React.useState<TestGroup[]>([]);
  const [loading, setLoading] = React.useState(true);

  const getTests = async () => {
    setLoading(true);
    const res = await fetch("/api/tests/get", {
      headers: {
        "x-user-id": user?.id ?? "",
      },
    });

    if (res.ok) {
      setLoading(false);
      const data = await res.json();
      console.log(data.testGroups);
      setTestGroups([
        ...data.testGroups.map((group: TestGroup) => ({
          ...group,
          phase: group.phase ?? "testing", // Ensure phase has a default value
        })).sort((a: TestGroup, b: TestGroup) => {
          return a.id - b.id;
        }),
      ]);
    } else {
      toast.error("Desila se greška prilikom učitavanja testova");
    }
  };

  const deleteTestGroup = async () => {
    try {
      const selectedIds = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original.id);
      const res = fetch("/api/tests/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds, user: user?.id }),
      });
      toast.promise(res, {
        loading: "Testovi se brišu...",
        success: () => {
          return `Testovi su se uspješno obrisali!`;
        },
        error: "Desila se greška prilikom brisanja testova",
      });
      const resres = await res;
      if (resres.ok) {
        getTests();
      }
    } catch (e: any) {
      toast.error("Desila se greška prilikom brisanja testova: " + e.message);
    }
  };

  React.useEffect(() => {
    void getTests();
  }, []);

  const table = useReactTable({
    data: testGroups,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageSize: 100,
        pageIndex: 0,
      },
    },
  });

  return (
    <div className="w-full">
      <div className="mt-4 rounded-md border border-slate-600">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="border-slate-600" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="border-slate-600"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nema rezultata
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} od{" "}
          {table.getFilteredRowModel().rows.length} redova izabrano.
        </div>
        {/* {loading && <p className="flex gap-1 text-sm italic">Učitavam...</p>} */}

        <Button
          disabled={loading}
          variant={"outline"}
          size="icon"
          onClick={() => void getTests()}
        >
          <RefreshCcw
            className={`${loading ? "animate-spin" : ""} h-4 w-4`}
          ></RefreshCcw>
        </Button>
        <Link href="/dashboard/tests/add">
          <Button variant={"secondary"}>Dodaj testove</Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant={"destructive"}
              disabled={table.getFilteredSelectedRowModel().rows.length === 0}
            >
              Obrisi selekciju
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Jeste li sigurni da želite obrisati odabrane testove?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Ova radnja je nepovratna. Da li ste sigurni da želite obrisati?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Otkaži</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button onClick={deleteTestGroup}>Obriši</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

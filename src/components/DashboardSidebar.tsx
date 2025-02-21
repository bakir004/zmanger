import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronsUpDown } from "lucide-react";
// import { ChevronDown } from "lucide-react";

export default function DashboardSidebar() {
  return (
    <div className="sidebar hidden w-[200px] flex-shrink-0 sm:block">
      <Link href="/dashboard" className="mb-1">
        <Button
          variant={"link"}
          className="pl-0 text-lg font-bold dark:text-slate-300"
        >
          Dashboard
        </Button>
      </Link>
      <Collapsible defaultOpen className="w-full">
        <CollapsibleTrigger className="w-full" asChild>
          <Button
            variant="link"
            className="flex h-6 w-full items-center justify-start px-0 text-left dark:text-slate-300"
          >
            Testovi
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="ml-1 border-l border-slate-600">
          <Link href="/dashboard/tests">
            <Button
              variant="link"
              className="flex h-6 w-full items-center justify-between pl-3 text-left dark:text-slate-300"
            >
              Pregled testova
            </Button>
          </Link>
          <Link href="/dashboard/tests/add">
            <Button
              variant="link"
              className="flex h-6 w-full items-center justify-between pl-3 text-left dark:text-slate-300"
            >
              Dodaj testove
            </Button>
          </Link>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible defaultOpen className="w-full">
        <CollapsibleTrigger className="w-full" asChild>
          <Button
            variant="link"
            className="flex h-6 w-full items-center justify-start px-0 text-left dark:text-slate-300"
          >
            Svasta
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="ml-1 border-l border-slate-600">
          <Link href="/dashboard/tests">
            <Button
              variant="link"
              className="flex h-6 w-full items-center justify-between pl-3 text-left dark:text-slate-300"
            >
              Permisije
            </Button>
          </Link>
          <Link href="/dashboard/tests">
            <Button
              variant="link"
              className="flex h-6 w-full items-center justify-between pl-3 text-left dark:text-slate-300"
            >
              Banjole
            </Button>
          </Link>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronsUpDown, Plus, ShieldCheck, User, ClipboardCheck, List } from "lucide-react";
import { useUser } from "@clerk/nextjs";
// import { ChevronDown } from "lucide-react";

export default function DashboardSidebar() {
  const { user } = useUser();
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
            <ClipboardCheck className="w-4 h-4" />
            Testovi
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="ml-1 border-l border-slate-600">
          <Link href="/dashboard/tests">
            <Button
              variant="link"
              className="flex h-6 w-full items-center justify-start pl-3 text-left dark:text-slate-300"
            >
              <List className="w-4 h-4" />
              Pregled testova
            </Button>
          </Link>
          <Link href="/dashboard/tests/add">
            <Button
              variant="link"
              className="flex h-6 w-full items-center justify-start pl-3 text-left dark:text-slate-300"
            >
              <Plus className="w-4 h-4" />
              Dodaj testove
            </Button>
          </Link>
        </CollapsibleContent>
      </Collapsible>
      {(user?.publicMetadata as { admin?: boolean })?.admin && (
        <Collapsible defaultOpen className="w-full">
          <CollapsibleTrigger className="w-full" asChild>
            <Button
              variant="link"
              className="flex h-6 w-full items-center justify-start px-0 text-left dark:text-slate-300"
            >
              <User className="w-4 h-4" />
              Admin
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-1 border-l border-slate-600">
            <Link href="/dashboard/permissions">
              <Button
                variant="link"
                className="flex h-6 w-full items-center justify-start pl-3 text-left dark:text-slate-300"
              >
                <ShieldCheck className="w-4 h-4" />
                Permisije
              </Button>
            </Link>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

import Link from "next/link";
import DashboardPageWrapper from "~/components/DashboardPageWrapper";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { authGuard } from "~/lib/authguard";

function DashboardPage() {
  return (
    <DashboardPageWrapper>
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col">
        <Link href="/dashboard/tests">
          <Button variant={"link"} className="underline">
            Pregled testova
          </Button>
        </Link>
        <Link href="/dashboard/tests/add">
          <Button variant={"link"} className="underline">
            Dodaj testove
          </Button>
        </Link>
      </div>
    </DashboardPageWrapper>
  );
}

export default authGuard({
  Component: DashboardPage,
  props: {},
  needModerator: true,
});


/* eslint-disable */
import DashboardPageWrapper from "~/components/DashboardPageWrapper";
import { TestsDataTable } from "~/components/TestsDataTable";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { authGuard } from "~/lib/authguard";

function DashboardTests() {
  return (
    <DashboardPageWrapper>
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pregled testova</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-bold">Testovi</h1>
      <TestsDataTable />
    </DashboardPageWrapper>
  );
}

export default authGuard({
  Component: DashboardTests,
  props: {},
  needModerator: true,
});

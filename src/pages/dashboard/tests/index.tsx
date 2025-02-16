/* eslint-disable */
import DashboardPageWrapper from "~/components/DashboardPageWrapper";
import { TestsDataTable } from "~/components/TestsDataTable";
import { authGuard } from "~/lib/authguard";

function DashboardTests() {
  return (
    <DashboardPageWrapper>
      <h1 className="text-3xl font-bold">Testovi</h1>
      <TestsDataTable />
    </DashboardPageWrapper>
  );
}

export default authGuard({ Component: DashboardTests, props: {} });

/* eslint-disable */
import { TestsDataTable } from "~/components/TestsDataTable";

export default function DashboardTests() {
  return (
    <main className="mx-auto max-w-screen-1280 px-4 pt-8">
      <h1 className="text-3xl font-bold">Testovi</h1>
      <TestsDataTable />
    </main>
  );
}

import DashboardSidebar from "./DashboardSidebar";

export default function DashboardPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-screen-1280 gap-4 px-4 pt-8">
      <DashboardSidebar />
      <div className="w-full flex-grow">{children}</div>
    </main>
  );
}

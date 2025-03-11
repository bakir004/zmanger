import AboutSidebar from "./AboutSidebar";

export default function AboutPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-screen-1280 gap-4 px-4 pt-8">
      <AboutSidebar />
      <div className="w-full flex-grow">{children}</div>
    </main>
  );
}

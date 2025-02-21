import ASPTestCard from "~/components/homepage/ASPTestCard";
import CostCard from "~/components/homepage/CostCard";
import NATestCard from "~/components/homepage/NATestCard";
import RPRTestCard from "~/components/homepage/RPRTestCard";
import ServerInfoCard from "~/components/homepage/ServerInfoCard";
import TestNumberChart from "~/components/homepage/TestNumberChart";
import TestsCard from "~/components/homepage/TestsCard";
import TPTestCard from "~/components/homepage/TPTestCard";
import UsersCard from "~/components/homepage/UsersCard";
import VaktijaCard from "~/components/homepage/VaktijaCard";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-screen-1280 px-4 pt-12">
      <h1 className="mb-4 text-3xl font-extrabold">Dobrodošli na Zmanger!</h1>
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <CostCard />
        <TestsCard />
        <VaktijaCard />
        <UsersCard />
      </section>
      <section className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <TestNumberChart />
        <ServerInfoCard />
      </section>
      <section className="xs:grid-cols-2 mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
        <ASPTestCard />
        <TPTestCard />
        <NATestCard />
        <RPRTestCard />
      </section>
    </main>
  );
}

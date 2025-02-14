import ASPTestCard from "~/components/homepage/ASPTestCard";
import CostCard from "~/components/homepage/CostCard";
import NATestCard from "~/components/homepage/NATestCard";
import NewsCard from "~/components/homepage/NewsCard";
import RPRTestCard from "~/components/homepage/RPRTestCard";
import TestNumberChart from "~/components/homepage/TestNumberChart";
import TestsCard from "~/components/homepage/TestsCard";
import TPTestCard from "~/components/homepage/TPTestCard";
import UsersCard from "~/components/homepage/UsersCard";
import VaktijaCard from "~/components/homepage/VaktijaCard";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-screen-1280 px-4 pt-12">
      <h1 className="mb-4 text-3xl font-extrabold">Dobrodošli na Zmanger!</h1>
      <section className="flex justify-between gap-4">
        <CostCard />
        <TestsCard />
        <VaktijaCard />
        <UsersCard />
      </section>
      <section className="mt-4 flex gap-4">
        <TestNumberChart />
        <NewsCard />
      </section>
      <section className="mt-4 flex gap-4">
        <ASPTestCard />
        <TPTestCard />
        <NATestCard />
        <RPRTestCard />
      </section>
    </main>
  );
}

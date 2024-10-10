import { HydrateClient } from "~/trpc/server";
import OfferList from "./_components/OfferList";

export default async function HomePage() {
  return (
    <main className="mx-auto max-w-[1280px] p-4 sm:mt-12">
      <h1 className="mb-4 text-2xl font-bold">Aktivne razmjene termina</h1>
      <OfferList></OfferList>
    </main>
  );
}

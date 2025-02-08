import { TestPage } from "./../_components/TestPage";
import { api, HydrateClient } from "~/trpc/server";
import SuspenseWrapper from "../_components/LoadingSuspenseWrapper";

export default async function AspPage() {
  const fileNames = await api.coderunner.getTestFileNames();

  return (
    <SuspenseWrapper>
      <HydrateClient>
        Hvala na koristenju Zmangera. Slijedi maintenance period do izlaska prve
        zadace iz TPa.
        {/* <TestPage fileNames={fileNames} /> */}
      </HydrateClient>
    </SuspenseWrapper>
  );
}

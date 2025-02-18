/* eslint-disable */
import { Check } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export default function PricingPage() {
  return (
    <main className="mx-auto w-full max-w-screen-1280 px-4 pt-8">
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pricing</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="my-4 text-center text-3xl font-bold">Pricing</h1>
      <p className="mx-auto w-[60ch] text-center">
        Budući da server hosting košta, testove mogu pokretati samo oni koji se
        pretplate. Omogućene su dvije vrlo povoljne opcije:
      </p>
      <section className="mx-auto mt-8 flex w-full items-stretch justify-center gap-4">
        <Card className="w-[400px] text-center shadow-lg">
          <CardHeader>
            <CardTitle>Po zadaći (TP)</CardTitle>
            <CardDescription>
              Pravo na testiranje se oduzima sa rokom zadaće
            </CardDescription>
            <h1 className="bg-gradient-to-r from-[#e84e38] to-[#ba2cb8] bg-clip-text text-4xl font-extrabold text-transparent">
              4 KM
            </h1>
            <Separator />
          </CardHeader>
          <CardContent className="mx-auto w-11/12 text-left text-sm">
            <ul>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4"></Check>
                <p>Ispadne 5 KM skuplje od semestralnog</p>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4"></Check>
                <p>Neograničen broj testiranja</p>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4"></Check>
                <p>Address sanitizer za detekciju svih grešaka</p>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="w-[400px] text-center shadow-lg">
          <CardHeader>
            <CardTitle>Semestralno</CardTitle>
            <CardDescription>Jednom platite za čitav semestar</CardDescription>
            <h1 className="bg-gradient-to-r from-[#00dbde] to-[#fc00ff] bg-clip-text text-4xl font-extrabold text-transparent">
              15 KM
            </h1>
            <Separator />
          </CardHeader>
          <CardContent className="mx-auto w-11/12 text-left text-sm">
            <ul>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4"></Check>
                <p>Uštedite do 33% u odnosu na prvi plan</p>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4"></Check>
                <p>Neograničen broj testiranja</p>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4"></Check>
                <p>Address sanitizer za detekciju svih grešaka</p>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4"></Check>
                <p>Pristup svim mogućnostima Zmangera</p>
              </li>
            </ul>
            <p className="mt-3">
              Cijena za semestralnu pretplatu opada za <strong>2KM</strong> za
              svaku zadaću iz TP čiji rok istekne.
            </p>
          </CardContent>
        </Card>
      </section>
      <p className="mx-auto mt-8 w-[60ch] text-center">
        Plaćanje se vrši uživo i permisije za testiranje se daju na licu mjesta.
        Kontaktirajte admina za sastanak.
      </p>
    </main>
  );
}

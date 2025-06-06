/* eslint-disable */
import { Separator } from "@radix-ui/react-separator";
import { Check } from "lucide-react";
import AboutPageWrapper from "~/components/AboutPageWrapper";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "~/components/ui/breadcrumb";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";

export default function AboutPage() {
  return (
    <AboutPageWrapper>
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/about">O Zmangeru</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pretplata</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="my-4 text-center text-3xl font-bold">Pretplata</h1>
      <p className="mx-auto max-w-[60ch] text-center">
        Budući da server hosting košta, testove mogu pokretati samo oni koji se
        pretplate. Zbog nedavne promjene bodova na (TP) zadaćama sa 20 na 10, omogućena je jedna vrlo povoljna opcija:
      </p>
      <section className="mx-auto mt-8 flex w-full flex-wrap items-stretch justify-center gap-4">
        <Card className="w-[400px] text-center shadow-lg">
          <CardHeader>
            <CardTitle>Semestralno</CardTitle>
            <CardDescription>Jednom platite za čitav semestar</CardDescription>
            <h1 className="bg-gradient-to-r from-[#00dbde] to-[#fc00ff] bg-clip-text text-4xl font-extrabold text-transparent">
              10 KM
            </h1>
            <Separator />
          </CardHeader>
          <CardContent className="mx-auto w-11/12 text-left text-sm">
            <ul>
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
          </CardContent>
        </Card>
      </section>
      <p className="mx-auto mt-8 max-w-[60ch] text-center">
        Plaćanje se vrši uživo i permisije za testiranje se daju na licu mjesta.
        Kontaktirajte admina za sastanak.
      </p>
    </AboutPageWrapper>
  );
}

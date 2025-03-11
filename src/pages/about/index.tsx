/* eslint-disable */
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "~/components/ui/breadcrumb";

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-screen-1280 px-4 pt-8">
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>O Zmangeru</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="max-w-[60ch] mx-auto text-justify">
        <div className="flex items-center flex-col mb-6">
          <Image src="/favicon.ico" width={70} height={70} alt="smijesna slika" />
          <h1 className="my-2 text-3xl font-bold">Zmanger</h1>
          <p className="italic">Pomoćna aplikacija za lakši život na ETF-u</p>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-xl text-center font-bold">Šta je Zmanger?</h3>
          <p>
            <strong>Zmanger</strong> je nastao kao rješenje nekim frustracijama na ETF-u.
            Nerijetko se dešavalo da pokretanje testova na c9 jednostavno nije radilo i nije hvatalo sve greške,
            pa se student iznenadi kada mu testovi onda na Zamgeru ne prolaze.
            Također, pogotovo pred rokove zadaća, čekanje na pokretanje testova na Zamgeru je nezgodno.
          </p>
          <p>
            Iz ovog razloga, Zmanger nudi mogućnost testiranja testova sa Zamgera sa <em>address sanitizerom</em>,
            istim runtime memory detektorom kao na Zamgeru, kojim je moguće detektovati greške i bugove u realnom vremenu,
            umjesto da se čeka na rezultat testova na Zamgeru tek sutradan.
          </p>
          <p>
            Uz ovo, na počecima semestara, studenti često ne uspiju upasti na željene termine za vježbe,
            pa pišu na grupu odsjeka za izmjene 1-za-1, ali se znaju pojedine ponude izgubiti u porukama.
            Zmanger nudi centralizovano mjesto, <Link href="/groups" className="underline text-emerald-600">grupomjenjač</Link>, gdje svi mogu staviti
            termine koje imaju i termine koje žele, i na taj način lakše pronaći potencijalnu izmjenu.
          </p>
          <h3 className="text-xl text-center font-bold">Kako se pristupa Zmangeru?</h3>
          <p>
            Zmanger je isključivo namijenjen studentima ETF-a, stoga je potrebno prijaviti se
            pomoću ETF emaila (@etf.unsa.ba) kako bi sve mogućnosti Zmangera bile dostupne.{" "}
            <SignedOut>
              Prijaviti se možete klikom na{" "}
              <SignInButton>
                <span className="underline text-emerald-600 cursor-pointer">link</span>
              </SignInButton>.
            </SignedOut>
            <SignedIn>
              Vi ste već prijavljeni.
            </SignedIn>
          </p>
          <p>
            Nakon toga, studenti imaju pristup grupomjenjaču.
          </p>
          <p>
            Za pokretanje testova, nažalost, postoji caka.
            Pokretanje testova podrazumijeva postojanje servera koji na sebi ima judge koji to obavlja.
            U svrhu hostanja takvog softvera, admin Zmangera plaća droplet (cloud-based VPS).
          </p>
          <p>
            Zbog mogućnosti koje nudi Zmanger, i zbog cijena hostanja, Zmangerov glavni servis nije dostupan baš svima -
            pokretanju testova će imati pristup samo studenti koji se pretplate. Detalje o pretplati možete pogledati na{" "}
            <Link href="/pricing" className="underline text-emerald-600 cursor-pointer">
              stranici za pretplatu
            </Link>
            . Nakon izvršene uplate, studenti imaju pristup grupomjenjaču i pokretanju testova.
          </p>
          <p>
            Na početku semestra, odabraće se dobrovoljci koji će biti <em>moderatori</em> Zmangera.
            Oni će biti odgovorni za dodavanje, ažuriranje i brisanje testova sa Zamgera na Zmanger (što je trivijalno).
            Admin će se javiti studentima za odabir moderatora.
          </p>
          <p>Kada moderatori dodaju testove, studenti će ih automatski vidjeti kao opciju, i moći će ih pokrenuti.</p>
        </div>
      </section>
    </main>
  );
}

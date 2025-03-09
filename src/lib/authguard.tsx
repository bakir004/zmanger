/* eslint-disable */
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export function authGuard({
  Component,
  props,
  FallbackComponent,
  requiresTestingPermissions,
  needModerator,
  needsETFemail
}: {
  Component: React.ComponentType<any>;
  props: any;
  FallbackComponent?: React.ReactNode;
  requiresTestingPermissions?: boolean;
  needModerator?: boolean;
  needsETFemail?: boolean;
}) {
  return function ProtectedComponent(props: any) {
    const { isLoaded, user, isSignedIn } = useUser();

    if (user?.publicMetadata.admin) {
      return <Component {...props} />;
    }

    if (!isLoaded) {
      return (
        <div className="flex h-[calc(100dvh-200px)] w-full flex-col items-center justify-center px-4">
          <span className="loader"></span>
          <p className="italic">Učitavam...</p>
        </div>
      );
    }

    if (!isSignedIn) {
      const fallback = FallbackComponent || (
        <div className="flex h-[calc(100dvh-200px)] w-full flex-col items-center justify-center px-4">
          <h3 className="text-xl font-bold text-center">Niste prijavljeni :&#40;</h3>
          <p className="text-center">Molimo prijavite se prije nego što pristupite ovoj ruti.</p>
          <SignInButton>
            <Button className="mt-2 h-8">Prijavi se</Button>
          </SignInButton>
        </div>
      );
      return fallback;
    }



    if (requiresTestingPermissions) {
      if (!user.publicMetadata.canTest) {
        return (
          <div className="flex h-[calc(100dvh-200px)] w-full flex-col items-center justify-center px-4">
            <h3 className="text-xl font-bold text-center">
              Nažalost, niste pretplaćeni na Zmanger :&#40;
            </h3>
            <p className="mb-4 text-center">
              Vaša pretplata ne uključuje mogućnost testiranja. Molimo da se
              pretplatite.
            </p>
            <div className="flex gap-4">
              <Link href="/pricing">
                <Button variant={"secondary"}>Pogledaj cijene</Button>
              </Link>
              {/* <Link href="/sandbox">
                <Button>Otiđi na sandbox</Button>
              </Link> */}
            </div>
          </div>
        );
      }
    }

    if (needModerator) {
      if (!user.publicMetadata.moderator) {
        return (
          <div className="flex h-[calc(100dvh-200px)] w-full flex-col items-center justify-center px-4">
            <h3 className="text-xl font-bold text-center">
              Nažalost, niste moderator :&#40;
            </h3>
            <p className="mb-4 text-center">
              Kontaktirajte administratora da bi vam omogućio pristup.
            </p>
          </div>
        );
      }
    } else if (needsETFemail) {
      if (!user.emailAddresses.some((email) => email.emailAddress.endsWith("@etf.unsa.ba"))) {
        return (
          <div className="flex h-[calc(100dvh-200px)] w-full flex-col items-center justify-center px-4">
            <h3 className="text-xl font-bold text-center">Niste prijavljeni sa ETF emailom :&#40;</h3>
            <p className="text-center">Molimo da koristite email koji završava sa @etf.unsa.ba</p>
          </div>
        );
      }
    }

    return <Component {...props} />;
  };
}

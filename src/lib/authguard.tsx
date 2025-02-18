/* eslint-disable */
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export function authGuard({
  Component,
  props,
  FallbackComponent,
  requiresTestingPermissions,
}: {
  Component: React.ComponentType<any>;
  props: any;
  FallbackComponent?: React.ReactNode;
  requiresTestingPermissions?: boolean;
}) {
  return function ProtectedComponent(props: any) {
    const { isLoaded, user, isSignedIn } = useUser();

    if (!isLoaded) {
      return (
        <div className="flex h-[calc(100dvh-200px)] w-full flex-col items-center justify-center">
          <span className="loader"></span>
          <p className="italic">Učitavam...</p>
        </div>
      );
    }

    if (!isSignedIn) {
      const fallback = FallbackComponent || (
        <div className="flex h-[calc(100dvh-200px)] w-full flex-col items-center justify-center">
          <h3 className="text-xl font-bold">Niste prijavljeni :&#40;</h3>
          <p>Molimo prijavite se prije nego što pristupite ovoj ruti.</p>
          <SignInButton>
            <Button className="mt-2 h-8">Prijavi se</Button>
          </SignInButton>
        </div>
      );
      return fallback; // Return the fallback component
    }

    if (requiresTestingPermissions) {
      console.log(user);
      if (!user.publicMetadata.canTest) {
        return (
          <div className="flex h-[calc(100dvh-200px)] w-full flex-col items-center justify-center">
            <h3 className="text-xl font-bold">
              Nažalost, niste pretplaćeni na Zmanger :&#40;
            </h3>
            <p className="mb-4">
              Vaša pretplata ne uključuje mogućnost testiranja. Molimo da se
              pretplatite.
            </p>
            <div className="flex gap-4">
              <Link href="/pricing">
                <Button variant={"secondary"}>Pogledaj cijene</Button>
              </Link>
              <Link href="/sandbox">
                <Button>Otiđi na sandbox</Button>
              </Link>
            </div>
          </div>
        );
      }
    }

    return <Component {...props} />;
  };
}

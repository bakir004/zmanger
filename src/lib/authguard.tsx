import { useRouter } from "next/router";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";

export function authGuard({
  Component,
  props,
}: {
  Component: React.ComponentType<any>;
  props: any;
}) {
  return function ProtectedComponent(props: any) {
    const router = useRouter();
    const { isLoaded, isSignedIn } = useUser();

    // useEffect(() => {
    //   if (isLoaded && !isSignedIn) {
    //     router.replace("/sign-in");
    //   }
    // }, [isLoaded, isSignedIn, router]);

    if (!isLoaded)
      return (
        <div className="flex h-[calc(100dvh-200px)] w-full flex-col items-center justify-center">
          <span className="loader"></span>
          <p className="italic">Učitavam...</p>
        </div>
      );
    if (!isSignedIn)
      return (
        <div className="flex h-[calc(100dvh-200px)] w-full flex-col items-center justify-center">
          <h3 className="text-xl font-bold">Niste prijavljeni :&#40;</h3>
          <p>Molimo prijavite se prije nego što pristupite ovoj ruti.</p>
          <SignInButton>
            <Button className="mt-2 h-8">Prijavi se</Button>
          </SignInButton>
        </div>
      );

    return <Component {...props} />;
  };
}

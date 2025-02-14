import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Navbar from "~/components/Navbar";
import { ThemeProvider } from "~/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export const metadata: Metadata = {
  title: "Zmanger",
  description: "Pomoćna ETF aplikacija za studente",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function App({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: any;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <ThemeProvider
        attribute={"class"}
        defaultTheme="system"
        disableTransitionOnChange={true}
      >
        <div className={`${GeistSans.variable}`}>
          <Navbar />
          <main className="min-h-[calc(100dvh-3rem)] dark:bg-gradient-to-tr dark:from-slate-950 dark:via-slate-925 dark:to-slate-950">
            <Component {...pageProps} />
          </main>
        </div>
      </ThemeProvider>
    </ClerkProvider>
  );
}

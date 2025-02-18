/* eslint-disable */
import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Toaster } from "~/components/ui/sonner";
import Navbar from "~/components/Navbar";
import { ThemeProvider } from "~/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { type AppProps } from "next/app";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Zmanger ETF</title>
        <meta name="description" content="Pomoćna ETF aplikacija za studente" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
            <main className="min-h-[calc(100dvh-3rem)] pb-16 dark:bg-gradient-to-tr dark:from-slate-950 dark:via-slate-925 dark:to-slate-950">
              <Component {...pageProps} />
            </main>
          </div>
          <Analytics />
          <SpeedInsights />
          <Toaster />
        </ThemeProvider>
      </ClerkProvider>
    </>
  );
}

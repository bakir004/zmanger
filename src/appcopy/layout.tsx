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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <ClerkProvider
        appearance={{
          baseTheme: dark,
          layout: {
            unsafe_disableDevelopmentModeWarnings: true,
          },
        }}
      >
        <body>
          <ThemeProvider
            attribute={"class"}
            defaultTheme="system"
            disableTransitionOnChange={true}
          >
            <Navbar />
            <main className="min-h-[calc(100dvh-3rem)] dark:bg-gradient-to-tr dark:from-slate-950 dark:via-slate-925 dark:to-slate-950">
              {children}
            </main>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}

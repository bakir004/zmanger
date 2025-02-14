"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const { setTheme } = useTheme();
  const toggleTheme = () => {
    setIsDark(!isDark);
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <nav className="flex h-12 items-center justify-center shadow-md dark:bg-slate-900">
      <div className="content flex w-full max-w-screen-1280 items-center justify-between px-4">
        <Link href="/">Zmanger v1</Link>
        <div className="flex items-center justify-between gap-4 text-sm">
          <Link href="/testovi">Testovi</Link>
          <Link href="/about" className="text-nowrap">
            O Zmangeru
          </Link>
          <Link href="/dashboard">Dashboard</Link>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={toggleTheme}
          >
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <span className="sr-only">Promijeni temu</span>
          </Button>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button className="h-8" variant={"outline"}>
                Prijavi se
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

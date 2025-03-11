import Link from "next/link";
import { Button } from "./ui/button";
import { DollarSign, GitCommit, Star } from "lucide-react";

export default function AboutSidebar() {
  return (
    <div className="sidebar hidden w-[200px] flex-shrink-0 sm:block">
      <Link href="/about" className="mb-1">
        <Button
          variant={"link"}
          className="pl-0 text-lg font-bold dark:text-slate-300"
        >
          Zmanger
        </Button>
      </Link>
      <Link href="/about/commits">
        <Button
          variant="link"
          className="flex h-6 w-full items-center justify-start text-left dark:text-slate-300"
        >
          <GitCommit className="w-4 h-4" /> Commitovi
        </Button>
      </Link>
      <Link href="/about/reviews">
        <Button
          variant="link"
          className="flex h-6 w-full items-center justify-start text-left dark:text-slate-300"
        >
          <Star className="w-4 h-4" /> Recenzije
        </Button>
      </Link>
      <Link href="/about/subscribe">
        <Button
          variant="link"
          className="flex h-6 w-full items-center justify-start text-left dark:text-slate-300"
        >
          <DollarSign className="w-4 h-4" /> Pretplata
        </Button>
      </Link>
    </div>
  );
}

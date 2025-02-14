import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";

export default function NATestCard({}) {
  return (
    <Card className="relative aspect-[5/2] w-1/4 overflow-hidden rounded-2xl text-white shadow-lg">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/../classroom4.jpg')" }}
      />

      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>

      <Link href="/rpr">
        <CardContent className="relative flex h-full flex-col justify-end gap-1 py-4">
          <p className="text-xs">Java</p>
          <h3 className="font-bold">RPR simulacije ispita</h3>
          <p className="text-xs italic">
            More bit bidne, al najvjerovatnije neće biti
          </p>
          <ChevronRight className="absolute bottom-4 right-4 h-6 w-6" />
        </CardContent>
      </Link>
    </Card>
  );
}

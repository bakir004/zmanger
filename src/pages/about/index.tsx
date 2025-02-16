import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-screen-1280 px-4 pt-8">
      o zmangeru
      <Image src="/cvrle.png" className="h-[300px]" alt="smijesna slika" />
    </main>
  );
}

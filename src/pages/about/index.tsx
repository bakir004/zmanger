import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-screen-1280 px-4 pt-8">
      o zmangeru
      <Image src="/cvrle.png" width={300} height={500} alt="smijesna slika" />
    </main>
  );
}

import { lexend } from "./_fonts/fonts";
import { Button } from "./_components/ui/button";
import { Dot, MoveRight } from "lucide-react";
import Navbar from "./_components/custom/navbar";

export default function HomePage() {
	return (
		<main className="overflow-x-hidden">
			<Navbar />

			<section className="relative w-[640px] sm:w-full aspect-[1.135] overflow-hidden">
				<video
					className="absolute inset-0 sm:left-0 left-[-40px] transform scale-130 pt-[9%]"
					autoPlay
					loop
					muted
					playsInline
				>
					<source src="/hero.mp4" type="video/mp4" />
					<track kind="captions" label="English captions" />
					Your browser does not support the video tag.
				</video>
				<div className="absolute left-[calc(8.8%-40px)] sm:left-[8.8%] mt-[16%]">
					<h1
						className={`${lexend.className} tracking-tighter text-2xl sm:text-4xl md:text-5xl lg:text-6xl`}
					>
						Sve za kodiranje
						<br /> na ETF-u
					</h1>
					<p className="w-[25ch] text-sm sm:text-lg sm:leading-6 lg:text-xl md:text-lg md:leading-6 lg:leading-7 mt-2 font-light">
						Zmanger je open-source platforma koja predstavlja alternativu za c9.
					</p>
					<Button className="bg-gradient-to-br from-[#52e8ff] to-[#468beb] !px-6 mt-4 rounded-full uppercase font-semibold flex items-center cursor-pointer justify-center h-8 text-[11px]">
						Saznaj više
						<MoveRight />
					</Button>
				</div>
				<div className="absolute w-[69.4%] aspect-video sm:left-[8.8%] left-[calc(8.8%-40px)] top-[54.9%] rounded-sm text-white bg-gray-800">
					<img
						className="w-full h-full rounded-sm"
						src="/zmanger.png"
						alt="zmanger"
					/>
				</div>
				<div className="absolute bottom-0 left-0 h-[100px] w-full bg-gradient-to-b from-transparent to-[#090a0c] to-80% lg:h-[250px] md:h-44 sm:left-0 sm:h-[170px] sm:w-[107%]" />
			</section>
			<section className="text-white bg-[#090a0c] lg:px-16 md:px-12 sm:px-8 px-4 pb-16">
				<h4 className="font-light text-gray-400 text-sm">
					Sve što vam treba za produktivan rad na{" "}
					<span className="font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
						C
					</span>{" "}
					i{" "}
					<span className="font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
						C++
					</span>{" "}
					predmetima
				</h4>
				<p className="mt-2 text-sm text-wrap">
					Uvod u programiranje <Dot className="inline text-gray-600" /> Tehnike
					programiranja <Dot className="inline text-gray-600" /> Algoritmi i
					strukture podataka <Dot className="inline text-gray-600" /> Numerički
					algoritmi
				</p>
			</section>
			<section className="bg-white text-black">svasta</section>
		</main>
	);
}

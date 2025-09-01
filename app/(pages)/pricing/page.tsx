"use client";

import { Button } from "../../_components/ui/button";
import { Check } from "lucide-react";
import { lexend, inter } from "app/_fonts/fonts";
import { Separator } from "app/_components/ui/separator";
import Navbar from "app/_components/custom/navbar";

interface PricingPlan {
	id: number;
	name: string;
	price: string;
	period: string;
	description: string;
	features: string[];
	popular?: boolean;
	theme: string;
}

const pricingPlans: PricingPlan[] = [
	{
		id: 1,
		name: "Standard",
		price: "Besplatno",
		period: "forever",
		description: "Za studente koji tek probavaju Zmanger",
		features: [
			"Pristup c10 okruženju za pokretanje programa",
			"Maksimalno jedna datoteka",
			"Podrška za C/C++",
		],
		theme: "common",
	},
	{
		id: 2,
		name: "Pro",
		price: "14.99 KM",
		period: "semestar",
		description: "Za studente koji žele testirati zadaće",
		features: [
			"Sve iz besplatnog plana",
			"Mogućnost pokretanja Zamger testova bilo kada",
			"Maksimalno 10 datoteka",
		],
		popular: true,
		theme: "epic",
	},
	{
		id: 3,
		name: "Pro+",
		price: "19.99 KM",
		period: "semestar",
		description: "Za ozbiljne studente koji vole olakšan workflow",
		features: [
			"Sve iz Pro plana",
			"Neograničen broj datoteka",
			"Prioritetno testiranje",
		],
		theme: "legendary",
	},
];

export default function PricingPage() {
	return (
		<>
			<Navbar />
			<div className="relative min-h-screen pt-16 bg-[#090b0c] overflow-hidden">
				{/* Background video for the page */}
				{/* <video
				className="absolute inset-0 w-full h-full object-cover opacity-20"
				autoPlay
				loop
				muted
				playsInline
			>
				<source src="/epic.webm" type="video/webm" />
				<source src="/epic.mp4" type="video/mp4" />
				<track kind="captions" label="English captions" />
				Your browser does not support the video tag.
			</video> */}

				{/* Content */}
				<div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
					<div className="text-center mb-4 md:mb-12">
						<h1
							className={`${lexend.className} tracking-tighter text-2xl sm:text-4xl md:text-5xl lg:text-6xl mb-4`}
						>
							Izaberite plan
						</h1>
						<p className="text-sm sm:text-lg sm:leading-6 lg:text-xl md:text-lg md:leading-6 lg:leading-7 mt-2 font-light">
							Odaberite plan koji najviše odgovara vašim potrebama
						</p>
					</div>
					<section className="flex flex-wrap justify-center">
						{pricingPlans.map((plan) => (
							<div
								key={plan.id}
								className="relative group w-[20rem] aspect-[4/5] -mx-3"
							>
								<video
									className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-100 group-hover:duration-1000 w-full h-full scale-220 -z-10 ml-[8%] -mt-[5%]"
									autoPlay
									loop
									muted
									playsInline
								>
									<source src={`/${plan.theme}.webm`} type="video/webm" />
									<source src={`/${plan.theme}.mp4`} type="video/mp4" />
									<track kind="captions" label="English captions" />
									Your browser does not support the video tag.
								</video>

								{/* SVG Background */}
								<div
									className="absolute inset-[4%] -z-5 opacity-20 hover:opacity-70"
									style={{
										backgroundImage: `url('/${plan.theme}.svg')`,
										backgroundPosition: "center",
										backgroundRepeat: "no-repeat",
									}}
								/>

								<div className="px-[16%] py-[14%] h-full relative z-10 flex flex-col">
									<h2 className="font-[500] text-white mb-4">{plan.name}</h2>
									<h1
										className={`text-3xl font-bold text-white mb-2 ${inter.className}`}
									>
										{plan.price}
										{plan.period !== "forever" && (
											<span
												className={`text-sm font-normal text-white/80 mb-2 ${inter.className}`}
											>
												{" "}
												/{plan.period}
											</span>
										)}
									</h1>
									<p className="mb-4 text-sm mt-2">{plan.description}</p>
									<Separator />
									<ul className="my-4">
										{plan.features.map((feature, index) => (
											<li
												key={index}
												className="flex text-sm items-center gap-2"
											>
												<Check className="size-4 flex-shrink-0" />{" "}
												<span>{feature}</span>
											</li>
										))}
									</ul>
									<Button className="!px-6 transition-all duration-100 group-hover:duration-1000 bg-transparent text-white border group-hover:bg-white group-hover:text-black w-full mt-auto rounded-full uppercase font-semibold flex items-center cursor-pointer justify-center h-8 text-[11px]">
										Odaberi plan
									</Button>
								</div>
							</div>
						))}
					</section>
				</div>
			</div>
		</>
	);
}

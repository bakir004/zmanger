import Link from "next/link";
import { inter, lexend } from "./_fonts/fonts";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "./_components/ui/navigation-menu";
import { Button } from "./_components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Dot, ExternalLink, MoveRight } from "lucide-react";

export default function HomePage() {
	return (
		<main className="overflow-x-hidden">
			<nav className="absolute text-gray-300 top-0 left-0 right-0 z-10 h-16 px-8 flex items-center justify-between">
				<div className="logo-and-nav flex items-center gap-10 cursor-pointer">
					<div className="flex gap-3 items-center">
						<img className="w-8" src="/logo-white.png" alt="logo" />
						<p className={`text-lg scale-y-105 ${lexend.className}`}>Zmanger</p>
					</div>
					<NavigationMenu className="mt-1 hidden md:block">
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="!bg-transparent font-light tracking-wider cursor-pointer hover:!bg-transparent focus:!bg-transparent active:!bg-transparent !shadow-none !ring-0">
									Resursi
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid w-[300px] gap-4">
										<li>
											<NavigationMenuLink asChild>
												<Link href="#">
													<div className="font-medium">Pricing</div>
													<div className="text-muted-foreground">
														Pogledaj cijene usluga koje Zmanger nudi
													</div>
												</Link>
											</NavigationMenuLink>
											<NavigationMenuLink asChild>
												<Link href="#">
													<div className="font-medium">Documentation</div>
													<div className="text-muted-foreground">niggas</div>
												</Link>
											</NavigationMenuLink>
											<NavigationMenuLink asChild>
												<Link href="#">
													<div className="font-medium">Blog</div>
													<div className="text-muted-foreground">
														Read our latest blog posts.
													</div>
												</Link>
											</NavigationMenuLink>
										</li>
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									className="!bg-transparent font-light tracking-wider cursor-pointer hover:!bg-transparent focus:!bg-transparent active:!bg-transparent !shadow-none !ring-0"
									asChild
								>
									<Link href="/docs">Docs</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="items-center gap-2 hidden md:flex">
					<Button variant={"link"} className="cursor-pointer">
						<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
							<title>github</title>
							<defs>
								<linearGradient
									id="whiteToGray"
									x1="0%"
									y1="0%"
									x2="0%"
									y2="100%"
								>
									<stop offset="0%" stopColor="white" />
									<stop offset="100%" stopColor="gray" />
								</linearGradient>
							</defs>
							<g fill="url(#whiteToGray)">
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"
								/>
								<path d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm2.446 2.729c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zM31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm3.261 3.361c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm4.5 1.951c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm4.943.361c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm4.598-.782c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663z" />
							</g>
						</svg>
						<p className="text-gray-300 font-light tracking-wider">Github</p>
					</Button>
					<SignedOut>
						{/* <Link
							href={"/dashboard"}
							className={`${inter.className} transition group bg-gradient-to-b hover:from-gray-400 hover:to-gray-600 cursor-pointer from-gray-500 to-gray-700 rounded-full uppercase font-medium flex items-center justify-center h-8 text-[11px] text-white tracking-snug`}
						>
							<div className="bg-gray-950 group:hover:bg-gray-900 rounded-full text-nowrap flex items-center px-4 w-[calc(100%-2px)] h-[calc(100%-2px)]">
								Prijavi se
							</div>
						</Link> */}
						<SignInButton mode="modal">
							<button
								type="button"
								className={`${inter.className} transition group bg-gradient-to-b hover:from-gray-400 hover:to-gray-600 cursor-pointer from-gray-500 to-gray-700 rounded-full uppercase font-medium flex items-center justify-center h-8 text-[11px] text-white tracking-snug`}
							>
								<div className="bg-gray-950 group:hover:bg-gray-900 rounded-full text-nowrap flex items-center px-4 w-[calc(100%-2px)] h-[calc(100%-2px)]">
									Prijavi se
								</div>
							</button>
						</SignInButton>
					</SignedOut>
					<SignedIn>
						<Link href="/dashboard">
							<Button className="mr-2 flex cursor-pointer items-center gap-2 bg-gradient-to-br to-[#e38b6c] from-[#e7b771]">
								Dashboard
								<ExternalLink className="-mt-0.5" />
							</Button>
						</Link>
						<UserButton />
					</SignedIn>
					{/* <div
						className={`${inter.className} transition group bg-gradient-to-b hover:from-gray-400 hover:to-gray-600 cursor-pointer from-gray-500 to-gray-700 rounded-full uppercase font-medium flex items-center justify-center h-8 text-[11px] text-white tracking-snug`}
					>
						<div className="bg-gray-950 group:hover:bg-gray-900 rounded-full text-nowrap flex items-center px-4 w-[calc(100%-2px)] h-[calc(100%-2px)]">
							Get started
						</div>
					</div> */}
				</div>
			</nav>
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

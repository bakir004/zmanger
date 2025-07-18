import { X } from "lucide-react";

export function OpenedFilesTrack() {
	return (
		<div className="h-8 w-full flex items-center ">
			<div className="flex h-full items-center gap-1 px-2 cursor-pointer text-xs border-r">
				<img
					className="w-3 h-3"
					alt="cpp"
					src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-plain.svg"
				/>
				main.cpp
				{/* <X className="w-3 h-3 mt-0.5" /> */}
			</div>
			<div className="flex h-full items-center gap-1 px-2 bg-[#020205] cursor-pointer text-xs">
				<img
					className="w-3 h-3"
					alt="c"
					src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-plain.svg"
				/>{" "}
				main.c
				<X className="w-3 h-3 mt-0.5 hover:text-red-400" />
			</div>
		</div>
	);
}

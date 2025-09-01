import { Button } from "app/_components/ui/button";
import { LoaderCircle, Save, X } from "lucide-react";

export function OpenedFilesTrack({
	currentFileName,
}: { currentFileName: string }) {
	const getFileExtension = (filename: string) => {
		return filename.split(".").pop()?.toLowerCase() || "";
	};

	const getLanguageIcon = (extension: string) => {
		switch (extension) {
			case "cpp":
			case "cc":
			case "cxx":
				return {
					src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-plain.svg",
					alt: "cpp",
				};
			case "c":
				return {
					src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-plain.svg",
					alt: "c",
				};
			default:
				return {
					src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-plain.svg",
					alt: "cpp",
				};
		}
	};

	const fileExtension = getFileExtension(currentFileName);
	const languageIcon = getLanguageIcon(fileExtension);

	return (
		<div className="h-8 w-full flex items-center ">
			{currentFileName && (
				<>
					<div className="flex h-full items-center gap-2 px-2 mr-4 text-sm">
						<img
							className="w-4 h-4"
							alt={languageIcon.alt}
							src={languageIcon.src}
						/>
						{currentFileName}
					</div>
					<Button
						className={
							"flex bg-primary-gradient px-0 h-6 text-xs items-center gap-2 cursor-pointer"
						}
					>
						{
							/* {1 !== 1 ? (
							<LoaderCircle className="animate-spin h-1 w-1" />
						) : (
							*/ <Save className="h-1 w-1" /> /*
						)} */
						}
						Spremi
					</Button>
				</>
			)}
		</div>
	);
}

import { Button } from "app/_components/ui/button";
import { LoaderCircle, Save } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface ButtonSaveCodeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	savingFile: boolean;
}

export function ButtonSaveCode({ savingFile, ...props }: ButtonSaveCodeProps) {
	return (
		<Button
			{...props}
			className={`flex bg-primary-gradient items-center gap-2 cursor-pointer ${props.className ?? ""}`}
		>
			{savingFile ? <LoaderCircle className="animate-spin" /> : <Save />}
			Spremi
		</Button>
	);
}

import { Button } from "app/_components/ui/button";
import { LoaderCircle, Terminal } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonRunCodeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	loading: boolean;
}

export function ButtonRunCode({ loading, ...props }: ButtonRunCodeProps) {
	return (
		<Button
			{...props}
			className={`flex bg-secondary-gradient items-center gap-2 cursor-pointer ${props.className ?? ""}`}
		>
			{loading ? (
				<>
					<LoaderCircle className="animate-spin" />
					Pokrećem
				</>
			) : (
				<>
					<Terminal />
					Pokreni kod
				</>
			)}
		</Button>
	);
}

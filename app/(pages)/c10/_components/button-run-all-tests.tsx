import { Button } from "app/_components/ui/button";
import { LoaderCircle, Power } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface ButtonRunAllTestsProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	loading: boolean;
	disabled?: boolean;
}

export function ButtonRunAllTests({
	loading,
	disabled,
	...props
}: ButtonRunAllTestsProps) {
	return (
		<Button
			{...props}
			disabled={disabled}
			className={`flex bg-primary-gradient items-center gap-2 cursor-pointer ${props.className ?? ""}`}
		>
			{loading ? (
				<>
					<LoaderCircle className="animate-spin" />
					Pokrećem
				</>
			) : (
				<>
					<Power />
					Pokreni testove
				</>
			)}
		</Button>
	);
}

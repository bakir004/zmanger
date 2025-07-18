import type React from "react";
import {
	Select,
	SelectLabel,
	SelectContent,
	SelectGroup,
	SelectTrigger,
	SelectItem,
	SelectValue,
} from "app/_components/ui/select";
import { getTestBatches } from "../../actions";
import { useQuery } from "@tanstack/react-query";

const CppSvg = () => (
	<svg viewBox="0 0 128 128">
		<title>cpp</title>
		<path
			fill="#00599c"
			d="M118.766 95.82c.89-1.543 1.441-3.28 1.441-4.843V36.78c0-1.558-.55-3.297-1.441-4.84l-55.32 31.94Zm0 0"
		/>
		<path
			fill="#004482"
			d="m68.36 126.586 46.933-27.094c1.352-.781 2.582-2.129 3.473-3.672l-55.32-31.94L8.12 95.82c.89 1.543 2.121 2.89 3.473 3.672l46.933 27.094c2.703 1.562 7.13 1.562 9.832 0Zm0 0"
		/>
		<path
			fill="#659ad2"
			d="M118.766 31.941c-.891-1.546-2.121-2.894-3.473-3.671L68.359 1.172c-2.703-1.563-7.129-1.563-9.832 0L11.594 28.27C8.89 29.828 6.68 33.66 6.68 36.78v54.196c0 1.562.55 3.3 1.441 4.843L63.445 63.88Zm0 0"
		/>
		<path
			fill="#fff"
			d="M63.445 26.035c-20.867 0-37.843 16.977-37.843 37.844s16.976 37.844 37.843 37.844c13.465 0 26.024-7.247 32.77-18.91L79.84 73.335c-3.38 5.84-9.66 9.465-16.395 9.465-10.433 0-18.922-8.488-18.922-18.922 0-10.434 8.49-18.922 18.922-18.922 6.73 0 13.017 3.629 16.39 9.465l16.38-9.477c-6.75-11.664-19.305-18.91-32.77-18.91zM92.88 57.57v4.207h-4.207v4.203h4.207v4.207h4.203V65.98h4.203v-4.203h-4.203V57.57H92.88zm15.766 0v4.207h-4.204v4.203h4.204v4.207h4.207V65.98h4.203v-4.203h-4.203V57.57h-4.207z"
		/>
	</svg>
);

const CSvg = () => (
	<svg viewBox="0 0 128 128">
		<title>c</title>
		<path
			fill="#659AD3"
			d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"
		/>
		<path
			fill="#03599C"
			d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"
		/>
		<path
			fill="#fff"
			d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6z"
		/>
	</svg>
);

interface TestBatchSelectProps {
	handleTestBatchChange: (value: string) => void;
}

export const TestBatchSelect: React.FC<TestBatchSelectProps> = ({
	handleTestBatchChange,
}) => {
	const { data: testBatches, isLoading: testBatchesLoading } = useQuery({
		queryKey: ["testBatches"],
		queryFn: getTestBatches,
	});

	return (
		<Select disabled={testBatchesLoading} onValueChange={handleTestBatchChange}>
			<SelectTrigger className="w-full">
				<SelectValue
					placeholder={testBatchesLoading ? "Učitavam..." : "Izaberite testove"}
				/>
			</SelectTrigger>
			<SelectContent className="-mr-1">
				<SelectGroup>
					<SelectLabel>TP Zadaca 1</SelectLabel>
					{testBatches?.map((testBatch) => (
						<SelectItem key={testBatch.id} value={testBatch.id.toString()}>
							{testBatch.language === "cpp" ? <CppSvg /> : <CSvg />}
							{testBatch.name}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "app/_components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "app/_components/ui/form";
import { Input } from "app/_components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createFile } from "../../actions";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
	fileName: z
		.string()
		.min(2, { message: "Naziv datoteke mora imati najmanje 2 znaka." })
		.regex(/^[^\\/:*?"<>|]+\.[^\\/:*?"<>|]+$/, {
			message:
				'Naziv datoteke mora sadržavati ekstenziju (npr. .cpp) i ne smije sadržavati zabranjene znakove (\\ / : * ? " < > |)',
		})
		.refine(
			(val) => {
				if (typeof val !== "string") return false;
				const parts = val.split(".");
				if (parts.length !== 2) return false;
				const ext = parts[1];
				return ext === "c" || ext === "cpp";
			},
			{
				message: "Ekstenzija datoteke mora biti .c ili .cpp.",
			},
		),
});

export function FileCreateForm({
	close,
	parentId,
}: {
	close: () => void;
	parentId: number | null;
}) {
	const queryClient = useQueryClient();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fileName: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await createFile(values.fileName, "file", parentId);
			queryClient.invalidateQueries({ queryKey: ["files"] });
		} catch (error) {
			console.error(error);
		}
		close();
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="fileName"
					defaultValue="asd"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ime datoteke</FormLabel>
							<FormControl>
								<Input placeholder="zadatak.cpp" {...field} />
							</FormControl>
							<FormDescription>Dodajte ekstenziju .c ili .cpp</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-end gap-2">
					<Button type="button" variant="ghost" onClick={close}>
						Otkaži
					</Button>
					<Button type="submit">Potvrdi</Button>
				</div>
			</form>
		</Form>
	);
}

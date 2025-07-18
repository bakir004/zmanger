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
		.min(1, { message: "Naziv foldera ne smije biti prazan." }),
});

export function FolderCreateForm({
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
			await createFile(values.fileName, "folder", parentId);
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
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ime foldera</FormLabel>
							<FormControl>
								<Input placeholder="zadaca1" {...field} />
							</FormControl>
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

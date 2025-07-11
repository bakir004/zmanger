"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Button } from "app/_components/ui/button";
import { Textarea } from "app/_components/ui/textarea";
import { geistMono } from "app/_fonts/fonts";

const formSchema = z.object({
	topOfFile: z.string(),
	aboveMain: z.string(),
	main: z.string(),
});

export function AddTestsForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			topOfFile: "#include<iostream>",
			aboveMain: "typedef std::vector<int> VektorInt",
			main: `int a;\nstd::cin >> a;\nstd::cin >> a;\nstd::cin >> a;\nstd::cin >> a;\nstd::cout << "Broj koji ste unijeli je: " << a; return 0;`,
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="topOfFile"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Vrh datoteke</FormLabel>
							<FormControl>
								<Textarea
									className={`text-xs ${geistMono.className}`}
									placeholder="Npr. #include<iostream>"
									{...field}
								/>
							</FormControl>
							{/* <FormDescription className="-mt-1">
								Ovaj dio koda će stajati na vrhu programskog koda
							</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="aboveMain"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Iznad main funkcije</FormLabel>
							<FormControl>
								<Textarea
									className={`text-xs ${geistMono.className}`}
									placeholder="Npr. typedef std::vector<int> VektorInt"
									{...field}
								/>
							</FormControl>
							{/* <FormDescription className="-mt-1">
								Ovaj dio koda će stajati iznad main funkcije
							</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="main"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Unutar main funkcije</FormLabel>
							<FormControl>
								<Textarea
									className={`text-xs min-h-32 h-fit ${geistMono.className}`}
									placeholder={`int a;\nstd::cin >> a;\nstd::cout << "Broj koji ste unijeli je: " << a; return 0;`}
									{...field}
								/>
							</FormControl>
							{/* <FormDescription className="-mt-1">
								Ovaj dio koda će stajati iznad main funkcije
							</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}

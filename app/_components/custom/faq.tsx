import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";

interface FaqItem {
	id: string;
	question: string;
	answer: string;
}

interface Faq1Props {
	heading?: string;
	items?: FaqItem[];
}

const Faq1 = ({
	heading = "Često postavljena pitanja",
	items = [
		{
			id: "faq-1",
			question:
				"Zašto bih koristio Zmanger kada mogu prekopirati kodove testova sa Zamgera?",
			answer:
				"Kod Zamger testova je javan i student može kopirati i provjeravati svoj kod test po test. Zmanger nudi lakše i brže pokretanje testova uz provjeru curenja memorije.",
		},
		{
			id: "faq-2",
			question: "Kada budu dostupni testovi aktuelne zadaće?",
			answer:
				"Čim se Zamger testovi prvi put pokrenu za neki zadatak, moderatori ili administrator Zmangera će ubaciti odgovarajuće testove. Zmanger ne može imati autotestove za zadatak za koji još nisu pokrenuti Zamger testovi.",
		},
		{
			id: "faq-3",
			question: "Smijem li povjeriti svoj kod Zmangeru?",
			answer:
				"Da. Vaš kod je spašen u vaše datoteke zbog jedinog razloga da vam se ne izgubi kada budete sljedeći put ulazili na c10. Imate potpunu privatnost na Zmangeru.",
		},
		{
			id: "faq-4",
			question:
				"Mogu li predati svoje zadaće preko c10 na Zamger kao što to može c9?",
			answer:
				"Ne. Zmanger je čisto pomoćna aplikacija koja nema direktan pristup ničemu sa ETF-a. Vaša je odgovornost završenu zadaću maksuz predati na Zamger.",
		},
	],
}: Faq1Props) => {
	return (
		<section className="py-32 w-full">
			<div className="container px-8 max-w-3xl mx-auto">
				<h1 className="mb-4 text-3xl font-semibold md:mb-11 md:text-4xl">
					{heading}
				</h1>
				<Accordion type="single" collapsible>
					{items.map((item, index) => (
						<AccordionItem key={index} value={`item-${index}`}>
							<AccordionTrigger className="font-semibold hover:no-underline">
								{item.question}
							</AccordionTrigger>
							<AccordionContent className="text-muted-foreground">
								{item.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
};

export { Faq1 };

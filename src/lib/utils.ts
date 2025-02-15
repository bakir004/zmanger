import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formattedJsonTemplate = `{
  "tests": [
    {
      "id": "<test_id>",  // redni broj testa
      "patch": [
        {
          "position": "main",  // obavezno je imati kod u mainu
          "code": "<neki_kod>"  // kod koji se stavlja u main funkciju
        },
        {
          "position": "above_main",  // opcionalno je imati kod iznad maina
          "code": "<neki_kod>"  // kod koji ide iznad maina
        },
        {
          "position": "top_of_file",  // opcionalno je imati kod na vrhu fajla
          "code": "<neki_kod>"  // kod koji ide na vrh fajla
        }
      ],
      "stdin": "<ulaz>"  // ulazni tok programa
      "expect": ["<ocekivani_izlaz1>", "<ocekivani_izlaz2>", ...]  // ocekivani izlaz testa
    }
  ]
}`;

export function decodeHtmlEntities(encodedStr: string): string {
  return encodedStr
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&amp;/g, "&") // Replace &amp; with &
    .replace(/&lt;/g, "<") // Replace &lt; with <
    .replace(/&gt;/g, ">") // Replace &gt; with >
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/&apos;/g, "'") // Replace &apos; with '
    .replace(/\//g, "/"); // Replace / with /
}

export const delimiter = "-~===~-";

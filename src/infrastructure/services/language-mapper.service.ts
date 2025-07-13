import type { ILanguageMapperService } from "~/application/services/language-mapper.service.interface";

export class LanguageMapperService implements ILanguageMapperService {
	private readonly languageMap = {
		cpp: 1,
		c: 2,
	} as const;

	private readonly idToLanguageMap = Object.entries(this.languageMap).reduce(
		(acc, [lang, id]) => {
			acc[id] = lang;
			return acc;
		},
		{} as Record<number, string>,
	);

	languageToId(language: string): number {
		const id = this.languageMap[language as keyof typeof this.languageMap];
		if (!id) {
			throw new Error(`Unsupported language: ${language}`);
		}
		return id;
	}

	idToLanguage(id: number): string {
		const language = this.idToLanguageMap[id];
		if (!language) {
			throw new Error(`Unknown language ID: ${id}`);
		}
		return language;
	}

	getSupportedLanguages(): string[] {
		return Object.keys(this.languageMap);
	}
}

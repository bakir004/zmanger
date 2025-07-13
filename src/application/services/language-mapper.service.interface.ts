export interface ILanguageMapperService {
	languageToId(language: string): number;
	idToLanguage(id: number): string;
	getSupportedLanguages(): string[];
}

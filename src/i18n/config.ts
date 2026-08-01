export const locales = ['sv', 'en', 'de', 'fr', 'es', 'it', 'zh', 'ja', 'ar', 'pt', 'ru', 'nl', 'pl', 'ko', 'th'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'sv'
export const localeNames: Record<Locale, string> = {
  sv: 'Svenska',
  en: 'English',
  de: 'Tyska',
  fr: 'Franska',
  es: 'Spanska',
  it: 'Italienska',
  zh: '中文',
  ja: '日本語',
  ar: 'العربية',
  pt: 'Portugisiska',
  ru: 'Ryska',
  nl: 'Nederländska',
  pl: 'Polska',
  ko: '한국어',
  th: 'ภาษาไทย',
}
export const rtlLocales: Locale[] = ['ar']

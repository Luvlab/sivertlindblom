export const locales = ['sv', 'en', 'de', 'fr', 'es', 'it', 'zh', 'ja', 'ar', 'pt', 'ru', 'nl', 'pl', 'ko'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'sv'
export const localeNames: Record<Locale, string> = {
  sv: 'Svenska',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  zh: '中文',
  ja: '日本語',
  ar: 'العربية',
  pt: 'Português',
  ru: 'Русский',
  nl: 'Nederlands',
  pl: 'Polski',
  ko: '한국어',
}
export const rtlLocales: Locale[] = ['ar']

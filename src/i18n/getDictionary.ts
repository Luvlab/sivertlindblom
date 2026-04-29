import 'server-only'
import type { Locale } from './config'

const dictionaries: Record<Locale, () => Promise<Record<string, unknown>>> = {
  sv: () => import('./locales/sv.json').then((m) => m.default as Record<string, unknown>),
  en: () => import('./locales/en.json').then((m) => m.default as Record<string, unknown>),
  de: () => import('./locales/de.json').then((m) => m.default as Record<string, unknown>),
  fr: () => import('./locales/fr.json').then((m) => m.default as Record<string, unknown>),
  es: () => import('./locales/es.json').then((m) => m.default as Record<string, unknown>),
  it: () => import('./locales/it.json').then((m) => m.default as Record<string, unknown>),
  zh: () => import('./locales/zh.json').then((m) => m.default as Record<string, unknown>),
  ja: () => import('./locales/ja.json').then((m) => m.default as Record<string, unknown>),
  ar: () => import('./locales/ar.json').then((m) => m.default as Record<string, unknown>),
  pt: () => import('./locales/pt.json').then((m) => m.default as Record<string, unknown>),
  ru: () => import('./locales/ru.json').then((m) => m.default as Record<string, unknown>),
  nl: () => import('./locales/nl.json').then((m) => m.default as Record<string, unknown>),
  pl: () => import('./locales/pl.json').then((m) => m.default as Record<string, unknown>),
  ko: () => import('./locales/ko.json').then((m) => m.default as Record<string, unknown>),
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Dictionary = any

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale] ?? dictionaries['sv']
  return loader()
}

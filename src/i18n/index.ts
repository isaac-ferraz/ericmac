import { useSettings } from '../os/settings'
import { strings, type StringKey } from './strings'

export type Lang = 'pt' | 'en'
export type L = { pt: string; en: string }

export function useLang(): Lang {
  return useSettings((s) => s.lang)
}

/** Texto de interface pelo nome da chave, ou um par {pt, en} vindo dos dados. */
export function useT() {
  const lang = useLang()
  return function t(key: StringKey | L, vars?: Record<string, string | number>): string {
    let text = typeof key === 'string' ? strings[key][lang] : key[lang]
    if (vars) for (const [k, v] of Object.entries(vars)) text = text.replace(`{${k}}`, String(v))
    return text
  }
}

export function formatDate(iso: string, lang: Lang, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(lang === 'pt' ? 'pt-BR' : 'en-US', opts).format(
    new Date(iso + 'T12:00:00'),
  )
}

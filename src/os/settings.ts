import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useEffect, useState } from 'react'

export type ThemePref = 'auto' | 'light' | 'dark'
type Lang = 'pt' | 'en'

type Settings = {
  lang: Lang
  theme: ThemePref
  /** o papel de parede assume a cor do projeto em foco */
  followAccent: boolean
  setLang: (l: Lang) => void
  toggleLang: () => void
  setTheme: (t: ThemePref) => void
  setFollowAccent: (v: boolean) => void
}

// Português por padrão; quem chega com o navegador em outro idioma vê inglês.
function initialLang(): Lang {
  if (typeof navigator === 'undefined') return 'pt'
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

// Acesso ao storage pode lançar (aba anônima, storage bloqueado).
const safeStorage = createJSONStorage(() => {
  try {
    const s = window.localStorage
    s.getItem('probe')
    return s
  } catch {
    const mem = new Map<string, string>()
    return {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
    }
  }
})

export const useSettings = create<Settings>()(
  persist(
    (set, get) => ({
      lang: initialLang(),
      theme: 'auto',
      followAccent: true,
      setLang: (lang) => set({ lang }),
      toggleLang: () => set({ lang: get().lang === 'pt' ? 'en' : 'pt' }),
      setTheme: (theme) => set({ theme }),
      setFollowAccent: (followAccent) => set({ followAccent }),
    }),
    { name: 'ericmac.settings', storage: safeStorage },
  ),
)

const darkQuery = '(prefers-color-scheme: dark)'

/** Tema efetivo: resolve "auto" pela preferência do sistema, ao vivo. */
export function useResolvedTheme(): 'light' | 'dark' {
  const pref = useSettings((s) => s.theme)
  const [systemDark, setSystemDark] = useState(() => window.matchMedia(darkQuery).matches)
  useEffect(() => {
    const mq = window.matchMedia(darkQuery)
    const on = () => setSystemDark(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return pref === 'auto' ? (systemDark ? 'dark' : 'light') : pref
}

export function useReducedMotion(): boolean {
  const q = '(prefers-reduced-motion: reduce)'
  const [reduced, setReduced] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

export function useMediaQuery(q: string): boolean {
  const [match, setMatch] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return match
}

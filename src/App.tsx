import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Desktop } from './os/Desktop'
import { Phone } from './mobile/Phone'
import { Boot } from './os/Boot'
import { useUI } from './os/ui'
import { useWindows, topWindow } from './os/windows'
import { useSettings, useResolvedTheme, useMediaQuery, useReducedMotion } from './os/settings'
import { useHashRouting, parseHash } from './os/routing'
import { openApp } from './os/actions'
import { projectBySlug } from './data/projects'
import { useT, useLang } from './i18n'

const MOBILE_QUERY = '(max-width: 899px), (pointer: coarse) and (max-height: 540px)'

export default function App() {
  const t = useT()
  const lang = useLang()
  const theme = useResolvedTheme()
  const mobile = useMediaQuery(MOBILE_QUERY)
  const reduced = useReducedMotion()
  const booting = useUI((s) => s.booting)
  const setBooting = useUI((s) => s.setBooting)
  const [ready, setReady] = useState(false)

  // tema e idioma no <html>
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#1d1d1b' : '#e7e5ee')
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
  }, [lang])

  // a cor do projeto em foco vira a cor de destaque e a cor das linhas do fundo
  const follow = useSettings((s) => s.followAccent)
  const focusedSlug = useWindows((s) => {
    const top = topWindow(s.wins)
    return top?.app === 'case' ? top.slug : undefined
  })
  useEffect(() => {
    const root = document.documentElement.style
    const p = focusedSlug ? projectBySlug[focusedSlug] : undefined
    const colour = p ? (theme === 'dark' ? p.glow : p.accent) : null
    if (colour) root.setProperty('--accent', colour)
    else root.removeProperty('--accent')
    if (colour && follow) root.setProperty('--wall-line', colour)
    else root.removeProperty('--wall-line')
  }, [focusedSlug, follow, theme])

  const finishBoot = useCallback(() => {
    try {
      sessionStorage.setItem('ericmac.booted', '1')
    } catch {
      /* segue sem lembrar */
    }
    setBooting(false)
  }, [setBooting])

  // depois do boot, no Mac, a janela de projetos já abre (a não ser que o endereço peça outra)
  useEffect(() => {
    if (booting || ready) return
    setReady(true)
    if (!mobile && !parseHash(location.hash) && !Object.keys(useWindows.getState().wins).length) {
      window.setTimeout(() => openApp('projects'), reduced ? 0 : 350)
    }
  }, [booting, ready, mobile, reduced])

  useHashRouting(!booting)

  // ⌘K / Ctrl K abre a busca
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        const ui = useUI.getState()
        ui.setSpotlight(!ui.spotlight)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <nav aria-label={t('skip')}>
        <a
        className="skip-link"
        href="#/projetos"
        onClick={(e) => {
          e.preventDefault()
          openApp('projects')
        }}
      >
        {t('skip')}
        </a>
      </nav>
      {mobile ? <Phone /> : <Desktop />}
      <AnimatePresence>{booting && <Boot onDone={finishBoot} />}</AnimatePresence>
    </>
  )
}

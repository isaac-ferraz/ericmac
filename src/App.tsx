import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { prefetchApps } from './apps/registry'
import { Boot } from './os/Boot'
import { hideBootScreen } from './os/bootScreen'
import { useUI } from './os/ui'
import { useWindows, useFocusedAccent } from './os/windows'
import { useResolvedTheme, useMediaQuery } from './os/settings'
import { useHashRouting, parseHash } from './os/routing'
import { openApp } from './os/actions'
import { useT, useLang } from './i18n'

// desktop e celular são pacotes separados: cada aparelho baixa só o seu
const Desktop = lazy(() => import('./os/Desktop').then((m) => ({ default: m.Desktop })))
const Phone = lazy(() => import('./mobile/Phone').then((m) => ({ default: m.Phone })))

const MOBILE_QUERY = '(max-width: 899px), (pointer: coarse) and (max-height: 540px)'

export default function App() {
  const t = useT()
  const lang = useLang()
  const theme = useResolvedTheme()
  const mobile = useMediaQuery(MOBILE_QUERY)
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

  // a cor do projeto em foco vira a cor de destaque (o papel de parede cuida da própria cor)
  const accent = useFocusedAccent(theme)
  useEffect(() => {
    const root = document.documentElement.style
    if (accent) root.setProperty('--accent', accent)
    else root.removeProperty('--accent')
  }, [accent])

  const finishBoot = useCallback(() => setBooting(false), [setBooting])

  // tira a tela de boot do index.html quando o shell já está na tela; no Mac, a janela
  // de projetos abre enquanto ela some (a não ser que o endereço peça outra janela)
  const onShellReady = useCallback(() => {
    if (ready) return
    setReady(true)
    hideBootScreen().then(() => {
      prefetchApps()
      if (!mobile && !parseHash(location.hash) && !Object.keys(useWindows.getState().wins).length) openApp('projects')
    })
  }, [ready, mobile])

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
      <Suspense fallback={null}>
        {mobile ? <Phone /> : <Desktop />}
        <ShellReady onReady={onShellReady} />
      </Suspense>
      <AnimatePresence>{booting && <Boot onDone={finishBoot} />}</AnimatePresence>
    </>
  )
}

/** Monta junto com o shell (mesmo Suspense), então só roda quando o shell carregou. */
function ShellReady({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady()
  }, [onReady])
  return null
}

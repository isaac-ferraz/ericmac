import { useEffect, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Wallpaper } from './Wallpaper'
import { MenuBar, MenuPanel, type MenuItem } from './MenuBar'
import { Dock } from './Dock'
import { Window } from './Window'
import { Spotlight } from './Spotlight'
import { useWindows } from './windows'
import { useUI } from './ui'
import { useSettings } from './settings'
import { openApp, openProject } from './actions'
import { AppContent, windowTitle } from '../apps/registry'
import { projects } from '../data/projects'
import { profile } from '../data/profile'
import { FolderIcon, Mark } from '../brand/icons'
import { Pic } from '../lib/Pic'
import { useT, useLang } from '../i18n'
import './Desktop.css'

export function Desktop() {
  const t = useT()
  const wins = useWindows((s) => s.wins)
  const list = Object.values(wins)
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)

  // janelas se reencaixam quando a tela muda de tamanho
  useEffect(() => {
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => useWindows.getState().clampAll())
    }
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])

  return (
    <div className="desktop" onContextMenu={(e) => e.preventDefault()}>
      <Wallpaper />
      <MenuBar />
      <main
        id="mesa"
        className="desktop__surface"
        aria-label={t('desk.label')}
        onContextMenu={(e) => {
          if (e.target !== e.currentTarget) return
          e.preventDefault()
          setMenu({ x: e.clientX, y: e.clientY })
        }}
      >
        <Widgets />
        <DesktopIcons />
        <AnimatePresence>
          {list.map((w) => (
            <Window key={w.key} win={w} title={windowTitle(w, t)}>
              <AppContent win={w} />
            </Window>
          ))}
        </AnimatePresence>
      </main>
      <Dock />
      <Spotlight />
      <Toasts />
      {menu && <DesktopMenu at={menu} onClose={() => setMenu(null)} />}
    </div>
  )
}

/* ---------------------------------------------------------------- widgets */

function Widgets() {
  const t = useT()
  const lang = useLang()
  const latest = projects[0]
  return (
    <aside className="widgets" aria-label="Widgets">
      <section className="widget widget--hello">
        <p className="widget__status">
          <span className="widget__live" aria-hidden="true" />
          {t('widget.available')}
        </p>
        <h1 className="widget__name">
          eric mac<span>.</span>
        </h1>
        <p className="widget__role">
          {profile.role[lang]} · {profile.company}
        </p>
        <div className="widget__actions">
          <button type="button" className="btn btn--primary" onClick={() => openApp('projects')}>
            {t('widget.seeWork')}
          </button>
          <button type="button" className="btn" onClick={() => openApp('contact')}>
            {t('widget.talk')}
          </button>
        </div>
      </section>

      <button
        type="button"
        className="widget widget--latest"
        onClick={() => openProject(latest.slug)}
        style={{ ['--w-accent' as string]: latest.accent }}
        aria-label={`${t('widget.latest')}: ${latest.name}, ${latest.tagline[lang]}`}
      >
        <Pic k={latest.cover.key} alt="" thumb sizes="320px" />
        <span className="widget__latest-label">
          <small>{t('widget.latest')}</small>
          <strong>
            {latest.name.toLowerCase()}
            <span>.</span>
          </strong>
        </span>
      </button>
    </aside>
  )
}

/* ---------------------------------------------------------------- ícones da mesa */

function DesktopIcons() {
  const t = useT()
  const lang = useLang()
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    const clear = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest('.desk-icon')) setSelected(null)
    }
    document.addEventListener('pointerdown', clear)
    return () => document.removeEventListener('pointerdown', clear)
  }, [])

  function onKey(e: KeyboardEvent, slug: (typeof projects)[number]['slug']) {
    if (e.key === 'Enter') openProject(slug)
  }

  return (
    <ul className="desk-icons" aria-label={t('app.projects')}>
      {projects.map((p) => (
        <li key={p.slug}>
          <button
            type="button"
            className={`desk-icon${selected === p.slug ? ' is-selected' : ''}`}
            onClick={(e) => {
              // teclado/leitor de tela: um "clique" já abre
              if (e.detail === 0) openProject(p.slug)
              else setSelected(p.slug)
            }}
            onDoubleClick={() => openProject(p.slug)}
            onKeyDown={(e) => onKey(e, p.slug)}
            title={t('desk.openHint')}
            aria-label={`${p.name}, ${p.tagline[lang]}`}
          >
            <FolderIcon accent={p.accent} cover={p.cover.key} size={68} />
            <span className="desk-icon__label">{p.name}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

/* ---------------------------------------------------------------- menu de contexto */

function DesktopMenu({ at, onClose }: { at: { x: number; y: number }; onClose: () => void }) {
  const t = useT()
  const follow = useSettings((s) => s.followAccent)
  const theme = useSettings((s) => s.theme)

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest('.menu--context')) onClose()
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [onClose])

  const items: MenuItem[] = [
    { label: t('menu.openProjects'), onSelect: () => openApp('projects') },
    { label: t('menu.search'), shortcut: '⌘K', onSelect: () => useUI.getState().setSpotlight(true) },
    'sep',
    { label: t('desk.useFollow'), checked: follow, onSelect: () => useSettings.getState().setFollowAccent(!follow) },
    { label: t('menu.themeLight'), checked: theme === 'light', onSelect: () => useSettings.getState().setTheme('light') },
    { label: t('menu.themeDark'), checked: theme === 'dark', onSelect: () => useSettings.getState().setTheme('dark') },
    'sep',
    { label: t('menu.aboutEric'), onSelect: () => openApp('about') },
  ]
  const x = Math.min(at.x, window.innerWidth - 240)
  const y = Math.min(at.y, window.innerHeight - 260)
  return <MenuPanel className="menu--context" items={items} autoFocus={false} onClose={onClose} style={{ position: 'fixed', left: x, top: y, zIndex: 7000 }} />
}

/* ---------------------------------------------------------------- notificações */

export function Toasts() {
  const toasts = useUI((s) => s.toasts)
  const dismiss = useUI((s) => s.dismiss)
  return (
    <div className="toasts" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((n) => (
          <motion.button
            key={n.id}
            type="button"
            className="toast"
            onClick={() => dismiss(n.id)}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: 'spring', stiffness: 500, damping: 36 }}
            layout
          >
            <span className="toast__icon" aria-hidden="true">
              <Mark size={10} />
            </span>
            <span className="toast__text">
              <strong>{n.title}</strong>
              {n.body && <small>{n.body}</small>}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}

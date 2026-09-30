import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Wallpaper } from '../os/Wallpaper'
import { useWindows, topWindow, type AppId } from '../os/windows'
import { ShellProvider } from '../os/Window'
import { useReducedMotion } from '../os/settings'
import { openApp, openProject } from '../os/actions'
import { Toasts } from '../os/Desktop'
import { AppContent, windowTitle, appMeta } from '../apps/registry'
import { AppIcon, FolderIcon, type IconName } from '../brand/icons'
import { projects } from '../data/projects'
import { profile } from '../data/profile'
import { Pic } from '../lib/Pic'
import { useT, useLang } from '../i18n'
import './Phone.css'

// origem do toque, para o app "crescer" a partir do ícone
let tapOrigin = { x: 50, y: 50 }
function rememberTap(e: React.MouseEvent) {
  tapOrigin = { x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 }
}

type Tile =
  | { kind: 'app'; app: AppId; icon: IconName }
  | { kind: 'project'; slug: (typeof projects)[number]['slug'] }
  | { kind: 'link'; href: string; icon: IconName; label: string }

// A grade fecha fileiras inteiras: o widget "mais recente" (2×2) ao lado dos
// quatro projetos, e embaixo os apps com as redes juntas numa pasta, como no iOS.
const grid: Tile[] = [
  ...projects.map((p) => ({ kind: 'project' as const, slug: p.slug })),
  { kind: 'app', app: 'messages', icon: 'messages' },
  { kind: 'app', app: 'notes', icon: 'notes' },
  { kind: 'app', app: 'trash', icon: 'trash' },
]

const social: Extract<Tile, { kind: 'link' }>[] = [
  { kind: 'link', href: profile.contact.behance, icon: 'behance', label: 'Behance' },
  { kind: 'link', href: profile.contact.linkedin, icon: 'linkedin', label: 'LinkedIn' },
  { kind: 'link', href: profile.contact.instagram, icon: 'instagram', label: 'Instagram' },
]

export function Phone() {
  const t = useT()
  const wins = useWindows((s) => s.wins)
  const top = topWindow(wins)
  const stack = Object.values(wins).filter((w) => !w.minimized).sort((a, b) => a.z - b.z)
  const below = stack.length > 1 ? stack[stack.length - 2] : undefined
  const reduced = useReducedMotion()

  // Esc volta, como o gesto de voltar
  useEffect(() => {
    if (!top) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && useWindows.getState().close(top.id)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [top])

  return (
    <div className="phone">
      <Wallpaper />
      <StatusBar />
      <main id="mesa" className="home" aria-hidden={top ? true : undefined} inert={top ? true : undefined}>
        <HomeScreen />
      </main>

      <AnimatePresence>
        {top && (
          <motion.section
            key={top.key}
            className="screen"
            role="dialog"
            aria-label={windowTitle(top, t)}
            style={{ transformOrigin: `${tapOrigin.x}% ${tapOrigin.y}%` }}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4, borderRadius: 40 }}
            animate={{ opacity: 1, scale: 1, borderRadius: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
          >
            <header className="screen__bar">
              <button type="button" className="screen__back" onClick={() => useWindows.getState().close(top.id)}>
                <svg viewBox="0 0 12 20" aria-hidden="true"><path d="M10 2L2 10l8 8" /></svg>
                {below ? windowTitle(below, t) : t('mobile.home')}
              </button>
              <p className="screen__title">{windowTitle(top, t)}</p>
            </header>
            <div className="screen__body">
              <ShellProvider value={{ id: top.id, active: true, mobile: true, titleId: '' }}>
                <AppContent win={top} />
              </ShellProvider>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      <Toasts />
    </div>
  )
}

function StatusBar() {
  const lang = useLang()
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000)
    return () => window.clearInterval(id)
  }, [])
  const time = new Intl.DateTimeFormat(lang === 'pt' ? 'pt-BR' : 'en-US', { hour: 'numeric', minute: '2-digit' }).format(now)
  return (
    <div className="statusline" aria-hidden="true">
      <span className="statusline__time">{time.replace(/\s?[AP]M/, '')}</span>
      <span className="statusline__icons">
        <svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
        <svg viewBox="0 0 16 12"><path d="M8 11.5l2.2-2.6a3.2 3.2 0 0 0-4.4 0Z M3.6 6.9a6.4 6.4 0 0 1 8.8 0l1.4-1.6a8.6 8.6 0 0 0-11.6 0Z M0.8 3.6a10.6 10.6 0 0 1 14.4 0L16 2.5A12 12 0 0 0 0 2.5Z" /></svg>
        <svg viewBox="0 0 27 12"><rect x="0.5" y="0.5" width="23" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".45" /><rect x="2" y="2" width="17" height="8" rx="2" /><path d="M25 4v4a2 2 0 0 0 0-4Z" opacity=".45" /></svg>
      </span>
    </div>
  )
}

function HomeScreen() {
  const t = useT()
  const lang = useLang()
  const latest = projects[0]

  return (
    <>
      <div className="home__scroll">
        <section className="pwidget pwidget--hello">
          <p className="widget__status">
            <span className="widget__live" aria-hidden="true" />
            {t('widget.available')}
          </p>
          <h1 className="pwidget__name">
            eric{' '}
            <br />
            macintyre<span>.</span>
          </h1>
          <p className="pwidget__role">
            {profile.role[lang]}
          </p>
        </section>

        <ul className="home__grid">
          <li className="home__feature">
            <button
              type="button"
              className="pwidget pwidget--latest"
              onClick={(e) => {
                rememberTap(e)
                openProject(latest.slug)
              }}
              style={{ ['--w-accent' as string]: latest.accent }}
              aria-label={`${t('widget.latest')}: ${latest.name}`}
            >
              <Pic k={latest.teaser ?? latest.cover.key} alt="" sizes="(min-width: 37.5em) 30vw, 50vw" />
              <span className="widget__latest-label">
                <small>{t('widget.latest')}</small>
                <strong>
                  {latest.name.toLowerCase()}
                  <span>.</span>
                </strong>
              </span>
            </button>
          </li>
          {grid.map((tile, i) => (
            <li key={i}>
              <TileButton tile={tile} />
            </li>
          ))}
          <li>
            <SocialFolder />
          </li>
        </ul>
      </div>

      <nav className="home__dock" aria-label="Dock">
        <a className="tile" href={profile.contact.phoneHref} aria-label={`${t('app.phone')} ${profile.contact.phoneDisplay}`}>
          <AppIcon name="phone" size={64} />
        </a>
        <TileButton tile={{ kind: 'app', app: 'contact', icon: 'contact' }} bare />
        <TileButton tile={{ kind: 'app', app: 'projects', icon: 'projects' }} bare />
        <TileButton tile={{ kind: 'app', app: 'about', icon: 'about' }} bare />
      </nav>
    </>
  )
}

function TileButton({ tile, bare = false }: { tile: Tile; bare?: boolean }) {
  const t = useT()
  const ref = useRef<HTMLButtonElement>(null)

  if (tile.kind === 'link')
    return (
      <a className="tile" href={tile.href} target="_blank" rel="noopener noreferrer">
        <AppIcon name={tile.icon} size={64} />
        {!bare && <span className="tile__label">{tile.label}</span>}
      </a>
    )

  if (tile.kind === 'project') {
    const p = projects.find((x) => x.slug === tile.slug)!
    return (
      <button
        ref={ref}
        type="button"
        className="tile"
        onClick={(e) => {
          rememberTap(e)
          openProject(p.slug)
        }}
      >
        <span className="tile__folder">
          <FolderIcon accent={p.accent} cover={p.cover.key} size={64} />
        </span>
        <span className="tile__label">{p.name}</span>
      </button>
    )
  }

  const label = t(appMeta[tile.app].title)
  return (
    <button
      ref={ref}
      type="button"
      className="tile"
      aria-label={bare ? label : undefined}
      onClick={(e) => {
        rememberTap(e)
        openApp(tile.app)
      }}
    >
      <AppIcon name={tile.icon} size={64} />
      {!bare && <span className="tile__label">{label}</span>}
    </button>
  )
}

/** Pasta "Redes": toca e abre por cima da tela inicial, como uma pasta do iOS. */
function SocialFolder() {
  const t = useT()
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)
  const opener = useRef<HTMLButtonElement>(null)
  const label = t('mobile.social')

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      setOpen(false)
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      opener.current?.focus()
    }
  }, [open])

  return (
    <>
      <button ref={opener} type="button" className="tile" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        <span className="tile__stack" aria-hidden="true">
          {social.map((l) => (
            <AppIcon key={l.icon} name={l.icon} size={20} />
          ))}
        </span>
        <span className="tile__label">{label}</span>
      </button>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="folder"
              role="dialog"
              aria-modal="true"
              aria-label={label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            >
              <motion.div
                className="folder__panel"
                initial={reduced ? false : { scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={reduced ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                onClick={(e) => e.stopPropagation()}
              >
                <p className="folder__title">{label}</p>
                <ul className="folder__grid">
                  {social.map((l) => (
                    <li key={l.icon}>
                      <TileButton tile={l} />
                    </li>
                  ))}
                </ul>
              </motion.div>
              <button type="button" className="folder__close" autoFocus onClick={() => setOpen(false)}>
                {t('mobile.closeFolder')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

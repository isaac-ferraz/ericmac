import { useEffect, useRef, useState, type ReactNode, type KeyboardEvent } from 'react'
import { useWindows, topWindow } from './windows'
import { useUI } from './ui'
import { useSettings } from './settings'
import { openApp, openProject, openExternal, links } from './actions'
import { useT, useLang } from '../i18n'
import { projects } from '../data/projects'
import { windowTitle } from '../apps/registry'
import { Mark } from '../brand/icons'
import { ControlCenter } from './ControlCenter'
import './MenuBar.css'

export type MenuItem =
  | { label: string; shortcut?: string; onSelect: () => void; checked?: boolean; disabled?: boolean }
  | 'sep'

type MenuDef = { id: string; label: ReactNode; ariaLabel?: string; strong?: boolean; items: MenuItem[] }

export function restartBoot() {
  try {
    sessionStorage.removeItem('ericmac.booted')
  } catch {
    /* sem storage, o boot roda de novo de qualquer jeito */
  }
  useWindows.getState().closeAll()
  useUI.getState().setBooting(true)
}

export function MenuBar() {
  const t = useT()
  const wins = useWindows((s) => s.wins)
  const top = topWindow(wins)
  const theme = useSettings((s) => s.theme)
  const lang = useLang()
  const { setTheme, setLang } = useSettings.getState()
  const setSpotlight = useUI((s) => s.setSpotlight)
  const cc = useUI((s) => s.controlCenter)
  const setCC = useUI((s) => s.setControlCenter)

  const winList = Object.values(wins).sort((a, b) => a.z - b.z)
  const appName = top ? windowTitle(top, t) : 'Eric Mac'

  const menus: MenuDef[] = [
    {
      id: 'mark',
      label: <Mark size={9} />,
      ariaLabel: 'Eric Mac',
      items: [
        { label: t('menu.aboutEric'), onSelect: () => openApp('about') },
        'sep',
        { label: t('menu.controlCenter'), onSelect: () => setCC(true) },
        'sep',
        { label: t('menu.restart'), onSelect: restartBoot },
      ],
    },
    {
      id: 'app',
      label: appName,
      strong: true,
      items: [
        { label: t('menu.closeWindow'), disabled: !top, onSelect: () => top && useWindows.getState().close(top.id) },
        { label: t('menu.closeAll'), disabled: !winList.length, onSelect: () => useWindows.getState().closeAll() },
      ],
    },
    {
      id: 'file',
      label: t('menu.file'),
      items: [
        { label: t('menu.openProjects'), onSelect: () => openApp('projects') },
        { label: t('menu.newMail'), onSelect: () => openApp('contact') },
        'sep',
        { label: t('menu.closeWindow'), disabled: !top, onSelect: () => top && useWindows.getState().close(top.id) },
      ],
    },
    {
      id: 'view',
      label: t('menu.view'),
      items: [
        { label: t('menu.themeLight'), checked: theme === 'light', onSelect: () => setTheme('light') },
        { label: t('menu.themeDark'), checked: theme === 'dark', onSelect: () => setTheme('dark') },
        { label: t('menu.themeAuto'), checked: theme === 'auto', onSelect: () => setTheme('auto') },
        'sep',
        { label: 'Português', checked: lang === 'pt', onSelect: () => setLang('pt') },
        { label: 'English', checked: lang === 'en', onSelect: () => setLang('en') },
      ],
    },
    {
      id: 'go',
      label: t('menu.go'),
      items: [
        ...projects.map((p) => ({ label: p.name, onSelect: () => openProject(p.slug) })),
        'sep' as const,
        { label: 'Behance', onSelect: () => openExternal(links.behance) },
        { label: 'LinkedIn', onSelect: () => openExternal(links.linkedin) },
        { label: 'Instagram', onSelect: () => openExternal(links.instagram) },
      ],
    },
    {
      id: 'window',
      label: t('menu.window'),
      items: [
        { label: t('menu.minimize'), disabled: !top, onSelect: () => top && useWindows.getState().minimize(top.id) },
        { label: t('menu.zoom'), disabled: !top, onSelect: () => top && useWindows.getState().toggleMaximize(top.id) },
        'sep',
        ...(winList.length
          ? winList.map((w) => ({ label: windowTitle(w, t), checked: w.id === top?.id, onSelect: () => useWindows.getState().focus(w.id) }))
          : [{ label: t('menu.noWindows'), disabled: true, onSelect: () => {} }]),
      ],
    },
    {
      id: 'help',
      label: t('menu.help'),
      items: [
        { label: t('menu.search'), shortcut: '⌘K', onSelect: () => setSpotlight(true) },
        { label: t('menu.onBehance'), onSelect: () => openExternal(links.behance) },
      ],
    },
  ]

  return (
    <header className="menubar">
      <Menus menus={menus} />
      <div className="menubar__right">
        <button
          type="button"
          className="menubar__btn menubar__lang"
          onClick={() => useSettings.getState().toggleLang()}
          aria-label={lang === 'pt' ? 'Idioma: português. Switch to English' : 'Language: English. Mudar para português'}
        >
          {lang.toUpperCase()}
        </button>
        <button type="button" className="menubar__btn" onClick={() => setSpotlight(true)} aria-label={t('spot.label')}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" /><path d="M10.4 10.4L14 14" /></svg>
        </button>
        <button
          type="button"
          className="menubar__btn"
          onClick={() => setCC(!cc)}
          aria-label={t('cc.title')}
          aria-expanded={cc}
          data-cc-toggle
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <rect x="1.5" y="3" width="13" height="4.4" rx="2.2" />
            <circle cx="12.3" cy="5.2" r="1.3" />
            <rect x="1.5" y="8.6" width="13" height="4.4" rx="2.2" />
            <circle cx="3.7" cy="10.8" r="1.3" />
          </svg>
        </button>
        <Clock />
      </div>
      {cc && <ControlCenter onClose={() => setCC(false)} />}
    </header>
  )
}

function Clock() {
  const lang = useLang()
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000)
    return () => window.clearInterval(id)
  }, [])
  const locale = lang === 'pt' ? 'pt-BR' : 'en-US'
  const date = new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short' }).format(now)
  const time = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(now)
  return (
    <time className="menubar__clock" dateTime={now.toISOString()}>
      <span className="menubar__date">{date.replace(/\./g, '')}</span> {time}
    </time>
  )
}

/* ---------------------------------------------------------------- menus */

export function Menus({ menus }: { menus: MenuDef[] }) {
  const [open, setOpen] = useState<string | null>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const focusFirst = useRef(false)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpen(null)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  function move(delta: number) {
    const i = menus.findIndex((m) => m.id === open)
    const next = menus[(i + delta + menus.length) % menus.length]
    focusFirst.current = true
    setOpen(next.id)
    btnRefs.current[next.id]?.focus()
  }

  function onBtnKey(e: KeyboardEvent, id: string) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      focusFirst.current = true
      setOpen(id)
    }
  }

  return (
    <div className="menubar__menus" ref={barRef} role="menubar">
      {menus.map((m) => (
        <div key={m.id} className="menubar__menu" role="none">
          <button
            ref={(el) => {
              btnRefs.current[m.id] = el
            }}
            type="button"
            role="menuitem"
            className={`menubar__item${m.strong ? ' is-strong' : ''}${m.id === 'mark' ? ' is-mark' : ''}`}
            aria-haspopup="menu"
            aria-expanded={open === m.id}
            aria-label={m.ariaLabel}
            onPointerDown={(e) => {
              if (e.button !== 0) return
              e.preventDefault()
              focusFirst.current = false
              setOpen(open === m.id ? null : m.id)
            }}
            onPointerEnter={() => open && open !== m.id && setOpen(m.id)}
            onKeyDown={(e) => onBtnKey(e, m.id)}
            onClick={(e) => {
              // clique via teclado/leitor de tela (pointerdown não dispara)
              if (e.detail === 0) {
                focusFirst.current = true
                setOpen(open === m.id ? null : m.id)
              }
            }}
          >
            {m.label}
          </button>
          {open === m.id && (
            <MenuPanel
              items={m.items}
              autoFocus={focusFirst.current}
              onClose={(refocus) => {
                setOpen(null)
                if (refocus) btnRefs.current[m.id]?.focus()
              }}
              onMove={move}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export function MenuPanel({
  items,
  autoFocus,
  onClose,
  onMove,
  style,
  className = '',
}: {
  items: MenuItem[]
  autoFocus: boolean
  onClose: (refocus: boolean) => void
  onMove?: (delta: number) => void
  style?: React.CSSProperties
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (autoFocus) el.querySelector<HTMLElement>('[role^="menuitem"]:not([aria-disabled="true"])')?.focus()
    else el.focus()
  }, [autoFocus])

  function onKey(e: KeyboardEvent) {
    const list = [...(ref.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([aria-disabled="true"])') ?? [])]
    const i = list.indexOf(document.activeElement as HTMLElement)
    if (e.key === 'ArrowDown') list[(i + 1) % list.length]?.focus()
    else if (e.key === 'ArrowUp') list[(i - 1 + list.length) % list.length]?.focus()
    else if (e.key === 'Escape') onClose(true)
    else if (e.key === 'ArrowRight' && onMove) onMove(1)
    else if (e.key === 'ArrowLeft' && onMove) onMove(-1)
    else if (e.key === 'Tab') onClose(false)
    else return
    if (e.key !== 'Tab') e.preventDefault()
  }

  return (
    <div ref={ref} className={`menu ${className}`} role="menu" tabIndex={-1} onKeyDown={onKey} style={style}>
      {items.map((item, i) =>
        item === 'sep' ? (
          <div key={i} className="menu__sep" role="separator" />
        ) : (
          <button
            key={i}
            type="button"
            role={item.checked !== undefined ? 'menuitemcheckbox' : 'menuitem'}
            aria-checked={item.checked}
            aria-disabled={item.disabled || undefined}
            tabIndex={-1}
            className="menu__item"
            onClick={() => {
              if (item.disabled) return
              onClose(false)
              item.onSelect()
            }}
          >
            <span className="menu__check" aria-hidden="true">
              {item.checked ? '✓' : ''}
            </span>
            <span className="menu__label">{item.label}</span>
            {item.shortcut && <span className="menu__shortcut">{item.shortcut}</span>}
          </button>
        ),
      )}
    </div>
  )
}

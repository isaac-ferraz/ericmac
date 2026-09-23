import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useAnimationControls, type MotionValue } from 'motion/react'
import { useWindows, type AppId } from './windows'
import { registerDockSlot } from './ui'
import { useReducedMotion } from './settings'
import { openApp, openExternal, links } from './actions'
import { AppIcon, type IconName } from '../brand/icons'
import { useT } from '../i18n'
import type { StringKey } from '../i18n/strings'
import './Dock.css'

type DockEntry =
  | { kind: 'app'; app: AppId; icon: IconName; label: StringKey }
  | { kind: 'link'; href: string; icon: IconName; label: StringKey }
  | { kind: 'sep' }

const entries: DockEntry[] = [
  { kind: 'app', app: 'projects', icon: 'projects', label: 'app.projects' },
  { kind: 'app', app: 'about', icon: 'about', label: 'app.about' },
  { kind: 'app', app: 'contact', icon: 'contact', label: 'app.contact' },
  { kind: 'app', app: 'messages', icon: 'messages', label: 'app.messages' },
  { kind: 'app', app: 'notes', icon: 'notes', label: 'app.notes' },
  { kind: 'sep' },
  { kind: 'link', href: links.behance, icon: 'behance', label: 'app.behance' },
  { kind: 'link', href: links.linkedin, icon: 'linkedin', label: 'app.linkedin' },
  { kind: 'link', href: links.instagram, icon: 'instagram', label: 'app.instagram' },
  { kind: 'sep' },
  { kind: 'app', app: 'trash', icon: 'trash', label: 'app.trash' },
]

const BASE = 50
const PEAK = 78
const REACH = 150

export function Dock() {
  const t = useT()
  const mouseX = useMotionValue(Infinity)
  const reduced = useReducedMotion()

  return (
    <nav className="dock-wrap" aria-label="Dock">
      <motion.ul
        className="dock"
        onPointerMove={(e) => e.pointerType === 'mouse' && !reduced && mouseX.set(e.clientX)}
        onPointerLeave={() => mouseX.set(Infinity)}
      >
        {entries.map((e, i) =>
          e.kind === 'sep' ? (
            <li key={i} className="dock__sep" aria-hidden="true" />
          ) : (
            <DockItem key={i} entry={e} label={t(e.label)} mouseX={mouseX} />
          ),
        )}
      </motion.ul>
    </nav>
  )
}

function DockItem({
  entry,
  label,
  mouseX,
}: {
  entry: Exclude<DockEntry, { kind: 'sep' }>
  label: string
  mouseX: MotionValue<number>
}) {
  const ref = useRef<HTMLLIElement>(null)
  const bounce = useAnimationControls()
  const reduced = useReducedMotion()

  const key = entry.kind === 'app' ? entry.app : entry.icon
  const running = useWindows((s) =>
    entry.kind === 'app' ? Object.values(s.wins).some((w) => w.app === entry.app || (entry.app === 'projects' && w.app === 'case')) : false,
  )

  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect()
    return r ? x - (r.left + r.width / 2) : REACH
  })
  const target = useTransform(distance, [-REACH, 0, REACH], [BASE, PEAK, BASE], { clamp: true })
  const size = useSpring(target, { stiffness: 380, damping: 26, mass: 0.2 })

  function activate() {
    if (entry.kind === 'link') {
      openExternal(entry.href)
      return
    }
    const wins = useWindows.getState().wins
    const mine = Object.values(wins).filter((w) => w.app === entry.app)
    if (!mine.length && !reduced) bounce.start({ y: [0, -22, 0, -9, 0], transition: { duration: 0.7, ease: 'easeOut' } })
    // janela mais recente do app volta à frente (inclusive se minimizada)
    if (mine.length) {
      const last = mine.sort((a, b) => b.z - a.z)[0]
      useWindows.getState().focus(last.id)
    } else openApp(entry.app)
  }

  return (
    <li
      ref={(el) => {
        ref.current = el
        registerDockSlot(key, el)
      }}
      className="dock__item"
    >
      <motion.button
        type="button"
        className="dock__btn"
        style={{ width: size, height: size }}
        animate={bounce}
        onClick={activate}
        aria-label={entry.kind === 'link' ? `${label} ↗` : label}
      >
        <AppIcon name={entry.icon} size={100} />
      </motion.button>
      <span className="dock__tip" aria-hidden="true">
        {label}
        {entry.kind === 'link' && ' ↗'}
      </span>
      {running && <span className="dock__dot" aria-hidden="true" />}
    </li>
  )
}

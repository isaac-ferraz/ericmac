import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useAnimationControls, type MotionValue } from 'motion/react'
import { useWindows, topWindow, rem, type AppId } from './windows'
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

// tamanho do ícone parado e no pico da ampliação, e até onde o mouse alcança (rem)
const BASE = 3.125
const PEAK = 4.875
const REACH = 9.375

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

  // O centro do ícone é medido uma vez, quando o mouse entra no Dock, e vale até
  // ele sair. Medir a cada quadro, com as larguras animando, forçava um layout
  // por ícone por quadro. É também como o Dock do Mac calcula: pela posição de
  // repouso, não pela posição já ampliada.
  const center = useRef<number | null>(null)
  const distance = useTransform(mouseX, (x) => {
    if (x === Infinity) {
      center.current = null
      return rem(REACH)
    }
    if (center.current === null) {
      const r = ref.current?.getBoundingClientRect()
      if (!r) return rem(REACH)
      center.current = r.left + r.width / 2
    }
    return x - center.current
  })
  const target = useTransform(distance, (d) => {
    const t = Math.max(0, 1 - Math.abs(d) / rem(REACH))
    return BASE + (PEAK - BASE) * t
  })
  // a mola trabalha em rem, então o Dock acompanha a tela mesmo parado
  const spring = useSpring(target, { stiffness: 380, damping: 26, mass: 0.2 })
  const size = useTransform(spring, (v) => `${v}rem`)

  function activate() {
    if (entry.kind === 'link') {
      openExternal(entry.href)
      return
    }
    const store = useWindows.getState()
    const mine = Object.values(store.wins).filter((w) => w.app === entry.app)
    if (!mine.length) {
      if (!reduced) bounce.start({ y: [0, -22, 0, -9, 0], transition: { duration: 0.7, ease: 'easeOut' } })
      openApp(entry.app)
      return
    }
    const shown = mine.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)
    // o app já está na frente: o ícone recolhe as janelas dele para o Dock
    if (shown.length && topWindow(store.wins)?.app === entry.app) {
      for (const w of shown) store.minimize(w.id)
      return
    }
    // aberto, mas atrás de outra janela: vem para a frente
    if (shown.length) {
      store.focus(shown[0].id)
      return
    }
    // tudo minimizado: as janelas voltam, a mais recente por cima
    for (const w of mine.sort((a, b) => a.z - b.z)) store.focus(w.id)
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

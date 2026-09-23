import { createContext, useContext, useEffect, useId, useRef, type ReactNode, type PointerEvent as RPointerEvent } from 'react'
import { motion, animate, useMotionValue } from 'motion/react'
import { useWindows, topWindow, minSize, type Win } from './windows'
import { dockSlotRect } from './ui'
import { useReducedMotion } from './settings'
import { useT } from '../i18n'
import './Window.css'

type Shell = { id: string; active: boolean; mobile: boolean; titleId: string }

const ShellContext = createContext<Shell>({ id: '', active: true, mobile: false, titleId: '' })

/** Em que tipo de moldura o app está: janela do Mac ou tela do celular. */
export function useShell() {
  return useContext(ShellContext)
}

export const ShellProvider = ShellContext.Provider

const spring = { type: 'spring', stiffness: 420, damping: 38, mass: 0.9 } as const

type Dir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
const DIRS: Dir[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

function dockKey(win: Win) {
  return win.app === 'case' ? 'projects' : win.app
}

export function TrafficLights({ id, maximized }: { id: string; maximized: boolean }) {
  const t = useT()
  const { close, minimize, toggleMaximize } = useWindows.getState()
  return (
    <div className="traffic" data-nodrag>
      <button type="button" className="traffic__btn traffic__btn--close" aria-label={t('win.close')} onClick={() => close(id)}>
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 3.5l5 5m0-5l-5 5" /></svg>
      </button>
      <button type="button" className="traffic__btn traffic__btn--min" aria-label={t('win.minimize')} onClick={() => minimize(id)}>
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.8 6h6.4" /></svg>
      </button>
      <button
        type="button"
        className="traffic__btn traffic__btn--max"
        aria-label={maximized ? t('win.restore') : t('win.zoom')}
        onClick={() => toggleMaximize(id)}
      >
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.3 5.6V3.3h2.3M8.7 6.4v2.3H6.4" /></svg>
      </button>
    </div>
  )
}

export function Window({ win, title, children }: { win: Win; title: string; children: ReactNode }) {
  const active = useWindows((s) => topWindow(s.wins)?.id === win.id)
  const reduced = useReducedMotion()
  const titleId = useId()
  const ref = useRef<HTMLElement>(null)

  const x = useMotionValue(win.x)
  const y = useMotionValue(win.y)
  const w = useMotionValue(win.w)
  const h = useMotionValue(win.h)
  const scale = useMotionValue(reduced ? 1 : 0.94)
  const opacity = useMotionValue(reduced ? 1 : 0)
  const interacting = useRef(false)

  // abrir
  useEffect(() => {
    if (reduced) return
    animate(scale, 1, spring)
    animate(opacity, 1, { duration: 0.18 })
    ref.current?.focus({ preventScroll: true })
  }, [])

  // posição/tamanho vindos do store (maximizar, restaurar, encaixe na tela)
  useEffect(() => {
    if (interacting.current || win.minimized) return
    const opts = reduced ? { duration: 0 } : spring
    animate(x, win.x, opts)
    animate(y, win.y, opts)
    animate(w, win.w, opts)
    animate(h, win.h, opts)
  }, [win.x, win.y, win.w, win.h, win.minimized, reduced, x, y, w, h])

  // minimizar para o ícone do app no Dock, e voltar
  useEffect(() => {
    if (win.minimized) {
      const slot = dockSlotRect(dockKey(win))
      const cx = slot ? slot.left + slot.width / 2 : window.innerWidth / 2
      const cy = slot ? slot.top + slot.height / 2 : window.innerHeight
      const d = reduced ? { duration: 0 } : { duration: 0.42, ease: [0.5, 0, 0.75, 0.2] as const }
      animate(x, cx - w.get() / 2, d)
      animate(y, cy - h.get() / 2, d)
      animate(scale, 0.06, d)
      animate(opacity, 0, reduced ? { duration: 0 } : { duration: 0.42, ease: 'easeIn' })
    } else if (scale.get() < 1 && opacity.get() < 1) {
      const d = reduced ? { duration: 0 } : spring
      animate(x, win.x, d)
      animate(y, win.y, d)
      animate(scale, 1, d)
      animate(opacity, 1, { duration: reduced ? 0 : 0.2 })
      ref.current?.focus({ preventScroll: true })
    }
  }, [win.minimized])

  // foco ganho por janela que volta à frente
  useEffect(() => {
    if (active && !win.minimized && document.activeElement === document.body) ref.current?.focus({ preventScroll: true })
  }, [active, win.minimized])

  function onPointerDown(e: RPointerEvent<HTMLElement>) {
    useWindows.getState().focus(win.id)
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    if (!target.closest('[data-drag]') || target.closest('button, a, input, textarea, select, [data-nodrag]')) return
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const ox = x.get()
    const oy = y.get()
    interacting.current = true
    const el = e.currentTarget
    el.setPointerCapture(e.pointerId)
    el.classList.add('is-dragging')
    const move = (ev: PointerEvent) => {
      x.set(ox + ev.clientX - startX)
      y.set(Math.max(30, oy + ev.clientY - startY))
    }
    const up = () => {
      interacting.current = false
      el.classList.remove('is-dragging')
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      useWindows.getState().setRect(win.id, { x: x.get(), y: y.get() })
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
  }

  function onDoubleClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement
    if (target.closest('[data-drag]') && !target.closest('button, a, input, [data-nodrag]')) {
      useWindows.getState().toggleMaximize(win.id)
    }
  }

  function startResize(dir: Dir, e: RPointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return
    e.stopPropagation()
    e.preventDefault()
    const min = minSize[win.app]
    const sx = e.clientX
    const sy = e.clientY
    const o = { x: x.get(), y: y.get(), w: w.get(), h: h.get() }
    interacting.current = true
    const el = e.currentTarget
    el.setPointerCapture(e.pointerId)
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx
      const dy = ev.clientY - sy
      if (dir.includes('e')) w.set(Math.max(min.w, o.w + dx))
      if (dir.includes('s')) h.set(Math.max(min.h, o.h + dy))
      if (dir.includes('w')) {
        const nw = Math.max(min.w, o.w - dx)
        w.set(nw)
        x.set(o.x + o.w - nw)
      }
      if (dir.includes('n')) {
        const nh = Math.max(min.h, o.h - dy)
        const ny = Math.max(30, o.y + o.h - nh)
        h.set(o.y + o.h - ny)
        y.set(ny)
      }
    }
    const up = () => {
      interacting.current = false
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      useWindows.getState().setRect(win.id, { x: x.get(), y: y.get(), w: w.get(), h: h.get() })
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
  }

  return (
    <motion.section
      ref={ref}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      className={`window${active ? ' is-active' : ''}${win.minimized ? ' is-minimized' : ''}${win.maximized ? ' is-maximized' : ''}`}
      style={{ x, y, width: w, height: h, scale, opacity, zIndex: win.z }}
      exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.95, transition: { duration: 0.16, ease: 'easeIn' } }}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
      aria-hidden={win.minimized || undefined}
      inert={win.minimized || undefined}
    >
      <h2 id={titleId} className="sr-only">
        {title}
      </h2>
      <ShellProvider value={{ id: win.id, active, mobile: false, titleId }}>
        <TrafficLights id={win.id} maximized={win.maximized} />
        <div className="window__body">{children}</div>
      </ShellProvider>
      {!win.maximized &&
        DIRS.map((d) => <div key={d} className={`rz rz--${d}`} onPointerDown={(e) => startResize(d, e)} aria-hidden="true" />)}
    </motion.section>
  )
}

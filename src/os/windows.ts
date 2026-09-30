import { create } from 'zustand'
import { projectBySlug, type Project } from '../data/projects'

export type AppId = 'projects' | 'case' | 'about' | 'contact' | 'messages' | 'notes' | 'trash'

export type Rect = { x: number; y: number; w: number; h: number }

export type Win = Rect & {
  id: string
  /** chave de renderização estável: sobrevive quando o case troca de projeto */
  key: string
  app: AppId
  slug?: Project['slug']
  z: number
  minimized: boolean
  maximized: boolean
  /** retângulo antes de maximizar, para voltar */
  restore?: Rect
}

// Medidas em rem. No Mac, 1rem acompanha o tamanho da tela (global.css), então
// janelas, barra de menus e Dock crescem e encolhem juntos. O valor em px é lido
// no primeiro uso e de novo quando a tela muda de tamanho.
let unit = 0
window.addEventListener('resize', () => (unit = 0))

/** `n` rem em px de tela */
export function rem(n: number) {
  unit ||= parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  return n * unit
}

/** altura da barra de menus e espaço reservado ao Dock (as mesmas do CSS) */
export const menubarH = () => rem(1.875)
const dockReserve = () => rem(6)

type Size = { w: number; h: number }

// Tamanho inicial de cada app: o tamanho de desenho em rem (que já acompanha a
// tela), limitado a uma fração da área útil quando a tela é estreita ou baixa.
const fit = (cap: number, frac: number, of: number) => Math.min(rem(cap), of * frac)
const defaultSize: Record<AppId, (a: Size) => Size> = {
  projects: (a) => ({ w: fit(48.75, 0.6, a.w), h: fit(32.5, 0.8, a.h) }),
  case: (a) => ({ w: fit(67.5, 0.75, a.w), h: a.h - rem(1.5) }),
  about: (a) => ({ w: fit(35, 0.43, a.w), h: Math.min(rem(41.25), a.h - rem(1.5)) }),
  contact: (a) => ({ w: fit(36.25, 0.44, a.w), h: fit(33.75, 0.8, a.h) }),
  messages: (a) => ({ w: fit(42.5, 0.52, a.w), h: fit(30, 0.8, a.h) }),
  notes: (a) => ({ w: fit(43.75, 0.54, a.w), h: fit(33.75, 0.8, a.h) }),
  trash: (a) => ({ w: fit(42.5, 0.52, a.w), h: fit(27.5, 0.8, a.h) }),
}

/** tamanho mínimo, em rem */
const minRem: Record<AppId, Size> = {
  projects: { w: 30, h: 20 },
  case: { w: 32.5, h: 22.5 },
  about: { w: 28.75, h: 21.25 },
  contact: { w: 26.25, h: 26.25 },
  messages: { w: 28.75, h: 22.5 },
  notes: { w: 28.75, h: 22.5 },
  trash: { w: 27.5, h: 20 },
}

export function minSize(app: AppId): Size {
  return { w: rem(minRem[app].w), h: rem(minRem[app].h) }
}

export function workArea() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const top = menubarH()
  return { x: 0, y: top, w: vw, h: vh - top - dockReserve() + rem(0.5) }
}

export function windowId(app: AppId, slug?: string) {
  return app === 'case' ? `case:${slug}` : app
}

type State = {
  wins: Record<string, Win>
  zTop: number
  open: (app: AppId, slug?: Project['slug'], at?: Partial<Rect>) => string
  close: (id: string) => void
  closeAll: () => void
  focus: (id: string) => void
  minimize: (id: string) => void
  toggleMaximize: (id: string) => void
  setRect: (id: string, r: Partial<Rect>) => void
  clampAll: () => void
  /** troca o projeto mostrado numa janela de case, mantendo posição e tamanho */
  retarget: (id: string, slug: Project['slug']) => void
}

function maximizedRect(area: Rect): Rect {
  return { x: rem(0.5), y: area.y + rem(0.375), w: area.w - rem(1), h: area.h - rem(0.75) }
}

function clampRect(r: Rect, app: AppId): Rect {
  const area = workArea()
  const min = minSize(app)
  const room = { w: area.w - rem(1), h: area.h - rem(0.5) }
  const w = Math.max(Math.min(r.w, room.w), Math.min(min.w, room.w))
  const h = Math.max(Math.min(r.h, room.h), Math.min(min.h, room.h))
  // a barra de título nunca some: pelo menos 7,5rem da janela ficam na tela
  const keep = rem(7.5)
  const x = Math.min(Math.max(r.x, -w + keep), area.w - keep)
  const y = Math.min(Math.max(r.y, area.y), area.y + area.h - rem(2.75))
  return { x, y, w, h }
}

export const useWindows = create<State>()((set, get) => ({
  wins: {},
  zTop: 10,

  open(app, slug, at) {
    const id = windowId(app, slug)
    const { wins, zTop } = get()
    const existing = wins[id]
    if (existing) {
      set({
        wins: { ...wins, [id]: { ...existing, minimized: false, z: zTop + 1 } },
        zTop: zTop + 1,
      })
      return id
    }
    const area = workArea()
    const size = { ...defaultSize[app](area) }
    // cascata: cada janela nova desce e anda 28px a partir do centro
    const visible = Object.values(wins).filter((w) => !w.minimized).length
    const step = (visible % 6) * rem(1.75)
    // a área livre fica entre os widgets (esquerda) e os ícones da mesa (direita);
    // se a janela cabe ali, abre centrada nela, senão centrada na tela
    const freeLeft = area.w >= rem(68.75) ? rem(22.5) : 0
    const freeRight = area.w - rem(8.125)
    const free = freeRight - freeLeft
    // janelas de apoio encolhem para caber na área livre; o case prefere a tela toda
    const gutter = rem(1.5)
    if (app !== 'case' && size.w > free && free >= minSize(app).w + gutter) size.w = free - gutter
    const fits = size.w <= free
    const x = fits ? freeLeft + Math.round((freeRight - freeLeft - size.w) / 2) : Math.round((area.w - size.w) / 2)
    const base: Rect = {
      w: size.w,
      h: size.h,
      x: x + step - (fits ? 0 : rem(2.5)),
      y: Math.round(area.y + Math.max(rem(0.75), (area.h - size.h) / 2 - rem(1.25))) + step,
      ...at,
    }
    const rect = clampRect(base, app)
    set({
      wins: {
        ...wins,
        [id]: { id, key: `${id}#${zTop + 1}`, app, slug, ...rect, z: zTop + 1, minimized: false, maximized: false },
      },
      zTop: zTop + 1,
    })
    return id
  },

  close(id) {
    const wins = { ...get().wins }
    delete wins[id]
    set({ wins })
  },

  closeAll() {
    set({ wins: {} })
  },

  focus(id) {
    const { wins, zTop } = get()
    const w = wins[id]
    if (!w || (w.z === zTop && !w.minimized)) return
    set({ wins: { ...wins, [id]: { ...w, z: zTop + 1, minimized: false } }, zTop: zTop + 1 })
  },

  minimize(id) {
    const { wins } = get()
    const w = wins[id]
    if (!w) return
    set({ wins: { ...wins, [id]: { ...w, minimized: true } } })
  },

  toggleMaximize(id) {
    const { wins, zTop } = get()
    const w = wins[id]
    if (!w) return
    if (w.maximized && w.restore) {
      set({ wins: { ...wins, [id]: { ...w, ...w.restore, maximized: false, restore: undefined } } })
      return
    }
    const area = workArea()
    const full = maximizedRect(area)
    set({
      wins: {
        ...wins,
        [id]: { ...w, ...full, maximized: true, restore: { x: w.x, y: w.y, w: w.w, h: w.h }, z: zTop + 1 },
      },
      zTop: zTop + 1,
    })
  },

  setRect(id, r) {
    const { wins } = get()
    const w = wins[id]
    if (!w) return
    const next = clampRect({ x: w.x, y: w.y, w: w.w, h: w.h, ...r }, w.app)
    set({ wins: { ...wins, [id]: { ...w, ...next, maximized: false } } })
  },

  retarget(id, slug) {
    const { wins, zTop } = get()
    const w = wins[id]
    if (!w) return
    const nextId = windowId('case', slug)
    const next = { ...wins }
    delete next[id]
    if (next[nextId]) {
      next[nextId] = { ...next[nextId], minimized: false, z: zTop + 1 }
    } else {
      next[nextId] = { ...w, id: nextId, slug, z: zTop + 1 }
    }
    set({ wins: next, zTop: zTop + 1 })
  },

  clampAll() {
    const { wins } = get()
    const area = workArea()
    const next: Record<string, Win> = {}
    for (const w of Object.values(wins)) {
      const r = w.maximized
        ? maximizedRect(area)
        : clampRect(w, w.app)
      next[w.id] = { ...w, ...r }
    }
    set({ wins: next })
  },
}))

/** Janela em primeiro plano (a de maior z que não está minimizada). */
export function topWindow(wins: Record<string, Win>): Win | undefined {
  let top: Win | undefined
  for (const w of Object.values(wins)) if (!w.minimized && (!top || w.z > top.z)) top = w
  return top
}

/** Cor da marca do case em primeiro plano (versão clara no tema escuro), ou nada. */
export function useFocusedAccent(theme: 'light' | 'dark'): string | undefined {
  const slug = useWindows((s) => {
    const top = topWindow(s.wins)
    return top?.app === 'case' ? top.slug : undefined
  })
  if (!slug) return undefined
  const p = projectBySlug[slug]
  return theme === 'dark' ? p.glow : p.accent
}

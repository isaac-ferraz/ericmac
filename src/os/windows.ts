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

export const MENUBAR_H = 30
export const DOCK_RESERVE = 96

type Size = { w: number; h: number }

// Tamanho inicial de cada app, sempre limitado à área útil da tela.
const defaultSize: Record<AppId, (vw: number, vh: number) => Size> = {
  projects: () => ({ w: 780, h: 520 }),
  case: (vw, vh) => ({ w: Math.min(1080, vw - 160), h: vh - MENUBAR_H - DOCK_RESERVE - 24 }),
  about: (_vw, vh) => ({ w: 560, h: Math.min(660, vh - MENUBAR_H - DOCK_RESERVE - 24) }),
  contact: () => ({ w: 580, h: 540 }),
  messages: () => ({ w: 680, h: 480 }),
  notes: () => ({ w: 700, h: 540 }),
  trash: () => ({ w: 680, h: 440 }),
}

export const minSize: Record<AppId, Size> = {
  projects: { w: 480, h: 320 },
  case: { w: 520, h: 360 },
  about: { w: 460, h: 340 },
  contact: { w: 420, h: 420 },
  messages: { w: 460, h: 360 },
  notes: { w: 460, h: 360 },
  trash: { w: 440, h: 320 },
}

export function workArea() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  return { x: 0, y: MENUBAR_H, w: vw, h: vh - MENUBAR_H - DOCK_RESERVE + 8 }
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

function clampRect(r: Rect, app: AppId): Rect {
  const area = workArea()
  const min = minSize[app]
  const w = Math.max(Math.min(r.w, area.w - 16), Math.min(min.w, area.w - 16))
  const h = Math.max(Math.min(r.h, area.h - 8), Math.min(min.h, area.h - 8))
  // a barra de título nunca some: pelo menos 120px da janela ficam na tela
  const x = Math.min(Math.max(r.x, -w + 120), area.w - 120)
  const y = Math.min(Math.max(r.y, area.y), area.y + area.h - 44)
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
    const size = { ...defaultSize[app](area.w, area.h + DOCK_RESERVE) }
    // cascata: cada janela nova desce e anda 28px a partir do centro
    const visible = Object.values(wins).filter((w) => !w.minimized).length
    const step = (visible % 6) * 28
    // a área livre fica entre os widgets (esquerda) e os ícones da mesa (direita);
    // se a janela cabe ali, abre centrada nela, senão centrada na tela
    const freeLeft = area.w >= 1100 ? 360 : 0
    const freeRight = area.w - 130
    const free = freeRight - freeLeft
    // janelas de apoio encolhem para caber na área livre; o case prefere a tela toda
    if (app !== 'case' && size.w > free && free >= minSize[app].w + 24) size.w = free - 24
    const fits = size.w <= free
    const x = fits ? freeLeft + Math.round((freeRight - freeLeft - size.w) / 2) : Math.round((area.w - size.w) / 2)
    const base: Rect = {
      w: size.w,
      h: size.h,
      x: x + step - (fits ? 0 : 40),
      y: Math.round(area.y + Math.max(12, (area.h - size.h) / 2 - 20)) + step,
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
    const full = { x: 8, y: area.y + 6, w: area.w - 16, h: area.h - 12 }
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
        ? { x: 8, y: area.y + 6, w: area.w - 16, h: area.h - 12 }
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

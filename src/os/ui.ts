import { create } from 'zustand'

type Toast = { id: number; title: string; body?: string }

type UI = {
  spotlight: boolean
  controlCenter: boolean
  booting: boolean
  toasts: Toast[]
  setSpotlight: (v: boolean) => void
  setControlCenter: (v: boolean) => void
  setBooting: (v: boolean) => void
  toast: (title: string, body?: string) => void
  dismiss: (id: number) => void
}

let nextId = 1

export const useUI = create<UI>()((set, get) => ({
  spotlight: false,
  controlCenter: false,
  // o boot inicial é a tela do index.html; este estado só liga no "Reiniciar…"
  booting: false,
  toasts: [],
  setSpotlight: (spotlight) => set({ spotlight, controlCenter: false }),
  setControlCenter: (controlCenter) => set({ controlCenter, spotlight: false }),
  setBooting: (booting) => set({ booting }),
  toast(title, body) {
    const id = nextId++
    set({ toasts: [...get().toasts.slice(-2), { id, title, body }] })
    window.setTimeout(() => get().dismiss(id), 3200)
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))

// Posição dos ícones do Dock, para a janela minimizada saber para onde encolher.
const dockSlots = new Map<string, HTMLElement>()

export function registerDockSlot(key: string, el: HTMLElement | null) {
  if (el) dockSlots.set(key, el)
  else dockSlots.delete(key)
}

export function dockSlotRect(key: string): DOMRect | undefined {
  return dockSlots.get(key)?.getBoundingClientRect()
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

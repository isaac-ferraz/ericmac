import { useEffect } from 'react'
import { useWindows, topWindow, type AppId } from './windows'
import { projects, type Project } from '../data/projects'

// Endereços legíveis para cada janela: #/kozok, #/sobre, #/contato…
const appPaths: Partial<Record<AppId, string>> = {
  projects: 'projetos',
  about: 'sobre',
  contact: 'contato',
  messages: 'mensagens',
  notes: 'notas',
  trash: 'lixeira',
}

const pathToApp = Object.fromEntries(Object.entries(appPaths).map(([k, v]) => [v, k])) as Record<string, AppId>
const slugs = new Set(projects.map((p) => p.slug))

export function parseHash(hash: string): { app: AppId; slug?: Project['slug'] } | null {
  const path = decodeURIComponent(hash.replace(/^#\/?/, '')).toLowerCase()
  if (!path) return null
  if (slugs.has(path as Project['slug'])) return { app: 'case', slug: path as Project['slug'] }
  const app = pathToApp[path]
  return app ? { app } : null
}

function hashFor(app: AppId, slug?: string) {
  return app === 'case' ? `#/${slug}` : `#/${appPaths[app]}`
}

/** Mantém o endereço em sincronia com a janela em primeiro plano, e abre a janela do endereço. */
export function useHashRouting(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const openFromHash = () => {
      const r = parseHash(location.hash)
      if (r) useWindows.getState().open(r.app, r.slug)
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    const unsub = useWindows.subscribe((s) => {
      const top = topWindow(s.wins)
      const next = top ? hashFor(top.app, top.slug) : ''
      if (location.hash !== next && !(next === '' && location.hash === '')) {
        history.replaceState(null, '', next || location.pathname + location.search)
      }
    })
    return () => {
      window.removeEventListener('hashchange', openFromHash)
      unsub()
    }
  }, [enabled])
}

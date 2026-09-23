import { lazy, Suspense } from 'react'
import type { AppId, Win } from '../os/windows'
import type { StringKey } from '../i18n/strings'
import type { IconName } from '../brand/icons'
import { projectBySlug } from '../data/projects'
import { Projects } from './Projects'

// Projetos abre junto com a mesa; os outros apps só carregam quando alguém abre
// (e são buscados de antemão quando o navegador fica ocioso — ver prefetchApps).
const loaders = {
  case: () => import('./CaseViewer'),
  about: () => import('./About'),
  contact: () => import('./Contact'),
  messages: () => import('./Messages'),
  notes: () => import('./Notes'),
  trash: () => import('./Trash'),
}

const CaseViewer = lazy(() => loaders.case().then((m) => ({ default: m.CaseViewer })))
const About = lazy(() => loaders.about().then((m) => ({ default: m.About })))
const Contact = lazy(() => loaders.contact().then((m) => ({ default: m.Contact })))
const Messages = lazy(() => loaders.messages().then((m) => ({ default: m.Messages })))
const Notes = lazy(() => loaders.notes().then((m) => ({ default: m.Notes })))
const Trash = lazy(() => loaders.trash().then((m) => ({ default: m.Trash })))

export function prefetchApps() {
  const run = () => Object.values(loaders).forEach((load) => void load())
  // Safari não tem requestIdleCallback
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(run, { timeout: 4000 })
  else setTimeout(run, 2500)
}

export const appMeta: Record<AppId, { title: StringKey; icon: IconName }> = {
  projects: { title: 'app.projects', icon: 'projects' },
  case: { title: 'app.projects', icon: 'projects' },
  about: { title: 'app.about', icon: 'about' },
  contact: { title: 'app.contact', icon: 'contact' },
  messages: { title: 'app.messages', icon: 'messages' },
  notes: { title: 'app.notes', icon: 'notes' },
  trash: { title: 'app.trash', icon: 'trash' },
}

export function windowTitle(win: Pick<Win, 'app' | 'slug'>, t: (k: StringKey) => string) {
  if (win.app === 'case' && win.slug) return projectBySlug[win.slug].name
  return t(appMeta[win.app].title)
}

export function AppContent({ win }: { win: Pick<Win, 'app' | 'slug'> }) {
  return (
    <Suspense fallback={<div className="app-loading" aria-busy="true" />}>
      <AppSwitch win={win} />
    </Suspense>
  )
}

function AppSwitch({ win }: { win: Pick<Win, 'app' | 'slug'> }) {
  switch (win.app) {
    case 'projects':
      return <Projects />
    case 'case':
      return <CaseViewer slug={win.slug!} />
    case 'about':
      return <About />
    case 'contact':
      return <Contact />
    case 'messages':
      return <Messages />
    case 'notes':
      return <Notes />
    case 'trash':
      return <Trash />
  }
}

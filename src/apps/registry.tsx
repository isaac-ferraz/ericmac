import type { AppId, Win } from '../os/windows'
import type { StringKey } from '../i18n/strings'
import type { IconName } from '../brand/icons'
import { projectBySlug } from '../data/projects'
import { Projects } from './Projects'
import { CaseViewer } from './CaseViewer'
import { About } from './About'
import { Contact } from './Contact'
import { Messages } from './Messages'
import { Notes } from './Notes'
import { Trash } from './Trash'

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

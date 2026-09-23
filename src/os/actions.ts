import { useWindows, type AppId } from './windows'
import type { Project } from '../data/projects'
import { profile } from '../data/profile'

export function openApp(app: AppId, slug?: Project['slug']) {
  return useWindows.getState().open(app, slug)
}

export function openProject(slug: Project['slug']) {
  return openApp('case', slug)
}

export const links = {
  behance: profile.contact.behance,
  linkedin: profile.contact.linkedin,
  instagram: profile.contact.instagram,
} as const

export function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

/** vCard para quem quiser salvar o Eric nos contatos. */
export function vcardHref() {
  const c = profile.contact
  const card = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.fullName}`,
    'N:Macintyre;Eric;;;',
    `TITLE:${profile.role.pt}`,
    `ORG:${profile.company}`,
    `EMAIL;TYPE=INTERNET:${c.email}`,
    `TEL;TYPE=CELL:${c.phoneHref.replace('tel:', '')}`,
    `URL:${c.behance}`,
    `URL:${c.linkedin}`,
    'END:VCARD',
  ].join('\r\n')
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(card)}`
}

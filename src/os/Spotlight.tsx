import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useUI, copyText } from './ui'
import { useSettings, useResolvedTheme } from './settings'
import { openApp, openProject, openExternal, links } from './actions'
import { useT, useLang } from '../i18n'
import { projects } from '../data/projects'
import { profile } from '../data/profile'
import { AppIcon, FolderIcon, type IconName } from '../brand/icons'
import './Spotlight.css'

type Result = {
  id: string
  group: 'projects' | 'apps' | 'actions' | 'links'
  label: string
  sub?: string
  icon: { kind: 'app'; name: IconName } | { kind: 'folder'; accent: string; cover: string } | { kind: 'glyph'; text: string }
  keywords: string
  run: () => void
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export function Spotlight() {
  const open = useUI((s) => s.spotlight)
  return <AnimatePresence>{open && <Panel />}</AnimatePresence>
}

function Panel() {
  const t = useT()
  const lang = useLang()
  const close = () => useUI.getState().setSpotlight(false)
  const toast = useUI((s) => s.toast)
  const resolved = useResolvedTheme()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const opener = useRef<Element | null>(document.activeElement)

  useEffect(() => {
    input.current?.focus()
    const back = opener.current
    return () => (back as HTMLElement | null)?.focus?.()
  }, [])

  const all = useMemo<Result[]>(() => {
    const r: Result[] = projects.map((p) => ({
      id: `p-${p.slug}`,
      group: 'projects',
      label: p.name,
      sub: `${p.tagline[lang]} · ${p.sector[lang]}`,
      icon: { kind: 'folder', accent: p.accent, cover: p.cover.key },
      keywords: [p.name, p.tagline.pt, p.tagline.en, p.sector.pt, p.sector.en, ...p.fields.flatMap((f) => [f.pt, f.en]), ...p.tools, 'projeto project case'].join(' '),
      run: () => openProject(p.slug),
    }))
    const apps: [string, IconName, string, () => void][] = [
      [t('app.projects'), 'projects', 'finder pastas folders trabalhos work portfolio', () => openApp('projects')],
      [t('app.about'), 'about', 'eric sobre about bio quem who curriculo cv xp designer', () => openApp('about')],
      [t('app.contact'), 'contact', 'contato contact email e-mail mail falar hire contratar', () => openApp('contact')],
      [t('app.messages'), 'messages', 'mensagens messages depoimentos comentarios testimonials reviews', () => openApp('messages')],
      [t('app.notes'), 'notes', 'notas notes processo process metodo method como trabalho', () => openApp('notes')],
      [t('app.trash'), 'trash', 'lixeira trash antes before antigo old', () => openApp('trash')],
    ]
    for (const [label, icon, kw, run] of apps) r.push({ id: `a-${icon}`, group: 'apps', label, icon: { kind: 'app', name: icon }, keywords: `${label} ${kw}`, run })
    r.push(
      {
        id: 'x-email',
        group: 'actions',
        label: t('spot.copyEmail'),
        sub: profile.contact.email,
        icon: { kind: 'app', name: 'contact' },
        keywords: 'copiar copy email e-mail endereco address',
        run: async () => {
          if (await copyText(profile.contact.email)) toast(t('contact.copied'), profile.contact.email)
        },
      },
      {
        id: 'x-theme',
        group: 'actions',
        label: t('spot.toggleTheme'),
        icon: { kind: 'glyph', text: '◐' },
        keywords: 'tema theme escuro dark claro light aparencia appearance modo mode',
        run: () => useSettings.getState().setTheme(resolved === 'dark' ? 'light' : 'dark'),
      },
      {
        id: 'x-lang',
        group: 'actions',
        label: t('spot.switchLang'),
        icon: { kind: 'glyph', text: lang === 'pt' ? 'EN' : 'PT' },
        keywords: 'idioma language english ingles portugues portuguese',
        run: () => useSettings.getState().toggleLang(),
      },
      { id: 'l-wa', group: 'links', label: 'WhatsApp', sub: profile.contact.phoneDisplay, icon: { kind: 'app', name: 'messages' }, keywords: 'whatsapp zap telefone phone celular', run: () => openExternal(profile.contact.whatsapp) },
      { id: 'l-be', group: 'links', label: 'Behance', sub: 'ericmacintyre1', icon: { kind: 'app', name: 'behance' }, keywords: 'behance portfolio', run: () => openExternal(links.behance) },
      { id: 'l-in', group: 'links', label: 'LinkedIn', sub: 'eric-macintyre', icon: { kind: 'app', name: 'linkedin' }, keywords: 'linkedin cv carreira career', run: () => openExternal(links.linkedin) },
      { id: 'l-ig', group: 'links', label: 'Instagram', sub: profile.contact.instagramHandle, icon: { kind: 'app', name: 'instagram' }, keywords: 'instagram insta oericmac', run: () => openExternal(links.instagram) },
    )
    return r
  }, [t, lang, resolved, toast])

  const results = useMemo(() => {
    const tokens = norm(q).split(/\s+/).filter(Boolean)
    if (!tokens.length) return all.filter((r) => r.group === 'projects' || r.id === 'a-contact' || r.id === 'a-about')
    return all.filter((r) => {
      const hay = norm(`${r.label} ${r.sub ?? ''} ${r.keywords}`)
      return tokens.every((tk) => hay.includes(tk))
    })
  }, [q, all])

  useEffect(() => setSel(0), [q])

  const groups: Result['group'][] = ['projects', 'apps', 'actions', 'links']
  const ordered = groups.flatMap((g) => results.filter((r) => r.group === g))

  function run(r: Result | undefined) {
    if (!r) return
    close()
    r.run()
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') setSel((s) => Math.min(ordered.length - 1, s + 1))
    else if (e.key === 'ArrowUp') setSel((s) => Math.max(0, s - 1))
    else if (e.key === 'Enter') run(ordered[sel])
    else if (e.key === 'Escape') close()
    else return
    e.preventDefault()
  }

  const groupLabel: Record<Result['group'], string> = {
    projects: t('spot.projects'),
    apps: t('spot.apps'),
    actions: t('spot.actions'),
    links: t('spot.links'),
  }

  let index = -1
  return (
    <motion.div className="spot-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} onPointerDown={close}>
      <motion.div
        className="spot"
        role="dialog"
        aria-label={t('spot.label')}
        initial={{ opacity: 0, scale: 0.97, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 520, damping: 36 }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="spot__field">
          <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" /><path d="M10.4 10.4L14 14" /></svg>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder={t('spot.placeholder')}
            aria-label={t('spot.placeholder')}
            role="combobox"
            aria-expanded="true"
            aria-controls="spot-list"
            aria-activedescendant={ordered[sel] ? `spot-${ordered[sel].id}` : undefined}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        {ordered.length > 0 ? (
          <div className="spot__list" id="spot-list" role="listbox" aria-label={t('spot.label')}>
            {groups.map((g) => {
              const items = results.filter((r) => r.group === g)
              if (!items.length) return null
              return (
                <div key={g} role="group" aria-label={groupLabel[g]}>
                  <p className="spot__group" aria-hidden="true">{groupLabel[g]}</p>
                  {items.map((r) => {
                    index++
                    const i = index
                    return (
                      <div
                        key={r.id}
                        id={`spot-${r.id}`}
                        role="option"
                        aria-selected={i === sel}
                        className="spot__item"
                        onPointerMove={() => setSel(i)}
                        onClick={() => run(r)}
                      >
                        {r.icon.kind === 'app' ? (
                          <AppIcon name={r.icon.name} size={28} />
                        ) : r.icon.kind === 'folder' ? (
                          <FolderIcon accent={r.icon.accent} cover={r.icon.cover} size={30} />
                        ) : (
                          <span className="spot__glyph" aria-hidden="true">{r.icon.text}</span>
                        )}
                        <span className="spot__label">{r.label}</span>
                        {r.sub && <span className="spot__sub">{r.sub}</span>}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        ) : (
          <p className="spot__empty">{t('spot.empty', { q })}</p>
        )}
      </motion.div>
    </motion.div>
  )
}

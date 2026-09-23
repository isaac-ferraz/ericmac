import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { projects, type Project } from '../data/projects'
import { useT, useLang, formatDate, type L } from '../i18n'
import { useShell } from '../os/Window'
import { openProject } from '../os/actions'
import { Pic } from '../lib/Pic'
import './Projects.css'

type Filter = { kind: 'all' } | { kind: 'field'; value: string } | { kind: 'tool'; value: string }

function uniqueFields() {
  const map = new Map<string, { label: L; count: number }>()
  for (const p of projects)
    for (const f of p.fields) {
      const cur = map.get(f.pt)
      map.set(f.pt, { label: f, count: (cur?.count ?? 0) + 1 })
    }
  return [...map.entries()].sort((a, b) => b[1].count - a[1].count)
}

function uniqueTools() {
  const map = new Map<string, number>()
  for (const p of projects) for (const t of p.tools) map.set(t, (map.get(t) ?? 0) + 1)
  return [...map.entries()]
}

function matches(p: Project, f: Filter) {
  if (f.kind === 'all') return true
  if (f.kind === 'field') return p.fields.some((x) => x.pt === f.value)
  return p.tools.includes(f.value)
}

export function Projects() {
  const t = useT()
  const lang = useLang()
  const { mobile, active } = useShell()
  const [filter, setFilter] = useState<Filter>({ kind: 'all' })
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [focused, setFocused] = useState(0)
  const [peek, setPeek] = useState<Project | null>(null)
  const fields = useMemo(uniqueFields, [])
  const tools = useMemo(uniqueTools, [])
  const list = projects.filter((p) => matches(p, filter))
  const itemRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => setFocused(0), [filter])

  // Espaço abre/fecha a pré-visualização, como o Quick Look
  useEffect(() => {
    if (!peek) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault()
        setPeek(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [peek])

  function onGridKey(e: KeyboardEvent) {
    if (!list.length) return
    const cols = view === 'grid' ? (mobile ? 1 : Math.max(1, Math.round((e.currentTarget as HTMLElement).clientWidth / 240))) : 1
    let next = focused
    if (e.key === 'ArrowRight') next = Math.min(list.length - 1, focused + 1)
    else if (e.key === 'ArrowLeft') next = Math.max(0, focused - 1)
    else if (e.key === 'ArrowDown') next = Math.min(list.length - 1, focused + cols)
    else if (e.key === 'ArrowUp') next = Math.max(0, focused - cols)
    else if (e.key === ' ' && active) {
      e.preventDefault()
      setPeek(list[focused])
      return
    } else return
    e.preventDefault()
    setFocused(next)
    itemRefs.current[next]?.focus()
  }

  const isSel = (f: Filter) =>
    f.kind === filter.kind && (f.kind === 'all' || (filter.kind !== 'all' && f.value === filter.value))

  const count = list.length === 1 ? t('finder.item') : t('finder.items', { n: list.length })

  const sidebar = (
    <nav className={mobile ? 'finder-chips' : 'sidebar'} aria-label={t('app.projects')} data-drag={mobile ? undefined : true}>
      {!mobile && <p className="sidebar__label">{t('finder.favourites')}</p>}
      <FilterItem mobile={mobile} current={isSel({ kind: 'all' })} onClick={() => setFilter({ kind: 'all' })} label={t('finder.all')} count={projects.length} icon="folder" />
      {!mobile && <p className="sidebar__label">{t('finder.fields')}</p>}
      {fields.map(([key, { label, count }]) => (
        <FilterItem
          key={key}
          mobile={mobile}
          current={isSel({ kind: 'field', value: key })}
          onClick={() => setFilter({ kind: 'field', value: key })}
          label={label[lang]}
          count={count}
          icon="tag"
        />
      ))}
      {!mobile && tools.length > 0 && <p className="sidebar__label">{t('finder.tools')}</p>}
      {!mobile &&
        tools.map(([tool, count]) => (
          <FilterItem
            key={tool}
            mobile={mobile}
            current={isSel({ kind: 'tool', value: tool })}
            onClick={() => setFilter({ kind: 'tool', value: tool })}
            label={tool}
            count={count}
            icon="tool"
          />
        ))}
      {!mobile && (
        <>
          <p className="sidebar__label">Tags</p>
          {projects.map((p) => (
            <button key={p.slug} type="button" className="sidebar__item" onClick={() => openProject(p.slug)}>
              <span className="sidebar__dot" style={{ background: p.accent }} aria-hidden="true" />
              {p.name}
            </button>
          ))}
        </>
      )}
    </nav>
  )

  return (
    <div className={`finder${mobile ? ' finder--mobile' : ''}`}>
      {sidebar}
      <div className="finder__main">
        {!mobile && (
          <header className="toolbar finder__toolbar" data-drag>
            <div>
              <p className="toolbar__title">{t('app.projects')}</p>
              <p className="toolbar__sub">{count}</p>
            </div>
            <span className="toolbar__spacer" />
            <div className="segmented" role="group" aria-label={`${t('finder.grid')} / ${t('finder.list')}`}>
              <button type="button" className="tool-btn" aria-pressed={view === 'grid'} onClick={() => setView('grid')} aria-label={t('finder.grid')}>
                <svg viewBox="0 0 16 16"><rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" /><rect x="2" y="9" width="5" height="5" rx="1" /><rect x="9" y="9" width="5" height="5" rx="1" /></svg>
              </button>
              <button type="button" className="tool-btn" aria-pressed={view === 'list'} onClick={() => setView('list')} aria-label={t('finder.list')}>
                <svg viewBox="0 0 16 16"><path d="M5 4h9M5 8h9M5 12h9M2 4h.01M2 8h.01M2 12h.01" /></svg>
              </button>
            </div>
          </header>
        )}

        {view === 'grid' || mobile ? (
          <ul className="finder__grid scroll" onKeyDown={onGridKey} aria-label={t('app.projects')}>
            {list.map((p, i) => (
              <li key={p.slug}>
                <button
                  ref={(el) => {
                    itemRefs.current[i] = el
                  }}
                  type="button"
                  className="finder__item"
                  tabIndex={i === focused ? 0 : -1}
                  onFocus={() => setFocused(i)}
                  onClick={() => openProject(p.slug)}
                  style={{ ['--item-accent' as string]: p.accent }}
                >
                  <span className="finder__thumb">
                    <Pic k={p.cover.key} alt="" thumb sizes="(max-width: 900px) 90vw, 320px" />
                  </span>
                  <span className="finder__name">{p.name}</span>
                  <span className="finder__meta">
                    {p.tagline[lang]} · {formatDate(p.published, lang, { year: 'numeric' })}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="finder__table scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">{t('finder.name')}</th>
                  <th scope="col">{t('finder.kind')}</th>
                  <th scope="col">{t('finder.date')}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.slug} onDoubleClick={() => openProject(p.slug)}>
                    <td>
                      <button type="button" className="finder__row-btn" onClick={() => openProject(p.slug)}>
                        <span className="sidebar__dot" style={{ background: p.accent }} aria-hidden="true" />
                        {p.name}
                      </button>
                    </td>
                    <td>{p.tagline[lang]}</td>
                    <td>{formatDate(p.published, lang, { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!mobile && (
          <footer className="statusbar">
            {count} · {t('finder.hint')}
          </footer>
        )}
      </div>

      <AnimatePresence>
        {peek && (
          <motion.div
            className="quicklook"
            role="dialog"
            aria-label={t('finder.quicklook', { name: peek.name })}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPeek(null)}
          >
            <motion.figure
              className="quicklook__card"
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Pic k={peek.cover.key} alt={peek.cover.alt[lang]} sizes="600px" eager />
              <figcaption>
                <span>
                  <strong>{peek.name}</strong> · {peek.tagline[lang]}
                </span>
                <button
                  type="button"
                  className="btn btn--primary"
                  autoFocus
                  onClick={() => {
                    setPeek(null)
                    openProject(peek.slug)
                  }}
                >
                  {t('finder.open')}
                </button>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterItem({
  mobile,
  current,
  onClick,
  label,
  count,
  icon,
}: {
  mobile: boolean
  current: boolean
  onClick: () => void
  label: string
  count: number
  icon: 'folder' | 'tag' | 'tool'
}) {
  if (mobile)
    return (
      <button type="button" className="chip" aria-pressed={current} onClick={onClick}>
        {label}
      </button>
    )
  return (
    <button type="button" className="sidebar__item" aria-current={current} onClick={onClick}>
      <svg className="sidebar__icon" viewBox="0 0 16 16" aria-hidden="true">
        {icon === 'folder' && <path d="M1.5 4.5a1 1 0 0 1 1-1h3.3l1.4 1.4h6.3a1 1 0 0 1 1 1v6.6a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1Z" />}
        {icon === 'tag' && <path d="M2 2.5h5.3l6.2 6.2-4.8 4.8L2.5 7.3V2.5ZM5 5h.01" />}
        {icon === 'tool' && <path d="M10.5 2.5l3 3-7.8 7.8H2.7v-3Z M9 4l3 3" />}
      </svg>
      {label}
      <span className="sidebar__count">{count}</span>
    </button>
  )
}

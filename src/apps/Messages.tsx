import { useState } from 'react'
import { testimonials } from '../data/profile'
import { projectBySlug } from '../data/projects'
import { useT, useLang, formatDate } from '../i18n'
import { useShell } from '../os/Window'
import { openProject } from '../os/actions'
import './Misc.css'

/** Os comentários deixados nos projetos do Behance, como conversas. */
export function Messages() {
  const t = useT()
  const { mobile } = useShell()
  const [current, setCurrent] = useState(0)

  if (mobile)
    return (
      <div className="msgs msgs--mobile">
        {testimonials.map((_, i) => (
          <Thread key={i} index={i} />
        ))}
      </div>
    )

  return (
    <div className="msgs">
      <nav className="sidebar msgs__list" data-drag aria-label={t('msg.inbox')}>
        <p className="sidebar__label">{t('msg.inbox')}</p>
        {testimonials.map((m, i) => (
          <button key={i} type="button" className="sidebar__item msgs__item" aria-current={i === current} onClick={() => setCurrent(i)}>
            <Avatar name={m.author} />
            <span>
              <strong>{m.author}</strong>
              <small>{m.text}</small>
            </span>
          </button>
        ))}
      </nav>
      <div className="msgs__main">
        <header className="toolbar msgs__toolbar" data-drag>
          <span className="toolbar__spacer" />
          <p className="toolbar__title">{testimonials[current].author}</p>
          <span className="toolbar__spacer" />
        </header>
        <div className="scroll msgs__scroll">
          <Thread index={current} />
        </div>
      </div>
    </div>
  )
}

function Thread({ index }: { index: number }) {
  const t = useT()
  const lang = useLang()
  const m = testimonials[index]
  const project = projectBySlug[m.project]
  return (
    <section className="thread" aria-label={m.author}>
      <p className="thread__meta">
        {formatDate(m.date, lang, { day: 'numeric', month: 'long', year: 'numeric' })} ·{' '}
        {t('msg.from', { project: project.name })}
      </p>
      <div className="thread__row">
        <Avatar name={m.author} />
        <div>
          <p className="thread__author">{m.author}</p>
          <blockquote className="bubble" lang="pt-BR">
            {m.text}
          </blockquote>
          {lang === 'en' && (
            <p className="thread__translation">
              {t('msg.translation')}: “{m.translation}”
            </p>
          )}
        </div>
      </div>
      <button type="button" className="thread__link" onClick={() => openProject(project.slug)} style={{ ['--link-accent' as string]: project.accent }}>
        <span className="sidebar__dot" style={{ background: project.accent }} aria-hidden="true" />
        {t('msg.see', { project: project.name })}
      </button>
    </section>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
  return (
    <span className="avatar" aria-hidden="true">
      {initials}
    </span>
  )
}

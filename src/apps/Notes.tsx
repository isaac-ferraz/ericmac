import { useState } from 'react'
import { notes, type Note } from '../data/notes'
import { useT, useLang, formatDate } from '../i18n'
import { useShell } from '../os/Window'
import './Misc.css'

export function Notes() {
  const t = useT()
  const lang = useLang()
  const { mobile } = useShell()
  const [current, setCurrent] = useState(notes[0].id)

  if (mobile)
    return (
      <div className="notes notes--mobile">
        {notes.map((n) => (
          <NoteBody key={n.id} note={n} />
        ))}
      </div>
    )

  const note = notes.find((n) => n.id === current)!
  return (
    <div className="notes">
      <nav className="sidebar notes__list" data-drag aria-label={t('notes.folder')}>
        <p className="sidebar__label">{t('notes.folder')}</p>
        {notes.map((n) => (
          <button key={n.id} type="button" className="sidebar__item notes__item" aria-current={n.id === current} onClick={() => setCurrent(n.id)}>
            <strong>{n.title[lang]}</strong>
            <small>{formatDate(n.date, lang, { day: 'numeric', month: 'short', year: 'numeric' })}</small>
          </button>
        ))}
      </nav>
      <div className="notes__main">
        <header className="toolbar notes__toolbar" data-drag>
          <span className="toolbar__spacer" />
          <p className="toolbar__sub">{formatDate(note.date, lang, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <span className="toolbar__spacer" />
        </header>
        <div className="scroll notes__scroll" tabIndex={0} aria-label={note.title[lang]}>
          <NoteBody note={note} />
        </div>
      </div>
    </div>
  )
}

function NoteBody({ note }: { note: Note }) {
  const lang = useLang()
  return (
    <article className="note">
      <h1 className="note__title">{note.title[lang]}</h1>
      {note.steps && (
        <ol className="note__steps">
          {note.steps.map((s, i) => (
            <li key={i}>
              <span className="note__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2 className="eyebrow">{s.title[lang]}</h2>
                <p>{s.body[lang]}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
      {note.paragraphs?.map((p, i) => (
        <p key={i} className="note__p">
          {p[lang]}
        </p>
      ))}
    </article>
  )
}

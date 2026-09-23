import { useState } from 'react'
import { projects } from '../data/projects'
import { useT, useLang } from '../i18n'
import { useShell } from '../os/Window'
import { useUI } from '../os/ui'
import { openProject } from '../os/actions'
import { Pic } from '../lib/Pic'
import './Misc.css'

// Os "antes" de cada redesign, como arquivos esquecidos na lixeira.
const files: Record<string, string> = {
  kozok: 'oculos-facil.png',
  tecinsoles: 'tecinsoles-antigo.png',
  raizes: 'raizes-antigo.png',
}

export function Trash() {
  const t = useT()
  const lang = useLang()
  const { mobile } = useShell()
  const toast = useUI((s) => s.toast)
  const [shake, setShake] = useState(0)

  return (
    <div className={`trash${mobile ? ' trash--mobile' : ''}`}>
      {!mobile && (
        <header className="toolbar" data-drag>
          <p className="toolbar__title">{t('app.trash')}</p>
          <span className="toolbar__spacer" />
          <button
            type="button"
            className="tool-btn"
            onClick={() => {
              setShake((n) => n + 1)
              toast(t('trash.nope'))
            }}
          >
            {t('trash.empty')}
          </button>
        </header>
      )}
      <div className="scroll trash__scroll">
        <h1 className="eyebrow trash__title">{t('trash.title')}</h1>
        <p className="trash__hint">{t('trash.hint')}</p>
        <ul className={`trash__grid${shake ? ' is-shaking' : ''}`} key={shake}>
          {projects.map((p) => (
            <li key={p.slug}>
              <button type="button" className="trash__file" onClick={() => openProject(p.slug)}>
                <span className="trash__thumb">
                  <Pic k={p.before.key} alt={p.before.alt[lang]} thumb sizes="240px" />
                </span>
                <span className="trash__name">{files[p.slug]}</span>
                <span className="trash__meta">{t('trash.was', { name: p.name })}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

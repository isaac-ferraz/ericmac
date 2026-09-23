import { profile } from '../data/profile'
import { useT, useLang } from '../i18n'
import { useShell } from '../os/Window'
import { openApp } from '../os/actions'
import { peanutContours } from '../brand/shapes'
import avatarUrl from '../../conteudo/behance/imagens/avatar.jpg?format=webp'
import './About.css'

const ring = peanutContours(6, 5)

/** "Sobre este Mac" — só que o Mac é o Eric. */
export function About() {
  const t = useT()
  const lang = useLang()
  const { mobile } = useShell()

  const rows = [
    { k: t('about.role'), v: `${profile.role[lang]} · ${profile.company}`, sub: profile.companySince[lang] },
    { k: t('about.based'), v: profile.city[lang] },
    { k: t('about.open'), v: profile.availability[lang].join(' · ') },
    { k: t('about.does'), v: profile.disciplines[lang].join(' · ') },
    { k: t('about.tools'), v: profile.tools.join(' · ') },
    { k: t('about.since'), v: String(profile.behanceSince) },
  ]

  return (
    <div className={`about${mobile ? ' about--mobile' : ''}`} data-drag>
      <div className="about__portrait">
        <svg className="about__ring" viewBox="-6 -6 212 112" aria-hidden="true">
          {ring.map((d, i) => (
            <path key={i} d={d} style={{ opacity: 1 - i * 0.14 }} />
          ))}
        </svg>
        <img src={avatarUrl} width={276} height={276} alt={lang === 'pt' ? 'Retrato do Eric Mac' : 'Portrait of Eric Mac'} />
      </div>

      <div className="about__info">
        <h1 className="about__name">
          eric mac<span>.</span>
        </h1>
        <p className="about__intro">{t('about.intro')}</p>

        <dl className="about__specs">
          {rows.map((r) => (
            <div key={r.k}>
              <dt>{r.k}</dt>
              <dd>
                {r.v}
                {r.sub && <span> — {r.sub}</span>}
              </dd>
            </div>
          ))}
        </dl>

        <div className="about__actions" data-nodrag>
          <button type="button" className="btn btn--primary" onClick={() => openApp('projects')}>
            {t('about.projects')}
          </button>
          <button type="button" className="btn" onClick={() => openApp('contact')}>
            {t('about.contact')}
          </button>
        </div>
      </div>
    </div>
  )
}

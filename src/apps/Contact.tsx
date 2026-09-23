import { useState } from 'react'
import { profile } from '../data/profile'
import { useT, useLang } from '../i18n'
import { useShell } from '../os/Window'
import { useUI, copyText } from '../os/ui'
import { vcardHref } from '../os/actions'
import { AppIcon, type IconName } from '../brand/icons'
import './Contact.css'

const c = profile.contact

/** Uma mensagem nova já endereçada ao Eric. "Escrever e-mail" leva o texto para o app de e-mail de quem visita. */
export function Contact() {
  const t = useT()
  const lang = useLang()
  const { mobile } = useShell()
  const toast = useUI((s) => s.toast)
  const [subject, setSubject] = useState<string | null>(null)
  const [body, setBody] = useState<string | null>(null)

  // enquanto a pessoa não edita, o rascunho acompanha o idioma
  const subj = subject ?? t('contact.subjectValue')
  const text = body ?? t('contact.body')
  const mailto = `mailto:${c.email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(text)}`

  const channels: { icon: IconName; label: string; detail: string; href: string; external?: boolean; download?: string }[] = [
    { icon: 'messages', label: t('contact.whatsapp'), detail: c.phoneDisplay, href: c.whatsapp, external: true },
    { icon: 'phone', label: t('contact.call'), detail: c.phoneDisplay, href: c.phoneHref },
    { icon: 'linkedin', label: 'LinkedIn', detail: 'eric-macintyre', href: c.linkedin, external: true },
    { icon: 'behance', label: 'Behance', detail: 'ericmacintyre1', href: c.behance, external: true },
    { icon: 'instagram', label: 'Instagram', detail: c.instagramHandle, href: c.instagram, external: true },
  ]

  async function copy() {
    if (await copyText(c.email)) toast(t('contact.copied'), c.email)
  }

  return (
    <div className={`mail${mobile ? ' mail--mobile' : ''}`}>
      {!mobile && (
        <header className="toolbar" data-drag>
          <p className="toolbar__title">{t('menu.newMail')}</p>
          <span className="toolbar__spacer" />
          <a className="tool-btn mail__send" href={mailto}>
            <svg viewBox="0 0 16 16"><path d="M2 8l12-5.5L9.5 14 7.5 9Z" /><path d="M7.5 9L14 2.5" /></svg>
            {t('contact.send')}
          </a>
        </header>
      )}

      <form
        className="mail__compose"
        onSubmit={(e) => {
          e.preventDefault()
          window.location.href = mailto
        }}
      >
        <div className="mail__field">
          <span className="mail__label">{t('contact.to')}</span>
          <span className="mail__to">
            <span className="mail__pill">{profile.name}</span>
            <span className="mail__addr">{c.email}</span>
          </span>
          <button type="button" className="tool-btn" onClick={copy}>
            {t('contact.copy')}
          </button>
        </div>
        <label className="mail__field">
          <span className="mail__label">{t('contact.subject')}</span>
          <input value={subj} onChange={(e) => setSubject(e.target.value)} />
        </label>
        <label className="mail__body">
          <span className="sr-only">{lang === 'pt' ? 'Mensagem' : 'Message'}</span>
          <textarea value={text} onChange={(e) => setBody(e.target.value)} rows={5} />
        </label>
        {mobile && (
          <button type="submit" className="btn btn--primary mail__submit">
            {t('contact.send')}
          </button>
        )}
      </form>

      <section className="mail__channels" aria-label={t('contact.elsewhere')}>
        <p className="mail__channels-label">{t('contact.elsewhere')}</p>
        <ul>
          {channels.map((ch) => (
            <li key={ch.label}>
              <a href={ch.href} target={ch.external ? '_blank' : undefined} rel={ch.external ? 'noopener noreferrer' : undefined}>
                <AppIcon name={ch.icon} size={32} />
                <span>
                  <strong>{ch.label}</strong>
                  <small>{ch.detail}</small>
                </span>
              </a>
            </li>
          ))}
          <li>
            <a href={vcardHref()} download="eric-mac.vcf">
              <AppIcon name="about" size={32} />
              <span>
                <strong>{t('contact.vcard')}</strong>
                <small>{profile.fullName}</small>
              </span>
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}

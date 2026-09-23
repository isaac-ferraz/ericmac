import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { useSettings, type ThemePref } from './settings'
import { useT } from '../i18n'

export function ControlCenter({ onClose }: { onClose: () => void }) {
  const t = useT()
  const ref = useRef<HTMLDivElement>(null)
  const { theme, lang, followAccent, setTheme, setLang, setFollowAccent } = useSettings()

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('button')?.focus()
    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement
      if (!ref.current?.contains(target) && !target.closest('[data-cc-toggle]')) onClose()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const themes: { v: ThemePref; label: string }[] = [
    { v: 'light', label: t('cc.light') },
    { v: 'dark', label: t('cc.dark') },
    { v: 'auto', label: t('cc.auto') },
  ]

  return (
    <motion.div
      ref={ref}
      className="cc"
      role="dialog"
      aria-label={t('cc.title')}
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 34 }}
    >
      <section className="cc__tile">
        <h2 className="cc__label">{t('cc.appearance')}</h2>
        <div className="cc__seg" role="radiogroup" aria-label={t('cc.appearance')}>
          {themes.map((o) => (
            <button key={o.v} type="button" role="radio" aria-checked={theme === o.v} onClick={() => setTheme(o.v)}>
              {o.label}
            </button>
          ))}
        </div>
      </section>
      <section className="cc__tile">
        <h2 className="cc__label">{t('cc.language')}</h2>
        <div className="cc__seg" role="radiogroup" aria-label={t('cc.language')}>
          <button type="button" role="radio" aria-checked={lang === 'pt'} onClick={() => setLang('pt')} lang="pt-BR">
            Português
          </button>
          <button type="button" role="radio" aria-checked={lang === 'en'} onClick={() => setLang('en')} lang="en">
            English
          </button>
        </div>
      </section>
      <section className="cc__tile">
        <h2 className="cc__label">{t('cc.wallpaper')}</h2>
        <label className="cc__switch">
          <span>{t('cc.follow')}</span>
          <input type="checkbox" role="switch" checked={followAccent} onChange={(e) => setFollowAccent(e.target.checked)} />
        </label>
        <p className="cc__hint">{t('cc.followHint')}</p>
      </section>
    </motion.div>
  )
}

import { Fragment, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, animate } from 'motion/react'
import { projects, projectBySlug, type Project, type ProjectImage } from '../data/projects'
import { useT, useLang, formatDate } from '../i18n'
import { useShell } from '../os/Window'
import { useWindows } from '../os/windows'
import { useUI, copyText } from '../os/ui'
import { useReducedMotion } from '../os/settings'
import { Pic } from '../lib/Pic'
import { picture } from '../lib/images'
import './CaseViewer.css'

export function CaseViewer({ slug }: { slug: Project['slug'] }) {
  const t = useT()
  const lang = useLang()
  const { id, mobile } = useShell()
  const p = projectBySlug[slug]
  const idx = projects.indexOf(p)
  const next = projects[(idx + 1) % projects.length]
  const prev = projects[(idx - 1 + projects.length) % projects.length]
  const scroller = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const viewable: ProjectImage[] = [p.cover, p.before, p.after, ...p.gallery]

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
    setLightbox(null)
  }, [slug])

  const go = (s: Project['slug']) => useWindows.getState().retarget(id, s)

  const facts = [
    { label: t('case.client'), value: p.sector[lang] },
    { label: t('case.year'), value: formatDate(p.published, lang, { month: 'long', year: 'numeric' }) },
    ...(p.tools.length ? [{ label: t('case.tools'), value: p.tools.join(' · ') }] : []),
    { label: t('case.fields'), value: p.fields.map((f) => f[lang]).join(' · ') },
  ]

  return (
    <article
      className={`case${mobile ? ' case--mobile' : ''}`}
      style={{ ['--case-accent' as string]: p.accent, ['--case-on' as string]: p.onAccent }}
      lang={lang === 'pt' ? 'pt-BR' : 'en'}
    >
      {!mobile && (
        <header className="toolbar case__toolbar" data-drag>
          <div className="case__nav">
            <button type="button" className="tool-btn" onClick={() => go(prev.slug)} aria-label={`${t('case.prev')}: ${prev.name}`}>
              <svg viewBox="0 0 16 16"><path d="M10 3.5L5.5 8l4.5 4.5" /></svg>
            </button>
            <button type="button" className="tool-btn" onClick={() => go(next.slug)} aria-label={`${t('case.next')}: ${next.name}`}>
              <svg viewBox="0 0 16 16"><path d="M6 3.5L10.5 8 6 12.5" /></svg>
            </button>
          </div>
          <div className="case__toolbar-title">
            <p className="toolbar__title">{p.name}</p>
            <p className="toolbar__sub">{p.tagline[lang]}</p>
          </div>
          <span className="toolbar__spacer" />
          <a className="tool-btn" href={p.behance} target="_blank" rel="noopener noreferrer">
            {t('case.behance')}
            <svg viewBox="0 0 16 16"><path d="M6 3.5h6.5V10M12.5 3.5L4 12" /></svg>
          </a>
        </header>
      )}

      <div className="case__scroll scroll" ref={scroller}>
        <button type="button" className="case__cover" onClick={() => setLightbox(0)} aria-label={`${t('case.zoom')}: ${p.cover.alt[lang]}`}>
          <Pic key={p.cover.key} k={p.cover.key} alt={p.cover.alt[lang]} sizes="(max-width: 900px) 100vw, 1080px" eager />
        </button>

        <header className="case__head">
          <h1 className="case__title">
            {p.name.toLowerCase()}
            <span className="case__dot" aria-hidden="true">.</span>
          </h1>
          <p className="case__tagline">{p.tagline[lang]}</p>
          <dl className="case__facts">
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        {p.sections.map((s, i) => (
          <Fragment key={i}>
            <section className="case__section">
              <h2 className="eyebrow case__h">{s.heading[lang]}</h2>
              <div className="case__text">
                {s.body.map((b, j) => (
                  <p key={j}>{b[lang]}</p>
                ))}
              </div>
            </section>
            {i === p.compareAfterSection && <Compare key={p.slug} project={p} />}
          </Fragment>
        ))}

        {p.palette && (
          <section className="case__section">
            <h2 className="eyebrow case__h">{t('case.colours')}</h2>
            <Palette colours={p.palette} />
          </section>
        )}

        <section className="case__gallery" aria-labelledby={`apps-${p.slug}`}>
          <h2 id={`apps-${p.slug}`} className="eyebrow case__h">
            {t('case.applications')}
          </h2>
          {p.gallery.map((img, i) => (
            <button key={img.key} type="button" className="case__shot" onClick={() => setLightbox(3 + i)} aria-label={`${t('case.zoom')}: ${img.alt[lang]}`}>
              <Pic k={img.key} alt={img.alt[lang]} sizes="(max-width: 900px) 100vw, 1000px" />
            </button>
          ))}
        </section>

        <footer className="case__foot">
          {mobile && (
            <a className="btn case__behance" href={p.behance} target="_blank" rel="noopener noreferrer">
              {t('case.behance')} ↗
            </a>
          )}
          <button type="button" className="case__next" onClick={() => go(next.slug)} style={{ ['--next-accent' as string]: next.accent }}>
            <span className="case__next-label">{t('case.next')}</span>
            <span className="case__next-name">
              {next.name.toLowerCase()}
              <span aria-hidden="true">.</span>
            </span>
            <span className="case__next-thumb">
              <Pic key={next.cover.key} k={next.cover.key} alt="" thumb sizes="320px" />
            </span>
          </button>
        </footer>
      </div>

      <Lightbox images={viewable} index={lightbox} onChange={setLightbox} />
    </article>
  )
}

/* ---------------------------------------------------------------- antes/depois */

function Compare({ project }: { project: Project }) {
  const t = useT()
  const lang = useLang()
  const reduced = useReducedMotion()
  const [pos, setPos] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  const hinted = useRef(false)

  // na primeira vez que aparece, a divisória balança para mostrar que se move
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hinted.current) return
        hinted.current = true
        animate(50, [30, 62, 50], { duration: 1.4, ease: 'easeInOut', onUpdate: setPos })
        io.disconnect()
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  const { before, after } = project
  const ratio = aspect(after.key)

  return (
    <figure className="compare" ref={ref}>
      <div className="compare__frame" style={{ ['--pos' as string]: `${pos}%`, aspectRatio: ratio }}>
        <Pic k={after.key} alt={after.alt[lang]} sizes="(max-width: 900px) 100vw, 900px" className="compare__img" />
        <div className="compare__before">
          <Pic k={before.key} alt={before.alt[lang]} sizes="(max-width: 900px) 100vw, 900px" className="compare__img" />
        </div>
        <span className="compare__tag compare__tag--before" aria-hidden="true">{t('case.before')}</span>
        <span className="compare__tag compare__tag--after" aria-hidden="true">{t('case.after')}</span>
        <span className="compare__handle" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5" /></svg>
        </span>
        <input
          className="compare__range"
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={t('case.compareLabel')}
          aria-valuetext={`${Math.round(pos)}% ${t('case.before')}`}
        />
      </div>
      <figcaption>{t('case.compare')}</figcaption>
    </figure>
  )
}

function aspect(key: string) {
  const { w, h } = picture(key).img
  return `${w} / ${h}`
}

/* ---------------------------------------------------------------- paleta */

function Palette({ colours }: { colours: { name: string; hex: string }[] }) {
  const t = useT()
  const toast = useUI((s) => s.toast)
  return (
    <ul className="palette">
      {colours.map((c) => (
        <li key={c.hex}>
          <button
            type="button"
            className="palette__chip"
            aria-label={t('case.copyHex', { hex: c.hex })}
            onClick={async () => {
              if (await copyText(c.hex)) toast(t('case.copied', { hex: c.hex }), c.name)
            }}
          >
            <span className="palette__swatch" style={{ background: c.hex }} />
            <span className="palette__name">{c.name}</span>
            <span className="palette__hex">{c.hex}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

/* ---------------------------------------------------------------- lightbox */

function Lightbox({ images, index, onChange }: { images: ProjectImage[]; index: number | null; onChange: (i: number | null) => void }) {
  const t = useT()
  const lang = useLang()
  const closeRef = useRef<HTMLButtonElement>(null)
  const opener = useRef<Element | null>(null)
  const open = index !== null

  useEffect(() => {
    if (!open) return
    opener.current = document.activeElement
    closeRef.current?.focus()
    return () => {
      ;(opener.current as HTMLElement | null)?.focus?.()
    }
  }, [open])

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null)
      else if (e.key === 'ArrowRight') onChange((index + 1) % images.length)
      else if (e.key === 'ArrowLeft') onChange((index - 1 + images.length) % images.length)
      else return
      e.preventDefault()
      e.stopPropagation()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [index, images.length, onChange])

  return createPortal(
    <AnimatePresence>
      {index !== null && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={images[index].alt[lang]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onChange(null)}
        >
          <motion.div
            key={images[index].key}
            className="lightbox__stage scroll"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <Pic k={images[index].key} alt={images[index].alt[lang]} sizes="100vw" eager />
            </div>
          </motion.div>
          <div className="lightbox__bar" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="lightbox__btn" onClick={() => onChange((index - 1 + images.length) % images.length)} aria-label={t('case.prevImage')}>
              ‹
            </button>
            <span className="lightbox__count">{t('case.imageOf', { i: index + 1, n: images.length })}</span>
            <button type="button" className="lightbox__btn" onClick={() => onChange((index + 1) % images.length)} aria-label={t('case.nextImage')}>
              ›
            </button>
            <button ref={closeRef} type="button" className="lightbox__btn lightbox__close" onClick={() => onChange(null)} aria-label={t('case.closeImage')}>
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

import { useEffect, useId, useRef, useState } from 'react'
import { peanutContours, PEANUT_W, PEANUT_H } from '../brand/shapes'
import { useFocusedAccent } from './windows'
import { useSettings, useResolvedTheme } from './settings'
import './Wallpaper.css'

// A forma do banner, repetida em linhas alternadas (uma virada), como no Behance.
const SCALE = 1.7
const TILE_W = Math.round(PEANUT_W * SCALE + 40)
const TILE_H = Math.round(PEANUT_H * SCALE + 18) * 2
const contours = peanutContours(13, 3)

/** raio da luz: 29% do lado menor da tela (260px numa tela de 900px de altura) */
const LAMP = 0.29

function Tile() {
  const row = Math.round(PEANUT_H * SCALE + 18)
  const group = contours.map((d, i) => (
    <path key={i} d={d} style={{ opacity: 1 - i * 0.055 }} vectorEffect="non-scaling-stroke" />
  ))
  return (
    <>
      <g transform={`translate(20 9) scale(${SCALE})`}>{group}</g>
      <g transform={`translate(${TILE_W / 2 + 20 + PEANUT_W * SCALE} ${row + 9}) scale(${-SCALE} ${SCALE})`}>
        {group}
      </g>
      <g transform={`translate(${-TILE_W / 2 + 20 + PEANUT_W * SCALE} ${row + 9}) scale(${-SCALE} ${SCALE})`}>
        {group}
      </g>
    </>
  )
}

function Layer({ className }: { className: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width={TILE_W} height={TILE_H} patternUnits="userSpaceOnUse">
          <Tile />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

/** Brilho de baixo + contornos numa cor. `undefined` usa a cor padrão do tema. */
function Scene({ line, className = '', onDone }: { line?: string; className?: string; onDone?: () => void }) {
  return (
    <div
      className={`wallpaper__scene ${className}`}
      style={{ ['--wall-line' as string]: line }}
      onAnimationEnd={onDone}
    >
      <div className="wallpaper__tint" />
      <Layer className="wallpaper__lines" />
    </div>
  )
}

type Look = { line?: string; key: string }

export function Wallpaper({ interactive = true }: { interactive?: boolean }) {
  const lamp = useRef<HTMLDivElement>(null)
  const lampInner = useRef<HTMLDivElement>(null)
  const theme = useResolvedTheme()
  const follow = useSettings((s) => s.followAccent)
  const accent = useFocusedAccent(theme)
  const line = follow && accent ? accent : undefined

  // A troca de cor é um cruzamento: a cena nova aparece por cima só com opacidade,
  // que o compositor faz sozinho, em vez de repintar a tela toda a cada quadro.
  const want: Look = { line, key: `${theme}|${line ?? ''}` }
  const [base, setBase] = useState<Look>(want)
  const [next, setNext] = useState<Look | null>(null)
  if (want.key !== (next ?? base).key) setNext(want.key === base.key ? null : want)

  // A luz segue o cursor e acende os contornos por baixo dele. Ela é uma
  // "lanterna" do tamanho da luz que só se desloca (transform), com os contornos
  // dentro deslocados ao contrário para continuarem alinhados com o fundo:
  // mover o mouse não repinta nada.
  useEffect(() => {
    if (!interactive) return
    const el = lamp.current
    const inner = lampInner.current
    if (!el || !inner) return
    let raf = 0
    let r = 0
    let x = window.innerWidth * 0.62
    let y = window.innerHeight * 0.42
    const apply = () => {
      raf = 0
      el.style.transform = `translate3d(${x - r}px, ${y - r}px, 0)`
      inner.style.transform = `translate3d(${r - x}px, ${r - y}px, 0)`
    }
    const measure = () => {
      r = Math.round(Math.min(window.innerWidth, window.innerHeight) * LAMP)
      el.style.setProperty('--lamp', `${r * 2}px`)
      apply()
    }
    measure()
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      el.classList.remove('is-gliding')
      x = e.clientX
      y = e.clientY
      if (!raf) raf = requestAnimationFrame(apply)
    }
    // no toque não há cursor: a luz desliza até onde o dedo encostou
    // (lanterna e contornos com a mesma transição, então seguem alinhados)
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return
      el.classList.add('is-gliding')
      x = e.clientX
      y = e.clientY
      if (!raf) raf = requestAnimationFrame(apply)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(raf)
    }
  }, [interactive])

  const current = next ?? base

  return (
    <div className="wallpaper">
      <Scene line={base.line} />
      {next && (
        <Scene
          key={next.key}
          line={next.line}
          className="wallpaper__scene--in"
          onDone={() => {
            setBase(next)
            setNext(null)
          }}
        />
      )}
      {interactive && (
        <div className="wallpaper__lit" ref={lamp} style={{ ['--wall-line' as string]: current.line }}>
          <div className="wallpaper__lit-inner" ref={lampInner}>
            <Layer className="wallpaper__lines wallpaper__lines--lit" />
          </div>
        </div>
      )}
      <div className="wallpaper__vignette" />
    </div>
  )
}

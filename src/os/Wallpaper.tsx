import { useEffect, useId, useRef } from 'react'
import { peanutContours, PEANUT_W, PEANUT_H } from '../brand/shapes'
import { useFocusedAccent } from './windows'
import { useSettings, useResolvedTheme } from './settings'
import './Wallpaper.css'

// A forma do banner, repetida em linhas alternadas (uma virada), como no Behance.
const SCALE = 1.7
const TILE_W = Math.round(PEANUT_W * SCALE + 40)
const TILE_H = Math.round(PEANUT_H * SCALE + 18) * 2
const contours = peanutContours(13, 3)

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

export function Wallpaper({ interactive = true }: { interactive?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const theme = useResolvedTheme()
  const follow = useSettings((s) => s.followAccent)
  const accent = useFocusedAccent(theme)
  // a cor é trocada só aqui (e não no :root), para a transição não restilizar a página toda
  const line = follow && accent ? accent : undefined

  // A luz segue o cursor e acende os contornos por baixo dele.
  useEffect(() => {
    if (!interactive) return
    const el = ref.current
    if (!el) return
    let raf = 0
    let x = window.innerWidth * 0.62
    let y = window.innerHeight * 0.42
    const apply = () => {
      raf = 0
      el.style.setProperty('--mx', `${x}px`)
      el.style.setProperty('--my', `${y}px`)
    }
    apply()
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      x = e.clientX
      y = e.clientY
      if (!raf) raf = requestAnimationFrame(apply)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [interactive])

  return (
    <div
      ref={ref}
      className="wallpaper"
      style={{ ['--wall-line' as string]: line }}
    >
      <Layer className="wallpaper__lines" />
      {interactive && (
        <div className="wallpaper__lit">
          <Layer className="wallpaper__lines wallpaper__lines--lit" />
        </div>
      )}
      <div className="wallpaper__vignette" />
    </div>
  )
}

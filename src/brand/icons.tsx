import { useId, type ReactNode } from 'react'
import { SQUIRCLE, peanutContours } from './shapes'
import { picture } from '../lib/images'

export type IconName =
  | 'projects'
  | 'about'
  | 'contact'
  | 'messages'
  | 'notes'
  | 'trash'
  | 'behance'
  | 'linkedin'
  | 'instagram'
  | 'whatsapp'
  | 'phone'

const markContours = peanutContours(3, 12)

// Ícones que o Eric escolheu (src/brand/app-icons), reduzidos a WebP de 256 px.
const pngs = import.meta.glob<string>('./app-icons/*.png', {
  query: '?w=256&format=webp',
  import: 'default',
  eager: true,
})
const pngIcon: Partial<Record<IconName, string>> = {}
const pngFile: Partial<Record<IconName, string>> = {
  projects: 'finder',
  about: 'contacts',
  contact: 'email',
  messages: 'messages',
  notes: 'notes',
  trash: 'trash',
  behance: 'behance',
  linkedin: 'linkedin',
  instagram: 'instagram',
  whatsapp: 'whatsapp',
}
for (const [name, file] of Object.entries(pngFile)) pngIcon[name as IconName] = pngs[`./app-icons/${file}.png`]

/** Tamanho de desenho (em px de referência, 16 = 1rem) como rem, para acompanhar a
 *  base de tamanho da tela. É atributo, então qualquer regra de CSS ainda manda. */
const rem = (px: number) => `${+(px / 16).toFixed(4)}rem`

/** Símbolo do Eric: a forma do banner em quatro contornos. Faz o papel da maçã. */
export function Mark({ size = 16, title }: { size?: number; title?: string }) {
  return (
    <svg
      width={rem(size * 2)}
      height={rem(size)}
      viewBox="-4 -4 208 108"
      fill="none"
      stroke="currentColor"
      strokeWidth={8}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {markContours.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )
}

/** Os PNGs vêm quadrados e com luz própria: só recebem o recorte do squircle e a borda fina. */
function ImageSquircle({ src }: { src: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <>
      <defs>
        <clipPath id={`${id}c`}>
          <path d={SQUIRCLE} />
        </clipPath>
      </defs>
      <image href={src} width="100" height="100" clipPath={`url(#${id}c)`} preserveAspectRatio="xMidYMid slice" />
      <path d={SQUIRCLE} fill="none" stroke="rgba(0,0,0,.18)" strokeWidth=".8" />
    </>
  )
}

/** Moldura comum: squircle, degradê de fundo, brilho de cima e borda fina. */
function Squircle({ from, to, children, border = 'rgba(0,0,0,.18)' }: { from: string; to: string; children: ReactNode; border?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".32" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}c`}>
          <path d={SQUIRCLE} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}c)`}>
        <rect width="100" height="100" fill={`url(#${id}g)`} />
        {children}
        <rect width="100" height="100" fill={`url(#${id}s)`} />
      </g>
      <path d={SQUIRCLE} fill="none" stroke={border} strokeWidth=".8" />
    </>
  )
}

function Art({ name }: { name: IconName }) {
  const src = pngIcon[name]
  if (src) return <ImageSquircle src={src} />
  return (
    <Squircle from="#72f07f" to="#12b134">
      <path d="M37.5 24c2 0 3.6 1.3 4.2 3.2l3 9.6c.5 1.7 0 3.5-1.3 4.7l-4.6 4.2c2.8 6 7.6 10.8 13.6 13.6l4.2-4.6c1.2-1.3 3-1.8 4.7-1.3l9.6 3c1.9.6 3.2 2.3 3.2 4.3V70c0 3.4-2.9 6.2-6.3 6-24.8-1.5-44.6-21.3-46.1-46.1-.2-3.4 2.6-6.3 6-6.3Z" fill="#fff" />
    </Squircle>
  )
}

export function AppIcon({ name, size = 56 }: { name: IconName; size?: number }) {
  return (
    <svg className="app-icon" width={rem(size)} height={rem(size)} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <Art name={name} />
    </svg>
  )
}

/** Pasta do macOS tingida com a cor da marca; a capa do projeto aparece por trás da frente translúcida. */
export function FolderIcon({ accent, cover, size = 72 }: { accent: string; cover: string; size?: number }) {
  const id = useId().replace(/:/g, '')
  const src = picture(cover, 'thumb').img.src
  const front = 'M2 34a5 5 0 0 1 5-5h86a5 5 0 0 1 5 5v38a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5Z'
  return (
    <svg className="folder-icon" width={rem(size)} height={rem(size * 0.82)} viewBox="0 0 100 82" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".45" />
          <stop offset=".6" stopColor="#fff" stopOpacity=".08" />
          <stop offset="1" stopColor="#000" stopOpacity=".08" />
        </linearGradient>
        <clipPath id={`${id}c`}>
          <rect x="11" y="3" width="78" height="60" rx="3.5" />
        </clipPath>
      </defs>
      <path d="M4 12a5 5 0 0 1 5-5h22l6 6h54a5 5 0 0 1 5 5v56a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z" fill={accent} />
      <path d="M4 12a5 5 0 0 1 5-5h22l6 6h54a5 5 0 0 1 5 5v56a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z" fill="#000" opacity=".22" />
      <g transform="rotate(-3 50 33)">
        <rect x="10" y="2" width="80" height="62" rx="4" fill="#fff" />
        <g clipPath={`url(#${id}c)`}>
          <image href={src} x="11" y="3" width="78" height="60" preserveAspectRatio="xMidYMid slice" />
        </g>
      </g>
      <path d={front} fill={accent} opacity=".86" />
      <path d={front} fill={`url(#${id}f)`} />
      <path d="M7 29.6h86" stroke="#fff" strokeOpacity=".55" strokeWidth=".8" />
    </svg>
  )
}

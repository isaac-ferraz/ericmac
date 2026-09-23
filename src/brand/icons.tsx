import { useId, type ReactNode } from 'react'
import { SQUIRCLE, peanutContours } from './shapes'
import { picture } from '../lib/images'
import avatarUrl from '../../conteudo/behance/imagens/avatar.jpg?format=webp'

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
  | 'phone'

const markContours = peanutContours(3, 12)

/** Símbolo do Eric: a forma do banner em quatro contornos. Faz o papel da maçã. */
export function Mark({ size = 16, title }: { size?: number; title?: string }) {
  return (
    <svg
      width={size * 2}
      height={size}
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
  switch (name) {
    case 'projects':
      return (
        <Squircle from="#9a63ff" to="#4f09bc">
          {/* pasta: fundo com aba + frente */}
          <path d="M20 30a5 5 0 0 1 5-5h16l6 6h28a5 5 0 0 1 5 5v36a5 5 0 0 1-5 5H25a5 5 0 0 1-5-5Z" fill="#e9dcff" />
          <path d="M18 41a5 5 0 0 1 5-5h54a5 5 0 0 1 5 5v33a5 5 0 0 1-5 5H23a5 5 0 0 1-5-5Z" fill="#fff" />
          <g transform="translate(34 48) scale(.16)" fill="none" stroke="#7a3cff" strokeWidth="7">
            {markContours.slice(0, 3).map((d, i) => (
              <path key={i} d={d} opacity={1 - i * 0.25} />
            ))}
          </g>
        </Squircle>
      )
    case 'about':
      return (
        <Squircle from="#2b2a30" to="#141417">
          <image href={avatarUrl} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
        </Squircle>
      )
    case 'contact':
      return (
        <Squircle from="#2e2c35" to="#121114" border="rgba(255,255,255,.14)">
          <rect x="16" y="28" width="68" height="46" rx="7" fill="#f5f3fb" />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${20 + i * 5} ${31 + i * 2}L50 ${53 - i * 5}L${80 - i * 5} ${31 + i * 2}`}
              fill="none"
              stroke="#7a3cff"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={1 - i * 0.28}
            />
          ))}
        </Squircle>
      )
    case 'messages':
      return (
        <Squircle from="#72f07f" to="#12b134">
          <path d="M50 24c-19.3 0-35 12.3-35 27.5 0 8.6 5 16.2 12.8 21.3-.6 4.2-2.8 8-6.1 10.8 6.3-.2 11.9-2.5 16-6.3 3.9 1 8.1 1.7 12.3 1.7 19.3 0 35-12.3 35-27.5S69.3 24 50 24Z" fill="#fff" />
        </Squircle>
      )
    case 'notes':
      return (
        <Squircle from="#ffffff" to="#f0efe9">
          <rect width="100" height="30" fill="#ffd33d" />
          <rect y="28" width="100" height="3" fill="#e6b92a" />
          {[44, 56, 68, 80].map((y) => (
            <rect key={y} x="14" y={y} width="72" height="1.6" fill="#d7d4cc" />
          ))}
          <path d="M16 40c8-5 14 4 22 0s12-4 18 0" fill="none" stroke="#6a22e0" strokeWidth="2.4" strokeLinecap="round" />
        </Squircle>
      )
    case 'trash':
      return (
        <g>
          <path d="M22 26h56l-5 60a6 6 0 0 1-6 5.5H33a6 6 0 0 1-6-5.5Z" fill="rgba(235,235,242,.72)" stroke="rgba(120,120,135,.7)" strokeWidth="1.4" />
          <rect x="18" y="19" width="64" height="9" rx="4" fill="rgba(245,245,250,.9)" stroke="rgba(120,120,135,.7)" strokeWidth="1.4" />
          {[36, 50, 64].map((x) => (
            <path key={x} d={`M${x} 34l${(x - 50) * 0.08} 48`} stroke="rgba(120,120,135,.55)" strokeWidth="2.2" strokeLinecap="round" />
          ))}
        </g>
      )
    case 'behance':
      return (
        <Squircle from="#2a6bff" to="#0040e0">
          {/* "Be" + traço desenhado: o caractere "ē" puxaria o subconjunto latin-ext da fonte (83 KB) */}
          <text x="50" y="66" textAnchor="middle" fontFamily="Inter Variable, Inter, sans-serif" fontWeight="800" fontSize="40" fill="#fff" letterSpacing="-2">
            Be
          </text>
          <rect x="53" y="30" width="15" height="4.6" rx="1.2" fill="#fff" />
        </Squircle>
      )
    case 'linkedin':
      return (
        <Squircle from="#1a7bd6" to="#0a57a8">
          <text x="50" y="68" textAnchor="middle" fontFamily="Inter Variable, Inter, sans-serif" fontWeight="800" fontSize="48" fill="#fff" letterSpacing="-2">
            in
          </text>
        </Squircle>
      )
    case 'instagram':
      return (
        <Squircle from="#f9ce34" to="#8134af">
          <rect x="24" y="24" width="52" height="52" rx="15" fill="none" stroke="#fff" strokeWidth="6" />
          <circle cx="50" cy="50" r="12" fill="none" stroke="#fff" strokeWidth="6" />
          <circle cx="66" cy="34" r="3.6" fill="#fff" />
        </Squircle>
      )
    case 'phone':
      return (
        <Squircle from="#72f07f" to="#12b134">
          <path d="M37.5 24c2 0 3.6 1.3 4.2 3.2l3 9.6c.5 1.7 0 3.5-1.3 4.7l-4.6 4.2c2.8 6 7.6 10.8 13.6 13.6l4.2-4.6c1.2-1.3 3-1.8 4.7-1.3l9.6 3c1.9.6 3.2 2.3 3.2 4.3V70c0 3.4-2.9 6.2-6.3 6-24.8-1.5-44.6-21.3-46.1-46.1-.2-3.4 2.6-6.3 6-6.3Z" fill="#fff" />
        </Squircle>
      )
  }
}

export function AppIcon({ name, size = 56 }: { name: IconName; size?: number }) {
  return (
    <svg className="app-icon" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
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
    <svg className="folder-icon" width={size} height={size * 0.82} viewBox="0 0 100 82" aria-hidden="true" focusable="false">
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

import { useState } from 'react'
import { picture } from './images'

type Props = {
  k: string
  alt: string
  sizes?: string
  className?: string
  eager?: boolean
  thumb?: boolean
  draggable?: boolean
}

/** <picture> com AVIF e WebP; aparece com um fade quando termina de carregar. */
export function Pic({ k, alt, sizes = '100vw', className, eager, thumb, draggable = false }: Props) {
  const p = picture(k, thumb ? 'thumb' : 'full')
  const [loaded, setLoaded] = useState(false)
  return (
    <picture className={`pic${loaded ? ' is-loaded' : ''}${className ? ` ${className}` : ''}`}>
      {p.sources.avif && <source type="image/avif" srcSet={p.sources.avif} sizes={sizes} />}
      {p.sources.webp && <source type="image/webp" srcSet={p.sources.webp} sizes={sizes} />}
      <img
        src={p.img.src}
        width={p.img.w}
        height={p.img.h}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={draggable}
        onLoad={() => setLoaded(true)}
        ref={(img) => {
          if (img?.complete && img.naturalWidth) setLoaded(true)
        }}
      />
    </picture>
  )
}

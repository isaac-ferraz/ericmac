// As imagens dos projetos vêm dos snapshots do Behance (conteudo/behance) e do
// post do LinkedIn (conteudo/linkedin). O vite-imagetools gera AVIF e WebP em
// três larguras a partir dos originais, sem ampliar os que já são menores que a
// maior largura.

export type Picture = {
  sources: Record<string, string>
  img: { src: string; w: number; h: number }
}

const originals = import.meta.glob<Picture>(
  ['../../conteudo/behance/{imagens,derivados}/*.png', '../../conteudo/linkedin/imagens/*.jpg'],
  {
    query: '?w=480;960;1350&format=avif;webp&withoutEnlargement&as=picture',
    import: 'default',
    eager: true,
  },
)

const thumbs = import.meta.glob<Picture>(
  ['../../conteudo/behance/{imagens,derivados}/*.png', '../../conteudo/linkedin/imagens/*.jpg'],
  {
    query: '?w=160;320&format=avif;webp&withoutEnlargement&as=picture',
    import: 'default',
    eager: true,
  },
)

function byName(map: Record<string, Picture>) {
  const out: Record<string, Picture> = {}
  for (const [path, pic] of Object.entries(map)) {
    const name = path.split('/').pop()!.replace(/\.(png|jpg)$/, '')
    out[name] = pic
  }
  return out
}

const full = byName(originals)
const small = byName(thumbs)

export type ImageKey = string

export function picture(key: ImageKey, size: 'full' | 'thumb' = 'full'): Picture {
  const pic = (size === 'thumb' ? small : full)[key]
  if (!pic) throw new Error(`Imagem não encontrada: ${key}`)
  return pic
}

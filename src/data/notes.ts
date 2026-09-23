// Notas do app Notas. "como eu trabalho" resume o método que se repete nos três
// cases do Behance (diagnóstico → atributos → conceito → sistema → antes/depois).
// É uma leitura dos cases, não um texto do Eric — está marcada para ele revisar.
// "sobre este mac" explica o próprio portfólio.

import type { L } from '../i18n'

export type Note = {
  id: string
  title: L
  date: string
  draft?: boolean
  steps?: { title: L; body: L }[]
  paragraphs?: L[]
}

export const notes: Note[] = [
  {
    id: 'metodo',
    title: { pt: 'como eu trabalho.', en: 'how I work.' },
    date: '2026-09-22',
    draft: true, // TODO(Eric): revisar
    steps: [
      {
        title: { pt: 'diagnóstico.', en: 'diagnosis.' },
        body: {
          pt: 'Antes de desenhar, entendo o que a identidade atual não consegue dizer. Na Kozok era um símbolo literal demais; no Raízes, cores e tipografia que não marcavam posição no mercado.',
          en: 'Before drawing anything, I figure out what the current identity can’t say. At Kozok it was an overly literal symbol; at Raízes, colours and type that didn’t claim a place in the market.',
        },
      },
      {
        title: { pt: 'atributos.', en: 'attributes.' },
        body: {
          pt: 'Escolho poucas palavras que a marca precisa carregar e toda decisão responde a elas. Na Tecinsoles foram confiança, modernidade e tecnologia.',
          en: 'I pick a few words the brand has to carry, and every decision answers to them. For Tecinsoles they were trust, modernity and technology.',
        },
      },
      {
        title: { pt: 'conceito.', en: 'concept.' },
        body: {
          pt: 'Troco a representação literal por uma ideia que dura: rota e fluxo na Kozok, o pé que vira traço na Tecinsoles.',
          en: 'I swap the literal depiction for an idea that lasts: route and flow at Kozok, the foot that becomes a line at Tecinsoles.',
        },
      },
      {
        title: { pt: 'sistema.', en: 'system.' },
        body: {
          pt: 'Cor, tipografia e grafismos que funcionam do digital ao físico: caixa, fita, embalagem, app.',
          en: 'Colour, type and graphics that work from digital to physical: box, tape, packaging, app.',
        },
      },
      {
        title: { pt: 'antes e depois.', en: 'before and after.' },
        body: {
          pt: 'Mostro sempre de onde a marca saiu. É o jeito mais honesto de medir um redesign.',
          en: 'I always show where the brand came from. It’s the most honest way to measure a redesign.',
        },
      },
    ],
  },
  {
    id: 'este-mac',
    title: { pt: 'sobre este mac.', en: 'about this mac.' },
    date: '2026-09-22',
    paragraphs: [
      {
        pt: 'Este Mac é o portfólio do Eric. As linhas do papel de parede vêm do banner dele no Behance: uma cápsula e um círculo desenhados em contornos.',
        en: 'This Mac is Eric’s portfolio. The wallpaper lines come from his Behance banner: a capsule and a circle drawn in contours.',
      },
      {
        pt: 'Cada marca tem a sua cor. Quando um projeto está em foco, o fundo inteiro assume a cor dele: azul Kozok, verde Tecinsoles, verde-petróleo Raízes.',
        en: 'Every brand has its colour. When a project is in focus, the whole background takes it on: Kozok blue, Tecinsoles green, Raízes teal.',
      },
      {
        pt: 'Atalhos: Ctrl K (ou ⌘K) abre a busca. Espaço pré-visualiza um projeto na janela Projetos. Setas passam as imagens ampliadas.',
        en: 'Shortcuts: Ctrl K (or ⌘K) opens search. Space previews a project in the Projects window. Arrow keys flip through enlarged images.',
      },
    ],
  },
]

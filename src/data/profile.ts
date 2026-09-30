// Tudo o que é dado pessoal do Eric fica aqui, num lugar só.
// Fonte: Behance (conteudo/behance/projetos.md), post do TCC no LinkedIn
// (conteudo/linkedin/projeto.md) + contatos passados pelo Isaac.

import type { L } from '../i18n'

export const profile = {
  name: 'Eric Macintyre',
  fullName: 'Eric Macintyre',
  role: { pt: 'UI/UX Designer', en: 'UI/UX Designer' } satisfies L,
  city: { pt: 'São Paulo, Brasil', en: 'São Paulo, Brazil' } satisfies L,
  education: { pt: 'Design Gráfico · Belas Artes SP, 2025', en: 'Graphic Design · Belas Artes SP, 2025' } satisfies L,
  behanceSince: 2020,
  availability: {
    pt: ['freelance', 'tempo integral', 'remoto', 'relocação'],
    en: ['freelance', 'full-time', 'remote', 'relocation'],
  },
  tools: ['Photoshop', 'Illustrator'],
  disciplines: {
    pt: ['identidade visual', 'rebranding', 'embalagem', 'logotipo', 'ícones', 'ilustração'],
    en: ['visual identity', 'rebranding', 'packaging', 'logotype', 'icons', 'illustration'],
  },

  contact: {
    email: 'oericmac@gmail.com',
    phoneDisplay: '+55 12 99748-9200',
    phoneHref: 'tel:+5512997489200',
    whatsapp: 'https://wa.me/5512997489200',
    linkedin: 'https://www.linkedin.com/in/eric-macintyre-61863b259/',
    behance: 'https://www.behance.net/ericmacintyre1',
    instagram: 'https://www.instagram.com/oericmac/',
    instagramHandle: '@oericmac',
  },
} as const

// Comentários deixados nos projetos do Behance (Tecinsoles, 27/02/2025).
export const testimonials = [
  {
    author: 'André Barbosa',
    date: '2025-02-27',
    project: 'tecinsoles',
    text: 'Projeto ótimo e com conceito impecável!',
    translation: 'Great project, with a flawless concept!',
  },
  {
    author: 'ADD Branding',
    date: '2025-02-27',
    project: 'tecinsoles',
    text: 'Lindo projeto',
    translation: 'Beautiful project',
  },
] as const

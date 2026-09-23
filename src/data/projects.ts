// Os três projetos publicados no Behance, na ordem em que o Behance os mostra
// (mais recente primeiro). Textos de Kozok e Raízes são os originais do Eric;
// as versões em inglês são tradução. O Tecinsoles não tem texto no Behance —
// o texto abaixo foi escrito a partir das peças e está marcado como `draft`
// para o Eric revisar.

import type { L } from '../i18n'

export type ProjectImage = { key: string; alt: L }

export type Section = { heading: L; body: L[] }

export type Project = {
  slug: 'kozok' | 'tecinsoles' | 'raizes'
  name: string
  tagline: L
  sector: L
  published: string // ISO
  /** cor principal da marca, como aparece nas peças */
  accent: string
  /** versão da cor que funciona como luz sobre o grafite do desktop */
  glow: string
  /** cor do texto sobre `accent` */
  onAccent: string
  tools: string[]
  fields: L[]
  behance: string
  cover: ProjectImage
  before: ProjectImage
  after: ProjectImage
  /** onde o comparador antes/depois entra no texto (índice da seção) */
  compareAfterSection: number
  sections: Section[]
  gallery: ProjectImage[]
  palette?: { name: string; hex: string }[]
  draft?: boolean
}

export const projects: Project[] = [
  {
    slug: 'kozok',
    name: 'Kozok',
    tagline: { pt: 'rebranding', en: 'rebrand' },
    sector: { pt: 'distribuidora', en: 'distribution' },
    published: '2026-01-28',
    accent: '#0046BF',
    glow: '#3F7BFF',
    onAccent: '#FFFFFF',
    tools: ['Photoshop', 'Illustrator'],
    fields: [
      { pt: 'Design gráfico', en: 'Graphic design' },
      { pt: 'Design de ícones', en: 'Icon design' },
      { pt: 'Design de logotipo', en: 'Logo design' },
    ],
    behance: 'https://www.behance.net/gallery/243082507/KOZOK',
    cover: {
      key: 'kozok-1',
      alt: {
        pt: 'Capa do rebranding Kozok: ecobag azul com o novo ícone, pendurada numa grade metálica.',
        en: 'Kozok rebrand cover: a blue tote bag with the new icon, hanging on a metal mesh.',
      },
    },
    before: {
      key: 'kozok-antes',
      alt: {
        pt: 'Antes: marca Óculos Fácil, um carrinho de compras dentro de um celular amarelo.',
        en: 'Before: the Óculos Fácil mark, a shopping cart inside a yellow phone.',
      },
    },
    after: {
      key: 'kozok-depois',
      alt: {
        pt: 'Depois: logotipo Kozok em branco sobre azul, com grafismos pretos de trajeto.',
        en: 'After: the white Kozok logotype on blue, with black route-like shapes.',
      },
    },
    compareAfterSection: 1,
    sections: [
      {
        heading: { pt: 'o ponto de partida.', en: 'the starting point.' },
        body: [
          {
            pt: 'A Kozok passou por um processo completo de rebranding com o objetivo de corrigir limitações da identidade anterior e alinhar a marca a um posicionamento mais claro, profissional e tecnológico.',
            en: 'Kozok went through a complete rebrand to fix the limits of its previous identity and align the brand with a clearer, more professional and more technological positioning.',
          },
        ],
      },
      {
        heading: { pt: 'antes.', en: 'before.' },
        body: [
          {
            pt: 'A identidade antiga utilizava um símbolo literal, baseado em um ícone de carrinho de compras dentro de um smartphone. Embora funcional em um primeiro momento, esse visual apresentava limitações evidentes. Comunicação excessivamente óbvia, baixa diferenciação no mercado e pouca flexibilidade para aplicações institucionais e de escala. A marca ficava restrita a uma leitura simplista de e-commerce, sem refletir a complexidade logística, estratégica e operacional do negócio.',
            en: 'The old identity used a literal symbol: a shopping cart inside a smartphone. It worked at first, but its limits were obvious. Overly literal communication, little differentiation in the market and almost no flexibility for institutional or large-scale use. The brand was stuck in a simplistic e-commerce reading that didn’t reflect the logistical, strategic and operational complexity of the business.',
          },
        ],
      },
      {
        heading: { pt: 'o conceito.', en: 'the concept.' },
        body: [
          {
            pt: 'O novo sistema visual da Kozok foi desenvolvido para resolver esses pontos. O logotipo e o ícone abandonam a representação literal e passam a trabalhar conceitos mais abstratos e duradouros, como movimento, direção, transporte, fluxo e visão estratégica. As formas sugerem caminhos, rotas e deslocamento, reforçando a ideia de logística eficiente e clareza nos processos.',
            en: 'Kozok’s new visual system was built to solve exactly that. The logotype and icon drop the literal depiction and work with more abstract, lasting ideas: movement, direction, transport, flow and strategic vision. The shapes suggest paths, routes and displacement, reinforcing efficient logistics and clear processes.',
          },
        ],
      },
      {
        heading: { pt: 'o sistema.', en: 'the system.' },
        body: [
          {
            pt: 'A escolha das cores, tipografia e grafismos segue uma lógica tecnológica e contemporânea, priorizando legibilidade, impacto visual e reconhecimento rápido. A identidade foi pensada para funcionar de forma consistente em ambientes digitais, físicos e institucionais, garantindo versatilidade e solidez de marca.',
            en: 'Colour, typography and graphic elements follow a technological, contemporary logic that puts legibility, visual impact and quick recognition first. The identity was designed to hold up across digital, physical and institutional touchpoints, giving the brand versatility and solidity.',
          },
        ],
      },
    ],
    gallery: [
      {
        key: 'kozok-3',
        alt: {
          pt: 'Caixas de papelão empilhadas com o logotipo Kozok impresso.',
          en: 'Stacked cardboard boxes printed with the Kozok logotype.',
        },
      },
      {
        key: 'kozok-4',
        alt: {
          pt: 'Outdoor com a frase "Sua distribuidora favorita, de cara nova", seguido de papelaria, cartões, celular e caderno com a identidade Kozok.',
          en: 'A billboard reading "Your favourite distributor, with a new look", followed by Kozok stationery, business cards, a phone and a notebook.',
        },
      },
      {
        key: 'kozok-5',
        alt: {
          pt: 'Fitas adesivas azuis e brancas com a palavra "cheguei" e o logotipo, e a página "cores & efeitos" com retícula de pontos azul.',
          en: 'Blue and white packing tape printed with "cheguei" (I’m here) and the logo, and the "colours & effects" page with a blue halftone.',
        },
      },
    ],
    palette: [
      { name: 'Blue', hex: '#0046BF' },
      { name: 'Navy', hex: '#102133' },
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
    ],
  },

  {
    slug: 'tecinsoles',
    name: 'Tecinsoles',
    tagline: { pt: 'redesign', en: 'redesign' },
    sector: { pt: 'palmilhas', en: 'insoles' },
    published: '2025-02-27',
    accent: '#26FF00',
    glow: '#3DFF1F',
    onAccent: '#000000',
    tools: [], // o Behance só registra "Behance Mobile", que é o app de upload, não ferramenta de design
    fields: [
      { pt: 'Design gráfico', en: 'Graphic design' },
      { pt: 'Marca', en: 'Branding' },
      { pt: 'Design de logotipo', en: 'Logo design' },
    ],
    behance: 'https://www.behance.net/gallery/220323505/TECINSOLES-redesign',
    cover: {
      key: 'tecinsoles-1',
      alt: {
        pt: 'Capa: atleta correndo em preto e branco, com o logotipo Tecinsoles empilhado e um traço verde saindo do pé.',
        en: 'Cover: a black-and-white runner with the stacked Tecinsoles logo and a green line coming off the foot.',
      },
    },
    before: {
      key: 'tecinsoles-antes',
      alt: {
        pt: 'Antes: engrenagem com ondas azuis ao lado da palavra Tecinsoles em azul e preto.',
        en: 'Before: a gear with blue waves next to the word Tecinsoles in blue and black.',
      },
    },
    after: {
      key: 'tecinsoles-depois',
      alt: {
        pt: 'Depois: logotipo Tecinsoles em branco sobre preto, com o L em verde no formato de um pé.',
        en: 'After: the white Tecinsoles logotype on black, with a green foot-shaped L.',
      },
    },
    compareAfterSection: 0,
    draft: true, // TODO(Eric): texto escrito a partir das peças; revisar.
    sections: [
      {
        heading: { pt: 'o ponto de partida.', en: 'the starting point.' },
        body: [
          {
            pt: 'A Tecinsoles é uma marca de palmilhas. A identidade anterior, uma engrenagem com ondas azuis ao lado de uma tipografia genérica, falava de indústria, não de quem calça o produto.',
            en: 'Tecinsoles is an insole brand. Its previous identity, a gear with blue waves next to generic lettering, spoke about industry, not about the people wearing the product.',
          },
        ],
      },
      {
        heading: { pt: 'atributos da marca.', en: 'brand attributes.' },
        body: [
          {
            pt: 'O redesign partiu de três atributos: confiança, modernidade e tecnologia. Eles orientaram cada decisão, da forma do logotipo à escolha da cor.',
            en: 'The redesign started from three attributes: trust, modernity and technology. They guided every decision, from the shape of the logotype to the choice of colour.',
          },
        ],
      },
      {
        heading: { pt: 'o conceito.', en: 'the concept.' },
        body: [
          {
            pt: 'No novo logotipo, o L vira a sola de um pé e se desdobra num traço contínuo que percorre as aplicações, do ícone do app à ecobag. O verde-limão sobre preto dá energia e contraste à marca.',
            en: 'In the new logotype, the L becomes the sole of a foot and unfolds into a continuous line that runs through every touchpoint, from the app icon to the tote bag. Lime green on black gives the brand energy and contrast.',
          },
        ],
      },
    ],
    gallery: [
      {
        key: 'tecinsoles-2',
        alt: {
          pt: 'Atributos da marca: confiança, modernidade e tecnologia, ligados por um contorno verde contínuo.',
          en: 'Brand attributes, trust, modernity and technology, linked by one continuous green outline.',
        },
      },
      {
        key: 'tecinsoles-3',
        alt: {
          pt: 'Palmilha com o logotipo empilhado e fotos de um pé percorrido pelo traço verde.',
          en: 'An insole with the stacked logo and photos of a foot traced by the green line.',
        },
      },
      {
        key: 'tecinsoles-4',
        alt: {
          pt: 'Variações do logotipo, ícone do app na tela de um iPhone e blocos de cor da marca.',
          en: 'Logotype variations, the app icon on an iPhone home screen and brand colour blocks.',
        },
      },
      {
        key: 'tecinsoles-5',
        alt: {
          pt: 'Cartão, ecobag verde e capinha de celular com o grafismo da marca.',
          en: 'A card, a green tote bag and a phone case carrying the brand graphic.',
        },
      },
    ],
    palette: [
      { name: 'Green', hex: '#26FF00' },
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
    ],
  },

  {
    slug: 'raizes',
    name: 'Raízes',
    tagline: { pt: 'sabor sem glúten', en: 'gluten-free flavour' },
    sector: { pt: 'alimentação sem glúten', en: 'gluten-free food' },
    published: '2024-09-20',
    accent: '#05A098',
    glow: '#12C9BE',
    onAccent: '#FFF9CA',
    tools: ['Photoshop', 'Illustrator'],
    fields: [
      { pt: 'Design gráfico', en: 'Graphic design' },
      { pt: 'Ilustração', en: 'Illustration' },
      { pt: 'Design de logotipo', en: 'Logo design' },
    ],
    behance: 'https://www.behance.net/gallery/208384195/Raizes-sabor-sem-gluten',
    cover: {
      key: 'raizes-1',
      alt: {
        pt: 'Capa: logotipo Raízes sobre verde, com um pote de alho e a frase "sabor sem glúten".',
        en: 'Cover: the Raízes logotype on green, with a jar of garlic and the line "gluten-free flavour".',
      },
    },
    before: {
      key: 'raizes-2',
      alt: {
        pt: 'Antes: "Raízes" em letra cursiva dourada sobre verde-escuro.',
        en: 'Before: "Raízes" in gold script lettering on dark green.',
      },
    },
    after: {
      key: 'raizes-3',
      alt: {
        pt: 'Depois: logotipo Raízes em caixa alta condensada, creme sobre verde, com "sabor sem glúten" em amarelo.',
        en: 'After: the condensed Raízes logotype in cream on green, with "gluten-free flavour" in yellow.',
      },
    },
    compareAfterSection: 0,
    sections: [
      {
        heading: { pt: 'a marca.', en: 'the brand.' },
        body: [
          {
            pt: 'Há alguns anos, o Raízes surgiu de uma ambição empreendedora e da necessidade de se reinventar em um mercado competitivo. Com o intuito de inovar e atender às necessidades de um público com restrições alimentares, Lailah, a fundadora da empresa, criou o conceito do RAÍZES, um sabor sem glúten.',
            en: 'A few years ago, Raízes was born from an entrepreneurial drive and the need to reinvent itself in a competitive market. Aiming to innovate and serve people with dietary restrictions, Lailah, the company’s founder, created the RAÍZES concept: gluten-free flavour.',
          },
          {
            pt: 'Lailah, como celíaca, estava frustrada com a escassez de produtos de qualidade para pessoas com intolerâncias alimentares e para aqueles que buscam uma alimentação mais saudável. Com essa visão em mente, a missão da empresa é fornecer produtos sem glúten e sem conservantes, com o objetivo de atender um público que busca uma vida mais saudável e precisa lidar com restrições alimentares, em um ambiente livre de glúten.',
            en: 'As a coeliac, Lailah was frustrated by how few quality products existed for people with food intolerances and for those looking to eat more healthily. With that in mind, the company’s mission is to offer gluten-free, preservative-free products to people who want a healthier life and need to manage dietary restrictions, in a gluten-free environment.',
          },
        ],
      },
      {
        heading: { pt: 'a nova identidade.', en: 'the new identity.' },
        body: [
          {
            pt: 'Com o intuito de consolidar sua posição no mercado de alimentos, o Raízes adotou uma nova Identidade Visual, a qual busca firmar a empresa em seu ramo, por meio de cores mais marcantes e tipografias adequadas para o mercado em que se encaixa. A nova identidade visual foi pensada para destacar a empresa em relação aos produtos de empresas concorrentes e trazer mais facilidade de assimilação da marca.',
            en: 'To consolidate its position in the food market, Raízes adopted a new visual identity that anchors the company in its field through bolder colours and typefaces suited to its segment. It was designed to set the company apart from competitors’ products and to make the brand easier to take in.',
          },
        ],
      },
      {
        heading: { pt: 'o próximo passo.', en: 'the next step.' },
        body: [
          {
            pt: 'Com essa visão de se tornar uma referência no mercado de alimentos, o RAÍZES busca ser conhecido por sua qualidade e sabores diferenciados, e a adoção de uma nova Identidade Visual é um passo importante nessa direção.',
            en: 'Aiming to become a reference in the food market, RAÍZES wants to be known for its quality and distinctive flavours, and a new visual identity is an important step in that direction.',
          },
        ],
      },
    ],
    gallery: [
      {
        key: 'raizes-4',
        alt: {
          pt: 'Variações do logotipo sobre verde e creme, e selo circular "sem glúten" sobre amarelo.',
          en: 'Logotype variations on green and cream, and a circular gluten-free seal on yellow.',
        },
      },
      {
        key: 'raizes-5',
        alt: {
          pt: 'Padrão de ícones de alimentos dentro de selos recortados, sobre amarelo com pontos vermelhos.',
          en: 'A pattern of food icons inside scalloped badges, on yellow with red dots.',
        },
      },
      {
        key: 'raizes-6',
        alt: {
          pt: 'Logotipo creme sobre papel verde amassado, com um saco de papel da marca.',
          en: 'The cream logotype on crumpled green paper, with a branded paper bag.',
        },
      },
      {
        key: 'raizes-7',
        alt: {
          pt: 'Embalagem de coxinhas com o selo Raízes e a amostra da cor Raízes Green.',
          en: 'Coxinha packaging with the Raízes seal, and the Raízes Green swatch.',
        },
      },
    ],
    palette: [
      { name: 'Raízes Green', hex: '#05A098' },
      { name: 'Raízes Cream', hex: '#FFF9CA' },
      { name: 'Raízes Deep Green', hex: '#006D6A' },
      { name: 'Raízes Yellow', hex: '#FFC200' },
      { name: 'Raízes Red', hex: '#FF1515' },
    ],
  },
]

export const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p])) as Record<
  Project['slug'],
  Project
>

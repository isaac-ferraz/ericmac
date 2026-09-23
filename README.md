# Eric Mac — portfólio

Portfólio do **Eric Mac** (Designer de Produtos na XP Inc.) como um **Mac**: barra de
menus, Dock, janelas, Spotlight, Central de Controle. No celular, o mesmo conteúdo
vira um **iPhone**: tela inicial com widgets, apps em tela cheia.

Irmão do portfólio do Isaac (`fatec/portfolio`, Windows XP + Frutiger Aero), trocando
a nostalgia do XP pelo macOS atual.

## O conceito

- **O Mac é do Eric.** "Sobre este Mac" vira *Sobre o Eric Mac*. O símbolo no lugar
  da maçã é a forma do banner dele no Behance: uma cápsula e um círculo em
  contornos concêntricos (`src/brand/shapes.ts` desenha a forma em código).
- **O papel de parede é a assinatura.** São os contornos do banner repetidos, com
  uma luz que acende as linhas sob o cursor. Quando um projeto está em foco, o fundo
  inteiro assume a cor da marca dele — azul Kozok, verde Tecinsoles, verde-petróleo
  Raízes — e volta ao roxo do Eric quando ele sai de foco. Dá para desligar na
  Central de Controle.
- **A voz é a dele.** Títulos em minúsculas com ponto final ("o conceito.",
  "aplicações."), como nos cases do Behance, na fonte display (Unbounded). Todo case
  segue a ordem dele: ponto de partida → antes → conceito → sistema → aplicações, e
  sempre tem **antes/depois** — aqui, um comparador arrastável.
- Na mesa: widget com nome e disponibilidade, widget do projeto mais recente, as três
  pastas de projeto tingidas com a cor de cada marca e a capa aparecendo por dentro.

## O que tem

| App | O que faz |
| --- | --- |
| **Projetos** (Finder) | grade/lista, filtros por campo e ferramenta, tags coloridas, Quick Look com Espaço |
| **Case** | capa, ficha técnica, texto, comparador antes/depois, paleta com hex copiável, galeria com lightbox, próximo projeto |
| **Sobre** | o "Sobre este Mac" do Eric |
| **Contato** (Mail) | rascunho já endereçado que abre o app de e-mail; WhatsApp, ligar, LinkedIn, Behance, Instagram, vCard |
| **Mensagens** | os comentários deixados nos projetos do Behance |
| **Notas** | "como eu trabalho." e "sobre este mac." |
| **Lixeira** | as identidades aposentadas (os "antes"). Não dá para esvaziar. |

Também: Spotlight (`Ctrl K` / `⌘K`), menus navegáveis por teclado, menu de contexto
na mesa, tema claro/escuro/automático, PT/EN, janelas arrastáveis e redimensionáveis,
minimizar para o Dock, endereço por janela (`#/kozok`, `#/sobre`, `#/contato`…).

## Stack

Vite + React 19 + TypeScript, Motion (molas e transições), Zustand (janelas e
preferências), vite-imagetools (AVIF/WebP responsivos gerados no build), fontes
self-hosted via Fontsource (Inter, Unbounded, Geist Mono). Sem framework de CSS: um
arquivo de CSS por componente, com tokens em `src/styles/tokens.css`.

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # checa tipos e gera dist/
pnpm preview
```

**No ar:** <https://isaac-ferraz.github.io/ericmac/> — cada push na `main` publica de novo
(`.github/workflows/deploy.yml`). `dist/` usa caminhos relativos, então também serve
em Vercel ou Netlify sem mudança.

## Estrutura

```
conteudo/behance/        fonte da verdade do conteúdo
  projetos.md            textos integrais, datas, ferramentas, paletas, como ele se apresenta
  perfil.json            dados do perfil no Behance
  imagens/               originais (resolução de upload) + avatar + banner
  derivados/             recortes antes/depois de Kozok e Tecinsoles
src/
  data/                  profile.ts · projects.ts · notes.ts — todo o conteúdo do site
  i18n/                  strings de interface PT/EN
  brand/                 forma da marca, símbolo, ícones de app, ícone de pasta
  os/                    o "sistema": janelas, Dock, barra de menus, Spotlight, boot, rotas
  apps/                  Projetos, Case, Sobre, Contato, Mensagens, Notas, Lixeira
  mobile/                a versão iPhone
public/                  favicon, apple-touch-icon, og-image
```

Para trocar um texto, mexa em `src/data/`. Para adicionar um projeto, coloque as
imagens em `conteudo/behance/imagens/` e acrescente um objeto em `src/data/projects.ts`
— Finder, Spotlight, menus, mesa e celular usam a mesma lista.

## Para o Eric revisar

Tudo o que não veio pronto do Behance está marcado no código com `draft` ou `TODO`:

- [ ] **E-mail** — `eric@gmail.com` foi o que recebemos; confirmar (`src/data/profile.ts`, `index.html`).
- [ ] **Texto do Tecinsoles** — o Behance só tem imagens; o texto foi escrito a partir das peças (`src/data/projects.ts`, `draft: true`).
- [ ] **Nota "como eu trabalho."** — é uma leitura do método que se repete nos três cases (`src/data/notes.ts`).
- [ ] **Frase do "Sobre"** — "pega marcas que explicam demais…" (`about.intro` em `src/i18n/strings.ts`).
- [ ] **Traduções para o inglês** de todos os textos dos cases.
- [ ] **Instagram** — o link aponta para `@oericmac`, tirado da capa do Kozok.

## Qualidade verificada

Rodado contra o build de produção (`pnpm preview`), com Playwright + axe-core:

- **Acessibilidade** — axe-core (WCAG 2.1 A/AA + best practices) em 1440px e 375px,
  temas claro e escuro, em todas as janelas: 0 violações.
- **Responsivo** — sem rolagem horizontal de 320 a 1600px (varredura de 8 em 8px).
  Abaixo de 900px de largura vira a versão iPhone.
- **Interação** — arrastar, minimizar para o Dock e restaurar, maximizar, busca sem
  acento ("raizes" acha Raízes), troca de idioma, menus pelo teclado, lightbox com
  setas e Esc, comparador pelo teclado, endereço acompanhando a janela: tudo passa,
  sem erros de JavaScript.
- **Movimento** — `prefers-reduced-motion` pula o boot e desliga molas e a deriva do fundo.
- O boot aparece só na primeira visita da sessão, e clicar ou teclar pula.

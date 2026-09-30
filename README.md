# Eric Macintyre — portfólio

Portfólio do **Eric Macintyre** (UI/UX Designer) como um **Mac**: barra de
menus, Dock, janelas, Spotlight, Central de Controle. No celular, o mesmo conteúdo
vira um **iPhone**: tela inicial com widgets, apps em tela cheia.

Irmão do portfólio do Isaac (`fatec/portfolio`, Windows XP + Frutiger Aero), trocando
a nostalgia do XP pelo macOS atual.

## O conceito

- **O Mac é do Eric.** "Sobre este Mac" vira *Sobre o Eric Macintyre*. O símbolo no lugar
  da maçã é a forma do banner dele no Behance: uma cápsula e um círculo em
  contornos concêntricos (`src/brand/shapes.ts` desenha a forma em código).
- **O papel de parede é a assinatura.** São os contornos do banner repetidos, com
  uma luz que acende as linhas sob o cursor. Quando um projeto está em foco, o fundo
  inteiro assume a cor da marca dele — roxo Healthy Creatives, azul Kozok, verde
  Tecinsoles, verde-petróleo Raízes — e volta ao roxo do Eric quando ele sai de foco. Dá para desligar na
  Central de Controle.
- **A voz é a dele.** Títulos em minúsculas com ponto final ("o conceito.",
  "aplicações."), como nos cases do Behance, na fonte display (Unbounded). Todo case
  segue a ordem dele: ponto de partida → antes → conceito → sistema → aplicações.
  Os redesigns têm **antes/depois**, num comparador arrastável; o Healthy Creatives,
  marca criada do zero (TCC dele), não tem.
- Na mesa: widget com nome e disponibilidade, widget do projeto mais recente, as quatro
  pastas de projeto tingidas com a cor de cada marca e a capa aparecendo por dentro.

## O que tem

| App | O que faz |
| --- | --- |
| **Projetos** (Finder) | grade/lista, filtros por campo e ferramenta, tags coloridas, Quick Look com Espaço |
| **Case** | capa, ficha técnica, texto, comparador antes/depois (nos redesigns), paleta com hex copiável, galeria com lightbox, próximo projeto |
| **Sobre** | o "Sobre este Mac" do Eric |
| **Contato** (Mail) | rascunho já endereçado que abre o app de e-mail; WhatsApp, ligar, LinkedIn, Behance, Instagram, vCard |
| **Mensagens** | os comentários deixados nos projetos do Behance |
| **Notas** | "como eu trabalho." e "sobre este mac." |
| **Lixeira** | as identidades aposentadas (os "antes" dos redesigns). Não dá para esvaziar. |

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
conteudo/behance/        fonte da verdade do conteúdo (Kozok, Tecinsoles, Raízes)
  projetos.md            textos integrais, datas, ferramentas, paletas, como ele se apresenta
  perfil.json            dados do perfil no Behance
  imagens/               originais (resolução de upload) + avatar + banner
  derivados/             recortes antes/depois de Kozok e Tecinsoles
conteudo/linkedin/       Healthy Creatives (TCC), do post dele no LinkedIn
  projeto.md             texto integral do post, data, orientação, lista de imagens
  imagens/               as 12 fotos do post
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
imagens em `conteudo/behance/imagens/` (ou `conteudo/linkedin/imagens/`) e acrescente
um objeto em `src/data/projects.ts` — Finder, Spotlight, menus, mesa e celular usam a
mesma lista. `compare` (antes/depois) é opcional; `link` diz se o projeto está no
Behance ou no LinkedIn; `pair` põe dois retratos lado a lado na galeria.

## Para o Eric revisar

Tudo o que não veio pronto do Behance está marcado no código com `draft` ou `TODO`:

- [ ] **E-mail** — `eric@gmail.com` foi o que recebemos; confirmar (`src/data/profile.ts`, `index.html`).
- [ ] **Texto do Tecinsoles** — o Behance só tem imagens; o texto foi escrito a partir das peças (`src/data/projects.ts`, `draft: true`).
- [ ] **Healthy Creatives** — as três primeiras seções são o texto do post dele (em inglês; o PT é tradução, em primeira pessoa como no post). A seção "o sistema." e a paleta (roxo `#3B1E8C`, azul-tinta `#23279A`) saíram das fotos (`draft: true`).
- [ ] **Fotos do Healthy Creatives em maior resolução** — sem login o LinkedIn só entrega 800px para 7 delas (ver `conteudo/linkedin/projeto.md`); se o Eric mandar os arquivos originais, é só substituir em `conteudo/linkedin/imagens/` com o mesmo nome.
- [ ] **Nota "como eu trabalho."** — é uma leitura do método que se repete nos cases do Behance (`src/data/notes.ts`).
- [ ] **Frase do "Sobre"** — "pega marcas que explicam demais…" (`about.intro` em `src/i18n/strings.ts`).
- [ ] **Traduções para o inglês** de todos os textos dos cases.
- [ ] **Instagram** — o link aponta para `@oericmac`, tirado da capa do Kozok.

## Qualidade verificada

Rodado contra o build de produção (`pnpm preview`), com Playwright + axe-core:

- **Acessibilidade** — axe-core (WCAG 2.1 A/AA + best practices) em 1440px e 375px,
  temas claro e escuro, em todas as janelas: 0 violações.
- **Responsivo** — sem rolagem horizontal de 320 a 1600px (varredura de 8 em 8px).
  Abaixo de 900px de largura vira a versão iPhone.
- **Telas conferidas** (30/09/2026) — iPhone 360, 390 e 430; celular deitado 844×390;
  tablet 768×1024 e 820×1180; Mac 1280×720, 1366×768, 1440×900, 1920×1080 e 2560×1440.
- **Interação** — arrastar, minimizar para o Dock e restaurar, maximizar, busca sem
  acento ("raizes" acha Raízes), troca de idioma, menus pelo teclado, lightbox com
  setas e Esc, comparador pelo teclado, endereço acompanhando a janela: tudo passa,
  sem erros de JavaScript.
- **Movimento** — `prefers-reduced-motion` pula o boot e desliga as molas.

## Responsivo sem px

- **No Mac, 1rem acompanha a tela.** A base de tamanho é uma fração da largura e da
  altura somada a uma parte da letra do navegador (`<style>` do `index.html`); vale o
  padrão exato em 1440×900, a referência do design. Todo o layout é em `rem`, `%`,
  `fr`, `vw/dvh` e `cqi`, então a mesa inteira cresce num monitor grande e encolhe num
  notebook, sem ilhas vazias nem aperto.
- **Janelas em fração da tela.** O tamanho inicial de cada app é o de desenho em rem,
  limitado a uma fração da área útil (`defaultSize` em `src/os/windows.ts`); Dock,
  barra de menus e limites de arrasto também são em rem.
- **Ficaram em px, de propósito:** linhas finas e bordas (0,5 e 1px), sombras,
  desfoques do vidro e `stroke-width`. Em proporção, uma linha fina some ou engrossa
  conforme a tela.
- **iPhone:** grade de 4 colunas em fração com fileiras completas (widget "mais
  recente" 2×2 ao lado dos quatro projetos; apps e a pasta **Redes** embaixo), ícones
  medidos como fração da célula. **Deitado:** widget à esquerda e 6 colunas à direita.
  **Tablet:** a mesma grade, maior. O fundo tem o brilho da cor e a luz dos contornos
  desliza até onde o dedo toca; no case, a capa corre por baixo da barra de vidro.

## Desempenho

Medido com rede 4G lenta (1,6 Mbps, 150 ms) e CPU 4× mais lenta:

| | antes | depois |
| --- | --- | --- |
| primeira coisa na tela | ~2,5 s (tela branca até o JS rodar) | **~0,6 s** (tela de boot em HTML puro) |
| boot | 1,75 s fixos depois do JS | some quando o app está pronto (mín. 0,6 s na 1ª visita da sessão) |
| fluidez parado | 29 FPS, quadro de até 67 ms | **60 FPS**, quadro de até 17 ms |
| fonte extra | +83 KB (latin-ext por causa do "ē") | 0 |

O que mudou e por quê:

- **Boot no `index.html`.** O símbolo e a barra são HTML/CSS inline, pintados antes de
  qualquer JavaScript; `src/os/bootScreen.ts` só os retira quando o shell renderizou e
  as fontes chegaram.
- **JavaScript dividido.** Mac e iPhone são pacotes separados; Case, Sobre, Contato,
  Mensagens, Notas e Lixeira carregam sob demanda e são pré-buscados quando o
  navegador fica ocioso (`prefetchApps` em `src/apps/registry.tsx`).
- **Fundo parado.** A deriva contínua das linhas obrigava todo vidro com
  `backdrop-filter` (barra de menus, Dock, widgets, barras laterais) a refazer o
  desfoque a cada quadro. A luz sob o cursor continua.
- **Troca de cor local.** A transição da cor do projeto em foco acontece só no papel
  de parede; antes ela animava uma variável herdada no `:root` e restilizava a página
  inteira a cada quadro.
- **Fontes.** O "ē" do ícone do Behance virou "Be" + um traço desenhado, e Inter e
  Unbounded (latin) são pré-carregadas pelo plugin `preloadFonts` em `vite.config.ts`.

### Render (30/09/2026)

Chrome com GPU, CPU 4× mais lenta, ~3 s de cada gesto; quadros acima de 16,7 ms
(travadas). "Antes" é o último commit com o conserto do vidro abaixo aplicado, para a
comparação ser justa.

| gesto | antes | depois |
| --- | --- | --- |
| mouse passeando pela mesa | 122–149 quadros travados | **0** |
| mouse no Dock | 152–173 | **0** |
| arrastar a janela Projetos | 109–145 | **0–1** |
| abrir três cases seguidos | 50–52 (pior quadro 83 ms) | **11–12** (pior 17 ms) |

- **Vidro que não aparecia.** O minificador de CSS descartava `backdrop-filter`
  quando vinha junto com `-webkit-backdrop-filter`, e o Chrome não lê a versão com
  prefixo: o site publicado não tinha desfoque nenhum. Agora o código só tem a forma
  padrão e o build gera o prefixo.
- **Luz do cursor sem repintar.** Era uma máscara de tela cheia que mudava a cada
  movimento. Virou uma "lanterna" do tamanho da luz que só se desloca (`transform`),
  com os contornos dentro andando ao contrário para seguirem alinhados.
- **Troca de cor por cruzamento.** A cena na cor nova aparece por cima só com
  opacidade, em vez de repintar a tela inteira por 1,1 s.
- **Barra lateral sem desfoque inútil.** Ela fica sobre o fundo opaco da janela;
  pinta-se a cor que o vidro daria, idêntica, sem refazer desfoque ao arrastar.
- **Dock sem layout forçado.** O centro de cada ícone é medido uma vez, ao entrar no
  Dock, e não 9 vezes por quadro.
- **Lightbox sem desfoque** por baixo de um fundo 94% escuro, onde ele não aparecia.

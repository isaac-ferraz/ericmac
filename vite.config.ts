import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

// Pré-carrega as duas fontes que a primeira tela usa (Inter e Unbounded, só latin),
// para o texto não esperar o CSS ser baixado e lido.
function preloadFonts(patterns: RegExp[]): Plugin {
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const files = Object.keys(ctx.bundle ?? {}).filter((f) => patterns.some((re) => re.test(f)))
        return files.map((f) => ({
          tag: 'link',
          attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `./${f}`, crossorigin: '' },
          injectTo: 'head' as const,
        }))
      },
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [
    react(),
    imagetools(),
    preloadFonts([/inter-latin-wght-normal-.*\.woff2$/, /unbounded-latin-wght-normal-.*\.woff2$/]),
  ],
  build: { target: 'es2022', assetsInlineLimit: 0 },
})

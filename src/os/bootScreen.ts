// A tela de boot vem pronta no index.html e aparece antes do JavaScript.
// Aqui ela só é retirada: quando o app montou e as fontes chegaram.

const KEY = 'ericmac.booted'

function firstVisit() {
  try {
    const first = sessionStorage.getItem(KEY) !== '1'
    sessionStorage.setItem(KEY, '1')
    return first
  } catch {
    return true
  }
}

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

/** Esconde a tela de boot. Na primeira visita da sessão ela fica pelo menos ~0,6s, para ser vista. */
export function hideBootScreen(): Promise<void> {
  const el = document.getElementById('boot')
  if (!el) return Promise.resolve()
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const minMs = firstVisit() && !reduced ? 600 : 0
  const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), wait(1200)])
  return Promise.all([fonts, wait(Math.max(0, minMs - performance.now()))]).then(() => {
    el.classList.add('is-done')
    window.setTimeout(() => el.remove(), 500)
  })
}

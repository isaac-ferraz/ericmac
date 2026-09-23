// Geometria da marca, derivada do banner do Behance do Eric: uma cápsula e um
// círculo que se tocam por um "pescoço", desenhados em contornos concêntricos.
// Os contornos de fora contornam a forma inteira; os de dentro se separam em
// duas ilhas, como curvas de nível de um metaball.

/** Caixa de referência da forma: 200 × 100. */
export const PEANUT_W = 200
export const PEANUT_H = 100

const CAP_CX = 50 // centro do semicírculo esquerdo da cápsula
const CAP_END = 104 // onde a reta da cápsula começa a curvar para o pescoço
const CAP_R = 40
const CIR_CX = 158
const CIR_R = 30
const NECK_X = 134
const NECK = 9 // meia-altura do pescoço no contorno de fora

/** Contorno externo (d = 0) e contornos internos (d > 0) que ainda passam pelo pescoço. */
function joined(d: number) {
  const top = 50 - CAP_R + d
  const bot = 50 + CAP_R - d
  const r = CAP_R - d
  const cr = CIR_R - d
  const n = NECK - d
  const ct = 50 - cr
  const cb = 50 + cr
  return [
    `M${CAP_CX} ${top}`,
    `L${CAP_END} ${top}`,
    `C${CAP_END + 16} ${top} ${NECK_X - 8} ${50 - n} ${NECK_X} ${50 - n}`,
    `C${NECK_X + 7} ${50 - n} ${CIR_CX - 16} ${ct} ${CIR_CX} ${ct}`,
    `A${cr} ${cr} 0 0 1 ${CIR_CX} ${cb}`,
    `C${CIR_CX - 16} ${cb} ${NECK_X + 7} ${50 + n} ${NECK_X} ${50 + n}`,
    `C${NECK_X - 8} ${50 + n} ${CAP_END + 16} ${bot} ${CAP_END} ${bot}`,
    `L${CAP_CX} ${bot}`,
    `A${r} ${r} 0 0 1 ${CAP_CX} ${top}Z`,
  ].join('')
}

/** Contornos internos que já se separaram: cápsula e círculo sozinhos. */
function split(d: number) {
  const top = 50 - CAP_R + d
  const bot = 50 + CAP_R - d
  const r = CAP_R - d
  const capRight = NECK_X - d * 0.9
  const rr = Math.min(r, (capRight - CAP_CX) / 1.2)
  const cr = CIR_R - d
  const capsule = [
    `M${CAP_CX} ${top}`,
    `L${capRight - rr} ${top}`,
    `A${rr} ${rr} 0 0 1 ${capRight - rr} ${bot}`,
    `L${CAP_CX} ${bot}`,
    `A${r} ${r} 0 0 1 ${CAP_CX} ${top}Z`,
  ].join('')
  const circle = cr > 1 ? `M${CIR_CX - cr} 50a${cr} ${cr} 0 1 0 ${cr * 2} 0a${cr} ${cr} 0 1 0 ${-cr * 2} 0Z` : ''
  return capsule + circle
}

/** `count` contornos, de fora para dentro, espaçados de `gap`. */
export function peanutContours(count: number, gap: number): string[] {
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    const d = i * gap
    if (CAP_R - d < 2) break
    out.push(d < NECK - 1 ? joined(d) : split(d))
  }
  return out
}

/** Superelipse (n = 5) em 0..100, próxima da máscara dos ícones do macOS. */
export const SQUIRCLE = (() => {
  const n = 5
  const pts: string[] = []
  const steps = 96
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const c = Math.cos(t)
    const s = Math.sin(t)
    const x = 50 + 50 * Math.sign(c) * Math.abs(c) ** (2 / n)
    const y = 50 + 50 * Math.sign(s) * Math.abs(s) ** (2 / n)
    pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  return `M${pts.join('L')}Z`
})()

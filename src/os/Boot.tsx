import { useEffect } from 'react'
import { motion } from 'motion/react'
import { Mark } from '../brand/icons'
import { useT } from '../i18n'
import './Boot.css'

const DURATION = 1.5

/** Tela de inicialização: o símbolo do Eric e uma barra de progresso. */
export function Boot({ onDone }: { onDone: () => void }) {
  const t = useT()

  useEffect(() => {
    const skip = () => onDone()
    const id = window.setTimeout(onDone, DURATION * 1000 + 250)
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [onDone])

  return (
    <motion.div
      className="boot"
      role="progressbar"
      aria-label={t('boot.label')}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
    >
      <motion.div
        className="boot__mark"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Mark size={44} />
      </motion.div>
      <div className="boot__bar" aria-hidden="true">
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: DURATION, ease: [0.4, 0.1, 0.3, 1], delay: 0.15 }}
        />
      </div>
    </motion.div>
  )
}

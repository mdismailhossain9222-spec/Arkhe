import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { EASE, DRAW } from './shared'

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let v = 0
    const id = window.setInterval(() => {
      v += Math.floor(Math.random() * 5) + 2
      if (v >= 100) {
        v = 100
        window.clearInterval(id)
        window.setTimeout(onDone, 520)
      }
      setCount(v)
    }, 34)
    return () => window.clearInterval(id)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper"
      exit={{ y: '-100%' }}
      transition={{ duration: 1, ease: [0.85, 0, 0.15, 1] }}
    >
      {/* drafting crosshair */}
      <div className="relative flex items-center justify-center">
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.3, ease: DRAW, delay: 0.15 }}
          className="absolute h-px w-[64vw] bg-ink/15"
        />
        <motion.span
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.3, ease: DRAW, delay: 0.15 }}
          className="absolute h-52 w-px bg-ink/15"
        />

        <div className="relative flex overflow-hidden bg-paper px-6 font-display text-6xl tracking-[0.02em] text-ink md:text-8xl">
          {'ARKHE'.split('').map((l, i) => (
            <motion.span
              key={i}
              initial={{ y: '112%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.25 + i * 0.075 }}
              className="inline-block"
            >
              {l}
            </motion.span>
          ))}
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="mt-8 text-[10px] uppercase tracking-[0.5em] text-graphite"
      >
        Architecture &amp; Interiors
      </motion.p>

      {/* measure bar with ticks */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 md:p-10">
        <div className="flex items-end justify-between">
          <span className="text-[10px] uppercase tracking-[0.35em] text-graphite">
            Est. 2009 — Copenhagen
          </span>
          <span className="font-display text-6xl leading-none text-ink tabular-nums md:text-7xl">
            {count}
          </span>
        </div>
        <div className="relative mt-5 h-6 w-full">
          {/* ticks */}
          <div className="absolute inset-x-0 top-0 flex justify-between">
            {Array.from({ length: 21 }).map((_, i) => (
              <span
                key={i}
                className={`w-px bg-ink/25 ${i % 5 === 0 ? 'h-3' : 'h-1.5'}`}
              />
            ))}
          </div>
          <div className="absolute inset-x-0 top-4 h-px bg-ink/15">
            <div
              className="h-px bg-clay transition-[width] duration-150 ease-out"
              style={{ width: `${count}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

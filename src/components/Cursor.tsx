import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/* A drafting crosshair cursor — square reticle with tick arms */
export default function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 })
  const ry = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 })
  const [hot, setHot] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      setHot(!!t?.closest('a, button, input, select, textarea, label, [data-hover]'))
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [x, y])

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[96] hidden h-1 w-1 bg-clay lg:block"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[95] hidden lg:block"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: hot ? 1.5 : 1, opacity: hot ? 1 : 0.55, rotate: hot ? 45 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="relative h-8 w-8 border border-ink/60">
          <span className="absolute -left-1.5 top-1/2 h-px w-1.5 bg-ink/60" />
          <span className="absolute -right-1.5 top-1/2 h-px w-1.5 bg-ink/60" />
          <span className="absolute left-1/2 -top-1.5 h-1.5 w-px bg-ink/60" />
          <span className="absolute left-1/2 -bottom-1.5 h-1.5 w-px bg-ink/60" />
        </div>
      </motion.div>
    </>
  )
}

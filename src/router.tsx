import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { lenisRef } from './utils/lenis'

export const PAGES = {
  home: 'Index',
  projects: 'Works',
  studio: 'Studio',
  process: 'Process',
  materials: 'Materials',
  journal: 'Journal',
  contact: 'Enquire',
  portal: 'Client Portal',
} as const

export type PageId = keyof typeof PAGES

export const PAGE_NO: Record<PageId, string> = {
  home: '00',
  projects: '01',
  studio: '02',
  process: '03',
  materials: '04',
  journal: '05',
  contact: '06',
  portal: '07',
}

type Veil = { target: PageId; stage: 'cover' | 'reveal' } | null

const RouterCtx = createContext<{ page: PageId; navigate: (p: PageId) => void } | null>(null)

export function useRouter() {
  const ctx = useContext(RouterCtx)
  if (!ctx) throw new Error('useRouter must be used inside RouterProvider')
  return ctx
}

const COLS = 7
const BLADE_EASE: [number, number, number, number] = [0.85, 0, 0.15, 1]

/* ------------------------------------------------------------------ */
/*  Architectural shutter — columns rise like a facade being built,     */
/*  a drafting crosshair marks the page, then blades lift away.         */
/* ------------------------------------------------------------------ */
function PageVeil({ veil }: { veil: Veil }) {
  if (!veil) return null
  const cover = veil.stage === 'cover'

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      {/* blades */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLS }).map((_, i) => (
          <motion.span
            key={i}
            className="h-full flex-1 border-r border-paper/10 bg-ink"
            style={{ transformOrigin: cover ? 'bottom' : 'top' }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: cover ? 1 : 0 }}
            transition={{
              duration: 0.62,
              ease: BLADE_EASE,
              delay: (cover ? i : COLS - 1 - i) * 0.045,
            }}
          />
        ))}
      </div>

      {/* drafting marks + page label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: cover ? 1 : 0 }}
        transition={{ duration: 0.35, delay: cover ? 0.42 : 0 }}
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        {/* crosshair */}
        <div className="relative flex items-center justify-center">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: cover ? 1 : 0 }}
            transition={{ duration: 0.7, ease: BLADE_EASE, delay: cover ? 0.45 : 0 }}
            className="absolute h-px w-[52vw] bg-paper/25"
          />
          <motion.span
            initial={{ scaleY: 0 }}
            animate={{ scaleY: cover ? 1 : 0 }}
            transition={{ duration: 0.7, ease: BLADE_EASE, delay: cover ? 0.45 : 0 }}
            className="absolute h-40 w-px bg-paper/25"
          />

          <div className="relative flex items-baseline gap-5 bg-ink px-8">
            <span className="font-sans text-[11px] tracking-[0.4em] text-clay">
              {PAGE_NO[veil.target]}
            </span>
            <div className="overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: cover ? 0 : '110%' }}
                transition={{ duration: 0.6, ease: BLADE_EASE, delay: cover ? 0.5 : 0 }}
                className="block font-display text-5xl text-paper md:text-7xl"
              >
                {PAGES[veil.target]}
              </motion.span>
            </div>
          </div>
        </div>

        {/* corner ticks */}
        <div className="absolute inset-8 md:inset-12">
          {[
            'left-0 top-0 border-l border-t',
            'right-0 top-0 border-r border-t',
            'left-0 bottom-0 border-l border-b',
            'right-0 bottom-0 border-r border-b',
          ].map((pos) => (
            <motion.span
              key={pos}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: cover ? 1 : 0, scale: cover ? 1 : 0.4 }}
              transition={{ duration: 0.5, delay: cover ? 0.55 : 0 }}
              className={`absolute h-7 w-7 border-paper/35 ${pos}`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageId>('home')
  const [veil, setVeil] = useState<Veil>(null)
  const busy = useRef(false)

  const navigate = useCallback(
    (target: PageId) => {
      if (busy.current) return
      if (target === page) {
        if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 1.1 })
        else window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      busy.current = true
      setVeil({ target, stage: 'cover' })

      window.setTimeout(() => {
        setPage(target)
        if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
        window.scrollTo(0, 0)
      }, 940)

      window.setTimeout(() => setVeil({ target, stage: 'reveal' }), 1380)
      window.setTimeout(() => {
        setVeil(null)
        busy.current = false
      }, 2300)
    },
    [page]
  )

  const value = useMemo(() => ({ page, navigate }), [page, navigate])

  return (
    <RouterCtx.Provider value={value}>
      {children}
      <PageVeil veil={veil} />
    </RouterCtx.Provider>
  )
}

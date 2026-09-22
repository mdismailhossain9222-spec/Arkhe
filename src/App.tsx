import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { EASE } from './components/shared'
import { lenisRef } from './utils/lenis'
import { RouterProvider, useRouter } from './router'
import { AuthProvider } from './auth'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Studio from './pages/Studio'
import Process from './pages/Process'
import Materials from './pages/Materials'
import Journal from './pages/Journal'
import Contact from './pages/Contact'
import Portal from './pages/Portal'

/* paper grain — very light, suits the stock */
function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] opacity-[0.035] mix-blend-multiply"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: '200px 200px',
      }}
    />
  )
}

function PageSwitch({ started }: { started: boolean }) {
  const { page } = useRouter()
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={page}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {page === 'home' && <Home started={started} />}
        {page === 'projects' && <Projects />}
        {page === 'studio' && <Studio />}
        {page === 'process' && <Process />}
        {page === 'materials' && <Materials />}
        {page === 'journal' && <Journal />}
        {page === 'contact' && <Contact />}
        {page === 'portal' && <Portal />}
      </motion.main>
    </AnimatePresence>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const finish = useCallback(() => setLoading(false), [])

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true })
    lenisRef.current = lenis
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [loading])

  return (
    <RouterProvider>
      <AuthProvider>
        <div className="relative min-h-screen bg-paper font-sans text-ink">
          <AnimatePresence>
            {loading && <Preloader key="preloader" onDone={finish} />}
          </AnimatePresence>

          <Grain />
          <Cursor />
          <Navbar />
          <PageSwitch started={!loading} />
          <Footer />
        </div>
      </AuthProvider>
    </RouterProvider>
  )
}

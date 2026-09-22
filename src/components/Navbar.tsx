import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, Menu, X } from 'lucide-react'
import { cn } from '../utils/cn'
import { EASE } from './shared'
import { PAGES, PAGE_NO, useRouter } from '../router'
import type { PageId } from '../router'
import { useAuth } from '../auth'

const NAV: PageId[] = ['projects', 'studio', 'process', 'materials', 'journal']

function Mark() {
  return (
    <span className="flex items-center gap-2.5">
      {/* three stacked volumes as a logotype */}
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="0.5" y="12.5" width="19" height="7" stroke="currentColor" />
        <rect x="3.5" y="6.5" width="13" height="6" stroke="currentColor" />
        <rect x="7.5" y="0.5" width="5" height="6" stroke="currentColor" />
      </svg>
      <span className="font-display text-xl tracking-[0.14em]">ARKHE</span>
    </span>
  )
}

export default function Navbar() {
  const { page, navigate } = useRouter()
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (t: PageId) => {
    if (open) {
      setOpen(false)
      window.setTimeout(() => navigate(t), 320)
    } else navigate(t)
  }

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 2.6 }}
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-colors duration-500',
          scrolled && !open ? 'border-b border-ink/12 bg-paper/85 backdrop-blur-md' : 'border-b border-transparent'
        )}
      >
        <nav className="flex items-center justify-between px-6 py-4 text-ink md:px-10">
          <button onClick={() => go('home')} aria-label="ARKHE — index" className="transition-colors hover:text-clay">
            <Mark />
          </button>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV.map((id) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={cn(
                  'group relative flex items-baseline gap-1.5 text-[11px] font-medium uppercase tracking-[0.26em] transition-colors',
                  page === id ? 'text-ink' : 'text-graphite hover:text-ink'
                )}
              >
                <span className="font-sans text-[9px] tracking-normal text-clay">{PAGE_NO[id]}</span>
                {PAGES[id]}
                <span
                  className={cn(
                    'absolute -bottom-1.5 left-0 h-px w-full bg-ink transition-transform duration-500 ease-out',
                    page === id ? 'origin-left scale-x-100' : 'origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100'
                  )}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="group relative hidden sm:block" data-hover>
                <button className="flex items-center gap-2.5 border border-ink/20 py-1.5 pl-1.5 pr-4 transition-colors group-hover:border-ink">
                  <span className="grid h-7 w-7 place-items-center bg-ink text-[10px] font-semibold text-paper">
                    {user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                  </span>
                  <span className="max-w-20 truncate text-[10px] font-medium uppercase tracking-[0.2em]">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
                <div className="pointer-events-none absolute right-0 top-full translate-y-2 pt-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="w-60 border border-ink/12 bg-chalk p-5 shadow-[0_18px_40px_-24px_rgba(19,18,16,0.5)]">
                    <p className="font-display text-lg">{user.name}</p>
                    <p className="mt-0.5 truncate text-xs text-graphite">{user.email}</p>
                    <div className="mt-4 flex flex-col gap-2 border-t border-ink/12 pt-4">
                      <button
                        onClick={() => go('portal')}
                        className="border border-ink/25 px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.24em] transition-colors hover:bg-ink hover:text-paper"
                      >
                        Project files
                      </button>
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 px-1 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-graphite transition-colors hover:text-clay"
                      >
                        <LogOut size={13} /> Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => go('portal')}
                className={cn(
                  'hidden border px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.26em] transition-colors sm:block',
                  page === 'portal' ? 'border-ink text-ink' : 'border-ink/25 text-graphite hover:border-ink hover:text-ink'
                )}
              >
                Client Portal
              </button>
            )}

            <button
              onClick={() => go('contact')}
              className="group relative hidden overflow-hidden bg-ink px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.26em] text-paper sm:block"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-clay transition-transform duration-500 ease-out group-hover:scale-x-100" />
              <span className="relative">Enquire</span>
            </button>

            <button
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center border border-ink/20 transition-colors hover:border-ink lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* mobile — blades open from the left */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            exit={{ clipPath: 'inset(0 100% 0 0)' }}
            transition={{ duration: 0.6, ease: [0.85, 0, 0.15, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-ink text-paper"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <Mark />
              <button
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center border border-paper/25"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-1 px-8">
              {(['home', ...NAV, 'contact', 'portal'] as PageId[]).map((id, i) => (
                <div key={id} className="overflow-hidden border-b border-paper/10">
                  <motion.button
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 0.65, ease: EASE, delay: 0.08 + i * 0.05 }}
                    onClick={() => go(id)}
                    className={cn(
                      'flex w-full items-baseline gap-4 py-3 text-left font-display text-4xl transition-colors hover:text-clay',
                      page === id ? 'text-clay' : 'text-paper'
                    )}
                  >
                    <span className="font-sans text-[10px] tracking-[0.2em] text-paper/45">
                      {PAGE_NO[id]}
                    </span>
                    {PAGES[id]}
                  </motion.button>
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between gap-4 border-t border-paper/12 px-8 py-6 text-[10px] uppercase tracking-[0.28em] text-paper/55"
            >
              <span>Refshalevej 8, Copenhagen</span>
              {user && (
                <button onClick={() => { logout(); setOpen(false) }} className="hover:text-clay">
                  Sign out
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

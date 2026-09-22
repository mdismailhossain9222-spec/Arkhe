import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { EASE, Reveal } from './shared'
import { PAGES, PAGE_NO, useRouter } from '../router'
import type { PageId } from '../router'
import { lenisRef } from '../utils/lenis'

const NAV: PageId[] = ['home', 'projects', 'studio', 'process', 'materials', 'journal', 'contact', 'portal']

const CONTACT = [
  ['Studio', 'Refshalevej 8\n1432 Copenhagen K'],
  ['Enquiries', 'hello@arkhe.studio\n+45 32 11 04 88'],
  ['Social', 'Instagram\nLinkedIn'],
]

export default function Footer() {
  const { navigate } = useRouter()
  const toTop = () => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 1.2 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative z-10 border-t border-ink/12 bg-chalk px-6 pt-20 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 md:grid-cols-12">
          {/* index */}
          <div className="md:col-span-5">
            <Reveal>
              <p className="max-w-xs font-display text-3xl leading-snug text-ink md:text-4xl">
                Buildings of mass, light and <span className="italic text-clay">quiet</span>.
              </p>
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-graphite">
                We take on four commissions a year so each one keeps the studio&apos;s full
                attention from first sketch to final handover.
              </p>
            </Reveal>
          </div>

          {/* nav index list */}
          <div className="md:col-span-4">
            <Reveal delay={0.08}>
              <span className="text-[10px] uppercase tracking-[0.3em] text-graphite">Index</span>
              <ul className="mt-5">
                {NAV.map((id) => (
                  <li key={id} className="border-b border-ink/10">
                    <button
                      onClick={() => navigate(id)}
                      className="group flex w-full items-baseline gap-4 py-2.5 text-left"
                    >
                      <span className="font-sans text-[10px] tracking-[0.2em] text-clay">
                        {PAGE_NO[id]}
                      </span>
                      <span className="font-display text-xl text-ink transition-transform duration-500 group-hover:translate-x-1.5 group-hover:text-clay">
                        {PAGES[id]}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* contact */}
          <div className="md:col-span-3">
            <Reveal delay={0.16} className="space-y-8">
              {CONTACT.map(([k, v]) => (
                <div key={k}>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-graphite">{k}</span>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink">{v}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>

        {/* oversized wordmark, revealed on scroll */}
        <div className="mt-20 overflow-hidden">
          <motion.button
            onClick={() => navigate('contact')}
            initial={{ y: '18%', opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 1.2, ease: EASE }}
            className="group block w-full text-left"
            aria-label="Start an enquiry"
          >
            <span className="block font-display text-[clamp(4.5rem,19vw,17rem)] leading-[0.82] tracking-[0.01em] text-ink transition-colors duration-700 group-hover:text-clay">
              ARKHE
            </span>
          </motion.button>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-5 border-t border-ink/12 py-7 text-[10px] uppercase tracking-[0.28em] text-graphite md:flex-row md:items-center">
          <span>© 2026 ARKHE Studio ApS — CVR 38 21 55 09</span>
          <span className="font-display text-sm normal-case tracking-normal italic">
            drawn by hand, built to last
          </span>
          <button onClick={toTop} className="group flex items-center gap-3 transition-colors hover:text-ink">
            Top
            <span className="flex h-9 w-9 items-center justify-center border border-ink/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-ink">
              <ArrowUp size={14} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}

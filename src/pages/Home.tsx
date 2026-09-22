import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import Massing from '../components/three/Massing'
import { MATERIALS } from '../components/three/MaterialStudy'
import type { MaterialId } from '../components/three/MaterialStudy'
import {
  Counter,
  EASE,
  InkButton,
  LineReveal,
  LinkArrow,
  Plate,
  Reveal,
  SectionHead,
} from '../components/shared'
import { useRouter } from '../router'
import { PROJECTS, POSTS } from '../data'

/* ---------------- hero ---------------- */
function Hero({ started }: { started: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { navigate } = useRouter()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 130])
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const show = started ? 'visible' : 'hidden'

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden border-b border-ink/12">
      <div className="blueprint absolute inset-0 opacity-70" />

      {/* 3D massing sits to the right, bleeding off the page */}
      <div className="pointer-events-none absolute inset-y-0 right-[-14%] w-[86%] md:right-[-4%] md:w-[58%]">
        <Massing className="h-full w-full" />
      </div>

      <motion.div
        style={{ y, opacity: fade }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-6 md:px-10"
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
          initial="hidden"
          animate={show}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="flex items-center gap-5"
        >
          <span className="h-px w-12 bg-clay" />
          <span className="text-[10px] font-medium uppercase tracking-[0.42em] text-graphite">
            Architecture &amp; Interiors — Copenhagen
          </span>
        </motion.div>

        <h1 className="mt-8 font-display text-[clamp(3.4rem,10.5vw,9.5rem)] leading-[0.9] tracking-[-0.01em] text-ink">
          {['Mass, light', 'and the space', 'between.'].map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.05em]">
              <motion.span
                variants={{ hidden: { y: '108%' }, visible: { y: 0 } }}
                initial="hidden"
                animate={show}
                transition={{ duration: 1.15, ease: EASE, delay: 0.45 + i * 0.1 }}
                className={i === 2 ? 'block italic text-clay' : 'block'}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          initial="hidden"
          animate={show}
          transition={{ duration: 0.9, ease: EASE, delay: 0.95 }}
          className="mt-10 flex max-w-md flex-col gap-7"
        >
          <p className="text-sm leading-relaxed text-graphite md:text-base">
            ARKHE is a studio of fourteen working across houses, galleries and workplaces
            in the Nordics. We build slowly, in few materials, and only four times a year.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <InkButton label="Selected works" onClick={() => navigate('projects')} />
            <LinkArrow label="The studio" onClick={() => navigate('studio')} />
          </div>
        </motion.div>
      </motion.div>

      {/* bottom rail */}
      <motion.div
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        initial="hidden"
        animate={show}
        transition={{ duration: 0.9, delay: 1.5 }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between border-t border-ink/12 bg-paper/60 px-6 py-4 text-[10px] uppercase tracking-[0.28em] text-graphite backdrop-blur-sm md:px-10"
      >
        <span className="flex items-center gap-3">
          <ArrowDown size={13} className="text-clay" /> Scroll
        </span>
        <span className="hidden sm:block">56°N 12°E</span>
        <span>Est. 2009 — 41 built</span>
      </motion.div>
    </section>
  )
}

/* ---------------- statement + figures ---------------- */
function Statement() {
  const FIGURES: [number, string, string][] = [
    [41, '', 'Projects completed'],
    [4, '', 'Commissions a year'],
    [14, '', 'People in the studio'],
    [9, '', 'Awards since 2016'],
  ]
  return (
    <section className="relative z-10 border-b border-ink/12 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHead index="01" label="Position" />
        <div className="mt-12 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <LineReveal
              lines={['We design few', 'buildings, and we', 'stay until the end.']}
              accentIndex={2}
              className="text-4xl md:text-6xl"
            />
          </div>
          <div className="md:col-span-5 md:pt-4">
            <Reveal delay={0.1}>
              <p className="text-sm leading-relaxed text-graphite md:text-base">
                Every commission is led by a partner from the first site visit to the last
                snag. We draw in section before plan, choose no more than five materials,
                and detail every junction ourselves.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-10">
              <dl className="grid grid-cols-2 border-t border-ink/12">
                {FIGURES.map(([v, suffix, label]) => (
                  <div key={label} className="border-b border-ink/12 py-6 pr-6 odd:border-r odd:border-ink/12">
                    <dt className="sr-only">{label}</dt>
                    <dd>
                      <Counter value={v} suffix={suffix} className="font-display text-4xl text-ink md:text-5xl" />
                      <span className="mt-2 block text-[10px] uppercase tracking-[0.26em] text-graphite">
                        {label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- selected works ---------------- */
function Works() {
  const { navigate } = useRouter()
  const featured = PROJECTS.slice(0, 3)

  return (
    <section className="relative z-10 border-b border-ink/12 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead index="02" label="Selected Works" />
          <LinkArrow label="All works" onClick={() => navigate('projects')} />
        </div>

        <div className="mt-16 space-y-20 md:space-y-28">
          {featured.map((p, i) => {
            const flip = i % 2 === 1
            return (
              <article key={p.id} className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
                <div className={flip ? 'md:order-2 md:col-span-7' : 'md:col-span-7'}>
                  <Plate
                    src={p.image}
                    alt={p.title}
                    imgClassName="aspect-[4/3] md:aspect-[16/11]"
                    delay={0.05}
                  />
                </div>
                <div className={flip ? 'md:order-1 md:col-span-5' : 'md:col-span-5'}>
                  <Reveal delay={0.1}>
                    <div className="flex items-baseline gap-4">
                      <span className="font-sans text-[11px] tracking-[0.3em] text-clay">{p.no}</span>
                      <span className="h-px flex-1 bg-ink/15" />
                      <span className="text-[10px] uppercase tracking-[0.26em] text-graphite">{p.type}</span>
                    </div>
                    <h3 className="mt-5 font-display text-4xl leading-tight text-ink md:text-5xl">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.26em] text-graphite">
                      {p.place} — {p.year}
                    </p>
                    <p className="mt-5 max-w-sm text-sm leading-relaxed text-graphite">{p.blurb}</p>
                    <div className="mt-7">
                      <LinkArrow label="Open project" onClick={() => navigate('projects')} />
                    </div>
                  </Reveal>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------------- material strip ---------------- */
function MaterialStrip() {
  const { navigate } = useRouter()
  const ids = Object.keys(MATERIALS) as MaterialId[]
  return (
    <section className="relative z-10 border-b border-ink/12 bg-chalk px-6 py-24 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead index="03" label="Palette" />
          <LinkArrow label="Material library" onClick={() => navigate('materials')} />
        </div>
        <div className="mt-14 grid grid-cols-2 gap-px border border-ink/12 bg-ink/12 md:grid-cols-5">
          {ids.map((id, i) => {
            const m = MATERIALS[id]
            return (
              <motion.button
                key={id}
                onClick={() => navigate('materials')}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.07 }}
                className="group bg-paper p-6 text-left transition-colors duration-500 hover:bg-chalk"
              >
                <span
                  className="block h-20 w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  style={{ background: m.swatch }}
                />
                <span className="mt-5 block font-display text-lg text-ink">{m.label}</span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.24em] text-graphite">
                  {m.origin}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------------- journal teaser ---------------- */
function JournalTeaser() {
  const { navigate } = useRouter()
  return (
    <section className="relative z-10 border-b border-ink/12 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead index="04" label="From the Journal" />
          <LinkArrow label="Read all" onClick={() => navigate('journal')} />
        </div>
        <div className="mt-14 border-t border-ink/12">
          {POSTS.slice(0, 3).map((p, i) => (
            <motion.button
              key={p.no}
              onClick={() => navigate('journal')}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.07 }}
              className="group grid w-full grid-cols-12 items-baseline gap-4 border-b border-ink/12 py-7 text-left"
            >
              <span className="col-span-2 font-sans text-[11px] tracking-[0.28em] text-clay md:col-span-1">
                {p.no}
              </span>
              <span className="col-span-10 font-display text-2xl text-ink transition-transform duration-500 group-hover:translate-x-2 md:col-span-6 md:text-3xl">
                {p.title}
              </span>
              <span className="col-span-6 col-start-3 text-[10px] uppercase tracking-[0.26em] text-graphite md:col-span-3 md:col-start-auto">
                {p.kicker}
              </span>
              <span className="col-span-4 text-right text-[10px] uppercase tracking-[0.26em] text-graphite md:col-span-2">
                {p.date}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- closing ---------------- */
function Closing() {
  const { navigate } = useRouter()
  return (
    <section className="relative z-10 overflow-hidden px-6 py-28 md:px-10 md:py-40">
      <div className="blueprint absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-4xl text-center">
        <LineReveal
          lines={['Have a site,', 'a brief, or only', 'a suspicion?']}
          accentIndex={2}
          className="text-4xl md:text-6xl lg:text-7xl"
        />
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-graphite md:text-base">
            We take on four commissions a year. Tell us about yours — first conversations
            are unhurried and cost nothing.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="mt-11 flex justify-center">
          <InkButton label="Start an enquiry" onClick={() => navigate('contact')} className="px-12 py-5" />
        </Reveal>
      </div>
    </section>
  )
}

export default function Home({ started }: { started: boolean }) {
  return (
    <>
      <Hero started={started} />
      <Statement />
      <Works />
      <MaterialStrip />
      <JournalTeaser />
      <Closing />
    </>
  )
}

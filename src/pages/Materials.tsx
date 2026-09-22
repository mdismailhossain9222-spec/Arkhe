import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MaterialStudy, { MATERIALS } from '../components/three/MaterialStudy'
import type { MaterialId } from '../components/three/MaterialStudy'
import { EASE, LinkArrow, PageMasthead, Plate, Reveal, SectionHead } from '../components/shared'
import { IMG } from '../media'
import { useRouter } from '../router'
import { cn } from '../utils/cn'

const IDS = Object.keys(MATERIALS) as MaterialId[]

const SPECS: Record<MaterialId, [string, string][]> = {
  travertine: [
    ['Finish', 'Honed, cross-cut'],
    ['Format', '600 × 1200 × 20 mm'],
    ['Used in', 'Floors, bathing rooms'],
    ['Ages', 'Darkens slightly, polishes underfoot'],
  ],
  concrete: [
    ['Finish', 'Board-formed, sealed'],
    ['Formwork', 'Douglas fir, 140 mm'],
    ['Used in', 'Structure, retaining walls'],
    ['Ages', 'Lightens; grain stays legible'],
  ],
  oak: [
    ['Finish', 'Fumed, hard-wax oiled'],
    ['Format', 'Quarter-sawn boards'],
    ['Used in', 'Joinery, stairs, linings'],
    ['Ages', 'Warms to a deep tobacco'],
  ],
  brass: [
    ['Finish', 'Unlacquered, mill'],
    ['Format', 'Solid bar & sheet'],
    ['Used in', 'Ironmongery, reveals'],
    ['Ages', 'Patinates to brown-gold'],
  ],
  lime: [
    ['Finish', 'Burnished, three coats'],
    ['Base', 'Natural hydraulic lime'],
    ['Used in', 'Walls and soffits'],
    ['Ages', 'Hardens for decades'],
  ],
}

const PAIRINGS = [
  { a: 'Concrete', b: 'Smoked oak', note: 'Cold mass against warm grain — our most used pair.' },
  { a: 'Travertine', b: 'Lime plaster', note: 'Two chalky surfaces; the difference is only in the light.' },
  { a: 'Brass', b: 'Lime plaster', note: 'A single warm metal line in an otherwise matte room.' },
]

export default function Materials() {
  const [active, setActive] = useState<MaterialId>('travertine')
  const { navigate } = useRouter()
  const m = MATERIALS[active]

  return (
    <>
      <PageMasthead
        no="04"
        label="Material Library"
        title="Five"
        accent="materials"
        sub="No project uses more than five. These are the ones we return to, and what they do over time."
        meta={[
          ['In the palette', '05'],
          ['Sourced within', '900 km'],
          ['Samples held', '240'],
        ]}
      />

      {/* interactive sample */}
      <section className="relative z-10 border-b border-ink/12 bg-chalk px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-6">
            <div className="border border-ink/12 bg-paper">
              <MaterialStudy material={active} className="h-[42vh] min-h-[300px] w-full md:h-[52vh]" />
            </div>
            {/* swatch selector */}
            <div className="mt-4 grid grid-cols-5 gap-px border border-ink/12 bg-ink/12">
              {IDS.map((id) => (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  aria-label={MATERIALS[id].label}
                  className={cn(
                    'group relative bg-paper p-3 transition-colors',
                    active === id && 'bg-chalk'
                  )}
                >
                  <span
                    className="block h-10 w-full transition-transform duration-500 group-hover:scale-105"
                    style={{ background: MATERIALS[id].swatch }}
                  />
                  {active === id && (
                    <motion.span
                      layoutId="mat-underline"
                      className="absolute inset-x-3 bottom-1 h-px bg-clay"
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-6">
            <SectionHead index="01" label="Sample" />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="mt-8"
              >
                <h2 className="font-display text-4xl leading-tight text-ink md:text-6xl">{m.label}</h2>
                <p className="mt-3 text-[11px] uppercase tracking-[0.26em] text-clay">{m.origin}</p>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-graphite md:text-base">
                  {m.note}
                </p>
                <dl className="mt-9 border-t border-ink/12">
                  {SPECS[active].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-6 border-b border-ink/12 py-3.5">
                      <dt className="text-[10px] uppercase tracking-[0.24em] text-graphite">{k}</dt>
                      <dd className="text-right font-display text-lg text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* pairings */}
      <section className="relative z-10 border-b border-ink/12 px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHead index="02" label="Pairings" />
          <div className="mt-14 grid gap-px border border-ink/12 bg-ink/12 md:grid-cols-3">
            {PAIRINGS.map((p, i) => (
              <motion.div
                key={p.a}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
                className="bg-paper p-8 md:p-10"
              >
                <span className="font-sans text-[11px] tracking-[0.28em] text-clay">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 font-display text-3xl leading-tight text-ink">
                  {p.a}
                  <span className="mx-2 text-graphite/50">+</span>
                  <span className="italic">{p.b}</span>
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-graphite">{p.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* in situ */}
      <section className="relative z-10 px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHead index="03" label="In Situ" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <Plate src={IMG.stoneWindow} alt="Stone and timber window" imgClassName="aspect-[3/4]" caption="Stone reveal, Markhus" fig="fig. 01" />
            <Plate src={IMG.warmVase} alt="Warm interior surfaces" imgClassName="aspect-[3/4]" caption="Lime plaster, Vinter" fig="fig. 02" delay={0.08} />
            <Plate src={IMG.kitchen} alt="Oak joinery" imgClassName="aspect-[3/4]" caption="Smoked oak, Sund House" fig="fig. 03" delay={0.16} />
          </div>
          <Reveal delay={0.2} className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-ink/12 pt-10">
            <p className="max-w-md text-sm leading-relaxed text-graphite">
              We keep a physical library of 240 samples at the studio. Clients are welcome
              to spend an afternoon with it before anything is specified.
            </p>
            <LinkArrow label="Visit the library" onClick={() => navigate('contact')} />
          </Reveal>
        </div>
      </section>
    </>
  )
}

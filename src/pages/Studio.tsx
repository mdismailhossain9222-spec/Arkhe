import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Counter, EASE, LineReveal, PageMasthead, Plate, Reveal, SectionHead } from '../components/shared'
import { IMG } from '../media'

const TIMELINE = [
  { year: '2009', title: 'Two desks on Refshaleøen', text: 'Mette Lund and Jonas Aarø leave a large practice and take a room in a disused shipyard. The first commission is a 34 m² garden studio.' },
  { year: '2014', title: 'Kalk House completed', text: 'A limestone house in Jutland brings the studio its first national award and, more usefully, its first repeat client.' },
  { year: '2019', title: 'The workshop opens', text: 'A model shop is built into the studio. Every project since has been tested at 1:50 in timber and card before a single render is made.' },
  { year: '2023', title: 'Fourteen people, four projects', text: 'The studio caps its intake at four commissions a year — a decision that halved revenue growth and doubled the quality of the detailing.' },
]

const TEAM = [
  { name: 'Mette Lund', role: 'Founding Partner', note: 'Architect MAA. Leads housing and cultural work.' },
  { name: 'Jonas Aarø', role: 'Founding Partner', note: 'Architect MAA. Leads interiors and material research.' },
  { name: 'Sara Vestergaard', role: 'Associate', note: 'Technical lead. Twelve years in timber and concrete.' },
  { name: 'Ilyas Demir', role: 'Associate', note: 'Heritage and adaptive reuse. Model shop lead.' },
]

const VALUES = [
  ['Few materials', 'No project uses more than five. Constraint is what makes a room calm.'],
  ['Section first', 'We draw the cut before the plan. Light and height come before layout.'],
  ['Stay to the end', 'A partner is on site through construction. Details are not delegated.'],
  ['Build to repair', 'Fixings visible, parts replaceable. A building should be maintainable in fifty years.'],
]

function Timeline() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.65'] })
  const line = useSpring(scrollYProgress, { stiffness: 80, damping: 24 })

  return (
    <section className="relative z-10 border-b border-ink/12 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHead index="02" label="Chronology" />
        <div ref={ref} className="relative mt-16 pl-10 md:pl-0">
          {/* rail */}
          <span className="absolute left-[3px] top-0 h-full w-px bg-ink/12 md:left-[110px]" />
          <motion.span
            style={{ scaleY: line }}
            className="absolute left-[3px] top-0 h-full w-px origin-top bg-clay md:left-[110px]"
          />

          <div className="space-y-16">
            {TIMELINE.map((t) => (
              <motion.div
                key={t.year}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-18%' }}
                transition={{ duration: 0.85, ease: EASE }}
                className="relative md:grid md:grid-cols-[110px_1fr] md:gap-14"
              >
                <span className="absolute -left-[37px] top-2 h-1.5 w-1.5 bg-clay md:-left-0 md:left-[107px] md:translate-x-[-2px]" />
                <span className="font-display text-3xl text-ink md:text-right md:text-4xl">{t.year}</span>
                <div className="mt-2 md:mt-1">
                  <h3 className="font-display text-2xl text-ink md:text-3xl">{t.title}</h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-graphite">{t.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Studio() {
  const wrap = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <>
      <PageMasthead
        no="02"
        label="The Studio"
        title="Fourteen"
        accent="people"
        sub="A practice in a former shipyard on Refshaleøen, working across the Nordics since 2009."
        meta={[
          ['Founded', '2009'],
          ['Studio', 'Copenhagen'],
          ['Team', '14'],
        ]}
      />

      {/* manifesto + portrait */}
      <section className="relative z-10 border-b border-ink/12 px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHead index="01" label="Position" />
          <div className="mt-12 grid gap-14 md:grid-cols-12">
            <div className="md:col-span-6">
              <LineReveal
                lines={['Architecture is', 'slow, expensive', 'and permanent.']}
                accentIndex={2}
                className="text-4xl md:text-5xl lg:text-6xl"
              />
              <Reveal delay={0.15}>
                <p className="mt-8 max-w-md text-sm leading-relaxed text-graphite md:text-base">
                  Those three facts shape everything we do. We would rather take on four
                  projects properly than twenty at arm&apos;s length, and we would rather
                  spend a month on a stair detail than a week on a competition board.
                </p>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-graphite md:text-base">
                  The studio is deliberately small, deliberately analogue in its early
                  stages, and deliberately stubborn about finishing what it starts.
                </p>
              </Reveal>
            </div>
            <div className="md:col-span-6" ref={wrap}>
              <div className="relative overflow-hidden">
                <motion.div style={{ y }} className="will-change-transform">
                  <Plate
                    src={IMG.woodCeiling}
                    alt="Timber and plaster detail in the studio"
                    imgClassName="aspect-[4/5]"
                    caption="Studio, Refshalevej 8"
                    fig="fig. 01"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Timeline />

      {/* team — index-numbered rows that expand on hover */}
      <section className="relative z-10 border-b border-ink/12 px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHead index="03" label="Who You Will Meet" />
          <div className="mt-14 border-t border-ink/12">
            {TEAM.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.07 }}
                className="group grid grid-cols-12 items-baseline gap-4 border-b border-ink/12 py-7"
                data-hover
              >
                <span className="col-span-2 font-sans text-[11px] tracking-[0.28em] text-clay md:col-span-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="col-span-10 font-display text-2xl text-ink transition-transform duration-500 group-hover:translate-x-2 md:col-span-4 md:text-3xl">
                  {m.name}
                </span>
                <span className="col-span-5 col-start-3 text-[10px] uppercase tracking-[0.24em] text-graphite md:col-span-3 md:col-start-auto">
                  {m.role}
                </span>
                <span className="col-span-7 text-sm leading-relaxed text-graphite md:col-span-4">
                  {m.note}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* values as a 2×2 field */}
      <section className="relative z-10 px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHead index="04" label="Working Rules" />
          <div className="mt-14 grid gap-px border border-ink/12 bg-ink/12 md:grid-cols-2">
            {VALUES.map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="group bg-paper p-8 transition-colors duration-500 hover:bg-chalk md:p-12"
              >
                <span className="font-sans text-[11px] tracking-[0.28em] text-clay">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 font-display text-3xl text-ink">{t}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-graphite">{d}</p>
              </motion.div>
            ))}
          </div>

          <Reveal delay={0.15} className="mt-16">
            <dl className="grid grid-cols-2 gap-8 border-t border-ink/12 pt-10 md:grid-cols-4">
              {([[41, 'Built'], [16, 'Years'], [9, 'Awards'], [4, 'Countries']] as [number, string][]).map(
                ([v, l]) => (
                  <div key={l}>
                    <dd>
                      <Counter value={v} className="font-display text-4xl text-ink md:text-5xl" />
                    </dd>
                    <dt className="mt-2 text-[10px] uppercase tracking-[0.26em] text-graphite">{l}</dt>
                  </div>
                )
              )}
            </dl>
          </Reveal>
        </div>
      </section>
    </>
  )
}

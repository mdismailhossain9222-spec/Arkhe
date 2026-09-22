import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Massing from '../components/three/Massing'
import { EASE, InkButton, PageMasthead, Reveal, SectionHead } from '../components/shared'
import { useRouter } from '../router'
import { cn } from '../utils/cn'

const STAGES = [
  {
    no: '01',
    name: 'Listening',
    weeks: '2–4 weeks',
    lead: 'We visit the site before we draw anything.',
    body: 'A first conversation, a walk of the site at two different hours, and a written brief we agree together. You receive a fee proposal and a programme — no drawings yet, and no charge for this stage.',
    outputs: ['Site appraisal', 'Written brief', 'Fee & programme'],
  },
  {
    no: '02',
    name: 'Massing',
    weeks: '4–8 weeks',
    lead: 'Volumes in card and timber, long before pixels.',
    body: 'Two or three distinct options are built at 1:200 and tested in raking light. We work in section to settle height, daylight and the sequence of rooms. One option is chosen and developed.',
    outputs: ['Physical models', 'Section studies', 'Concept pack'],
  },
  {
    no: '03',
    name: 'Definition',
    weeks: '10–16 weeks',
    lead: 'Every junction drawn by the people who designed it.',
    body: 'Planning drawings, the material palette fixed to five, and a full set of technical details. Structural and services engineers join the table. Costs are tested against the budget twice.',
    outputs: ['Planning set', 'Material palette', 'Cost plan'],
  },
  {
    no: '04',
    name: 'Making',
    weeks: '12–24 months',
    lead: 'A partner on site, every fortnight, until handover.',
    body: 'Tender, contractor selection and construction. We inspect, answer queries, and defend the details. Snagging is ours, not yours, and we return after a year to see how the building has settled.',
    outputs: ['Site inspections', 'Handover file', '12-month review'],
  },
]

export default function Process() {
  const { navigate } = useRouter()
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 0.6', 'end 0.7'] })
  const bar = useSpring(scrollYProgress, { stiffness: 80, damping: 24 })

  /* observe which stage is centred */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-stage]'))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.stage))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <PageMasthead
        no="03"
        label="How We Work"
        title="From brief"
        accent="to keys"
        sub="Four stages, roughly two years. The first one is free and often the most useful."
        meta={[
          ['Stages', '04'],
          ['Typical span', '18–30 mo'],
          ['Partner-led', '100%'],
        ]}
      />

      {/* interactive model — the massing you can pull apart */}
      <section className="relative z-10 border-b border-ink/12 px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-5">
              <SectionHead index="00" label="The Study Model" />
              <Reveal delay={0.1}>
                <h2 className="mt-8 font-display text-4xl leading-tight text-ink md:text-5xl">
                  Pull it apart.
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-relaxed text-graphite md:text-base">
                  This is how every project begins in our workshop — stacked volumes tested
                  against the sun. Drag to orbit, and use the slider to separate the masses
                  the way we do on the bench.
                </p>
              </Reveal>
            </div>
            <div className="md:col-span-7">
              <Reveal delay={0.15}>
                <div className="overflow-hidden border border-ink/12 bg-chalk">
                  <Massing interactive className="h-[48vh] min-h-[340px] w-full md:h-[56vh]" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* stage tracker */}
      <section className="relative z-10 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-12 md:gap-16">
          {/* sticky index */}
          <aside className="md:col-span-4">
            <div className="sticky top-28">
              <SectionHead index="01" label="Stages" />
              <div className="relative mt-8 pl-6">
                <span className="absolute left-0 top-0 h-full w-px bg-ink/12" />
                <motion.span
                  style={{ scaleY: bar }}
                  className="absolute left-0 top-0 h-full w-px origin-top bg-clay"
                />
                <ul className="space-y-5">
                  {STAGES.map((s, i) => (
                    <li key={s.no}>
                      <button
                        onClick={() =>
                          document
                            .querySelector(`[data-stage="${i}"]`)
                            ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }
                        className="group flex items-baseline gap-4 text-left"
                      >
                        <span
                          className={cn(
                            'font-sans text-[10px] tracking-[0.26em] transition-colors',
                            active === i ? 'text-clay' : 'text-graphite/60'
                          )}
                        >
                          {s.no}
                        </span>
                        <span
                          className={cn(
                            'font-display text-2xl transition-all duration-500',
                            active === i
                              ? 'translate-x-1 text-ink'
                              : 'text-graphite/50 group-hover:text-graphite'
                          )}
                        >
                          {s.name}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* stage detail */}
          <div ref={trackRef} className="md:col-span-8">
            {STAGES.map((s, i) => (
              <motion.article
                key={s.no}
                data-stage={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.9, ease: EASE }}
                className="border-t border-ink/12 py-14 first:border-t-0 first:pt-0 md:py-20"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <span className="font-display text-[12vw] leading-none text-ink/10 md:text-[7rem]">
                    {s.no}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.26em] text-graphite">
                    {s.weeks}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-4xl text-ink md:text-5xl">{s.name}</h3>
                <p className="mt-6 max-w-xl font-display text-2xl italic leading-snug text-clay md:text-3xl">
                  {s.lead}
                </p>
                <p className="mt-6 max-w-xl text-sm leading-relaxed text-graphite md:text-base">
                  {s.body}
                </p>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {s.outputs.map((o) => (
                    <li
                      key={o}
                      className="border border-ink/20 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-graphite"
                    >
                      {o}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden border-t border-ink/12 px-6 py-24 text-center md:px-10 md:py-32">
        <div className="blueprint absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-2xl">
          <Reveal>
            <p className="font-display text-3xl leading-snug text-ink md:text-5xl">
              Stage one costs nothing and takes an afternoon.
            </p>
            <div className="mt-10 flex justify-center">
              <InkButton label="Book a first conversation" onClick={() => navigate('contact')} className="px-10 py-5" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

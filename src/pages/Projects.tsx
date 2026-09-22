import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutGrid, Rows3 } from 'lucide-react'
import { EASE, LinkArrow, PageMasthead, Plate, Reveal } from '../components/shared'
import { PROJECTS } from '../data'
import type { Project } from '../data'
import { useRouter } from '../router'
import { cn } from '../utils/cn'

const FILTERS = ['All', 'Residential', 'Cultural', 'Workplace', 'Interior'] as const
type Filter = (typeof FILTERS)[number]

/* ---- grid card ---- */
function Card({ p, i }: { p: Project; i: number }) {
  const { navigate } = useRouter()
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.6, ease: EASE, delay: (i % 3) * 0.07 }}
      className="group"
      data-hover
    >
      <button onClick={() => navigate('contact')} className="block w-full text-left">
        <div className="relative overflow-hidden bg-ink/5">
          <img
            src={p.image}
            alt={p.title}
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
          />
          {/* corner index that slides in */}
          <span className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center bg-paper font-sans text-[10px] tracking-[0.2em] text-clay">
            {p.no}
          </span>
          <span className="absolute inset-x-0 bottom-0 translate-y-full bg-paper/95 px-4 py-3 text-[10px] uppercase tracking-[0.24em] text-ink transition-transform duration-500 ease-out group-hover:translate-y-0">
            {p.status} — {p.area}
          </span>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl text-ink transition-colors group-hover:text-clay">
            {p.title}
          </h3>
          <span className="shrink-0 text-[10px] uppercase tracking-[0.24em] text-graphite">{p.year}</span>
        </div>
        <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-graphite">{p.place}</p>
      </button>
    </motion.article>
  )
}

/* ---- list row with hover preview ---- */
function Row({ p, i }: { p: Project; i: number }) {
  const { navigate } = useRouter()
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
      onClick={() => navigate('contact')}
      className="group relative grid w-full grid-cols-12 items-center gap-4 border-b border-ink/12 py-6 text-left"
      data-hover
    >
      <span className="col-span-2 font-sans text-[11px] tracking-[0.28em] text-clay md:col-span-1">
        {p.no}
      </span>
      <span className="col-span-10 font-display text-2xl text-ink transition-transform duration-500 group-hover:translate-x-2 md:col-span-4 md:text-3xl">
        {p.title}
      </span>
      <span className="col-span-5 col-start-3 text-[10px] uppercase tracking-[0.24em] text-graphite md:col-span-3 md:col-start-auto">
        {p.place}
      </span>
      <span className="col-span-3 text-[10px] uppercase tracking-[0.24em] text-graphite md:col-span-2">
        {p.type}
      </span>
      <span className="col-span-4 text-right text-[10px] uppercase tracking-[0.24em] text-graphite md:col-span-2">
        {p.year}
      </span>

      {/* floating preview on hover (desktop) */}
      <span className="pointer-events-none absolute right-28 top-1/2 z-20 hidden h-0 w-40 -translate-y-1/2 overflow-hidden opacity-0 transition-all duration-500 group-hover:h-28 group-hover:opacity-100 lg:block">
        <img src={p.image} alt="" className="h-28 w-40 object-cover" loading="lazy" />
      </span>
    </motion.button>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('All')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const shown = useMemo(
    () => (filter === 'All' ? PROJECTS : PROJECTS.filter((p) => p.type === filter)),
    [filter]
  )

  return (
    <>
      <PageMasthead
        no="01"
        label="Selected Works"
        title="Built"
        accent="work"
        sub="Forty-one completed buildings and interiors since 2009. Six shown here, arranged by the year they were handed over."
        meta={[
          ['Completed', '41'],
          ['On site', '03'],
          ['Countries', '04'],
        ]}
      />

      {/* controls */}
      <div className="sticky top-[62px] z-20 border-b border-ink/12 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3.5 md:px-10">
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'relative px-4 py-2 text-[10px] font-medium uppercase tracking-[0.24em] transition-colors duration-300',
                  filter === f ? 'text-paper' : 'text-graphite hover:text-ink'
                )}
              >
                {filter === f && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 bg-ink"
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                )}
                <span className="relative">{f}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="mr-3 text-[10px] uppercase tracking-[0.24em] text-graphite">
              {String(shown.length).padStart(2, '0')} works
            </span>
            {([['grid', LayoutGrid], ['list', Rows3]] as const).map(([v, Icon]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-label={`${v} view`}
                className={cn(
                  'grid h-9 w-9 place-items-center border transition-colors',
                  view === v ? 'border-ink bg-ink text-paper' : 'border-ink/20 text-graphite hover:border-ink'
                )}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="relative z-10 px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          {view === 'grid' ? (
            <motion.div layout className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {shown.map((p, i) => (
                  <Card key={p.id} p={p} i={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div layout className="border-t border-ink/12">
              <AnimatePresence mode="popLayout">
                {shown.map((p, i) => (
                  <Row key={p.id} p={p} i={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* a single full-bleed plate to break the rhythm */}
      <section className="relative z-10 border-y border-ink/12">
        <Plate
          src={PROJECTS[2].image}
          alt="Refshale Works"
          imgClassName="aspect-[16/9] md:aspect-[21/9]"
        />
        <div className="mx-auto flex max-w-7xl flex-wrap items-baseline justify-between gap-4 px-6 py-5 md:px-10">
          <span className="text-[10px] uppercase tracking-[0.26em] text-graphite">
            Refshale Works — shipyard hall, Copenhagen
          </span>
          <span className="font-display text-sm italic text-clay">fig. 03</span>
        </div>
      </section>

      <section className="relative z-10 px-6 py-24 text-center md:px-10">
        <Reveal>
          <p className="mx-auto max-w-lg font-display text-3xl leading-snug text-ink md:text-4xl">
            Drawings, models and photographs for each project are available on request.
          </p>
          <div className="mt-8 flex justify-center">
            <LinkArrow label="Request the full portfolio" onClick={() => undefined} />
          </div>
        </Reveal>
      </section>
    </>
  )
}

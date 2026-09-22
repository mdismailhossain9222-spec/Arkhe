import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import { EASE, PageMasthead, Plate, Reveal, SectionHead } from '../components/shared'
import { POSTS } from '../data'
import { IMG } from '../media'

export default function Journal() {
  const [open, setOpen] = useState<string | null>(POSTS[0].no)
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/\S+@\S+\.\S+/.test(email)) return setErr('Enter a valid email address.')
    setErr(null)
    setDone(true)
  }

  return (
    <>
      <PageMasthead
        no="05"
        label="Writing & Research"
        title="The"
        accent="journal"
        sub="Essays, field notes and research from the studio. Published when there is something worth saying."
        meta={[
          ['Entries', '38'],
          ['Since', '2013'],
        ]}
      />

      {/* featured essay */}
      <section className="relative z-10 border-b border-ink/12 px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-7">
            <Plate src={IMG.concreteWall} alt="Concrete wall study" imgClassName="aspect-[16/10]" />
          </div>
          <div className="md:col-span-5">
            <SectionHead index="00" label="Featured" />
            <Reveal delay={0.1}>
              <h2 className="mt-8 font-display text-4xl leading-tight text-ink md:text-5xl">
                On the weight of a wall
              </h2>
              <p className="mt-4 text-[10px] uppercase tracking-[0.26em] text-graphite">
                Essay — Feb 2026 — 6 min
              </p>
              <p className="mt-6 text-sm leading-relaxed text-graphite md:text-base">
                Thickness is not nostalgia. A 400 mm wall changes how a window is made, how
                sound behaves in a room, and how long warmth stays after the heating goes
                off. We measured four of our own buildings to find out how much.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* entries — accordion reader */}
      <section className="relative z-10 border-b border-ink/12 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-5xl">
          <SectionHead index="01" label="All Entries" />
          <div className="mt-12 border-t border-ink/12">
            {POSTS.map((p) => {
              const isOpen = open === p.no
              return (
                <div key={p.no} className="border-b border-ink/12">
                  <button
                    onClick={() => setOpen(isOpen ? null : p.no)}
                    aria-expanded={isOpen}
                    className="group grid w-full grid-cols-12 items-baseline gap-4 py-7 text-left"
                  >
                    <span className="col-span-2 font-sans text-[11px] tracking-[0.28em] text-clay md:col-span-1">
                      {p.no}
                    </span>
                    <span
                      className={`col-span-8 font-display text-2xl transition-all duration-500 md:col-span-6 md:text-3xl ${
                        isOpen ? 'text-clay' : 'text-ink group-hover:translate-x-2'
                      }`}
                    >
                      {p.title}
                    </span>
                    <span className="col-span-6 col-start-3 text-[10px] uppercase tracking-[0.24em] text-graphite md:col-span-2 md:col-start-auto">
                      {p.kicker}
                    </span>
                    <span className="col-span-4 text-[10px] uppercase tracking-[0.24em] text-graphite md:col-span-2">
                      {p.date}
                    </span>
                    <span className="col-span-2 flex justify-end md:col-span-1">
                      <span
                        className={`grid h-8 w-8 place-items-center border transition-colors ${
                          isOpen ? 'border-clay text-clay' : 'border-ink/20 text-graphite'
                        }`}
                      >
                        {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                      </span>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-8 pb-10 md:grid-cols-12">
                          <p className="md:col-span-7 md:col-start-2 text-base leading-relaxed text-graphite md:text-lg">
                            {p.body}
                          </p>
                          <p className="md:col-span-3 text-[10px] uppercase tracking-[0.24em] text-graphite">
                            {p.read} read
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* subscribe */}
      <section className="relative z-10 overflow-hidden px-6 py-24 md:px-10 md:py-32">
        <div className="blueprint absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="font-display text-3xl leading-snug text-ink md:text-5xl">
              Four letters a year. <span className="italic text-clay">Nothing else.</span>
            </p>
            <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-graphite">
              New writing, finished buildings and the occasional drawing we are pleased
              with. No announcements, no newsletters about newsletters.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-10">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.p
                  key="ok"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-2xl italic text-clay"
                >
                  Thank you — we&apos;ll write in the spring.
                </motion.p>
              ) : (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={subscribe}
                  className="mx-auto flex max-w-md items-end gap-4"
                  noValidate
                >
                  <label className="flex-1 text-left">
                    <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-graphite">
                      Email
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@studio.com"
                      className="w-full border-b border-ink/25 bg-transparent py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-graphite/60 focus:border-clay"
                    />
                  </label>
                  <button
                    type="submit"
                    className="group relative overflow-hidden bg-ink px-7 py-3 text-[10px] font-medium uppercase tracking-[0.26em] text-paper"
                  >
                    <span className="absolute inset-0 origin-left scale-x-0 bg-clay transition-transform duration-500 ease-out group-hover:scale-x-100" />
                    <span className="relative">Subscribe</span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
            {err && <p className="mt-3 text-xs italic text-clay">{err}</p>}
          </Reveal>
        </div>
      </section>
    </>
  )
}

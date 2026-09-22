import { useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, Loader2 } from 'lucide-react'
import { EASE, PageMasthead, Reveal, SectionHead } from '../components/shared'
import { useAuth } from '../auth'
import { cn } from '../utils/cn'

const API_URL = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL

const KINDS = ['New build', 'Extension', 'Interior', 'Adaptive reuse', 'Something else']
const BUDGETS = ['Under €500k', '€500k – €1.5m', '€1.5m – €4m', 'Above €4m', 'Not yet known']
const TIMES = ['Within 6 months', '6–12 months', '12–24 months', 'Exploring']

const field =
  'w-full border-b border-ink/25 bg-transparent py-3 text-sm text-ink outline-none transition-colors placeholder:text-graphite/60 focus:border-clay'
const label = 'mb-2 block text-[10px] uppercase tracking-[0.28em] text-graphite'

const STEPS = ['Project', 'Scope', 'You', 'Review']

type Data = {
  kind: string
  place: string
  budget: string
  timing: string
  name: string
  email: string
  note: string
}

export default function Contact() {
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [tried, setTried] = useState(false)
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [ref, setRef] = useState('')
  const [honey, setHoney] = useState('')
  const [d, setD] = useState<Data>({
    kind: 'New build',
    place: '',
    budget: '€500k – €1.5m',
    timing: '6–12 months',
    name: user?.name ?? '',
    email: user?.email ?? '',
    note: '',
  })

  const set = <K extends keyof Data>(k: K, v: Data[K]) => setD((s) => ({ ...s, [k]: v }))

  const ok =
    step === 0
      ? d.place.trim().length > 1
      : step === 1
        ? true
        : step === 2
          ? d.name.trim().length > 1 && /\S+@\S+\.\S+/.test(d.email)
          : true

  const next = () => {
    if (!ok) return setTried(true)
    setTried(false)
    setStep((s) => Math.min(3, s + 1))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const id = `ARK-${Math.floor(1000 + Math.random() * 9000)}`
    try {
      if (honey) {
        /* bot — accept silently, store nothing */
      } else if (API_URL) {
        await fetch(`${API_URL}/api/enquiries`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(d),
        })
      } else {
        await new Promise((r) => setTimeout(r, 1200))
        const all = JSON.parse(localStorage.getItem('arkhe.enquiries.v1') ?? '[]') as unknown[]
        all.push({ id, ...d, createdAt: Date.now() })
        localStorage.setItem('arkhe.enquiries.v1', JSON.stringify(all))
      }
    } catch {
      /* fall through to confirmation — the studio also lists a direct email */
    }
    setRef(id)
    setBusy(false)
    setSent(true)
  }

  return (
    <>
      <PageMasthead
        no="06"
        label="Enquiries"
        title="Tell us about"
        accent="the site"
        sub="Four questions, two minutes. A partner reads every enquiry and replies within three working days."
        meta={[
          ['Reply within', '3 days'],
          ['First stage', 'Free'],
          ['Taking', '2027 work'],
        ]}
      />

      <section className="relative z-10 px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-12 lg:gap-20">
          {/* studio details */}
          <div className="lg:col-span-4">
            <SectionHead index="01" label="Direct" />
            <Reveal delay={0.1} className="mt-8 space-y-8">
              {[
                ['Studio', 'Refshalevej 8\n1432 Copenhagen K\nDenmark'],
                ['Email', 'hello@arkhe.studio'],
                ['Telephone', '+45 32 11 04 88'],
                ['Hours', 'Mon – Thu, 09:00 – 17:00\nFridays on site'],
              ].map(([k, v]) => (
                <div key={k} className="border-t border-ink/12 pt-5">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-graphite">{k}</span>
                  <p className="mt-2 whitespace-pre-line font-display text-xl leading-snug text-ink">
                    {v}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>

          {/* brief builder */}
          <div className="lg:col-span-8">
            <div className="border border-ink/12 bg-chalk p-7 md:p-12">
              {!sent && (
                <>
                  <div className="flex items-center justify-between">
                    {STEPS.map((s, i) => (
                      <div key={s} className="flex flex-1 items-center gap-3">
                        <span
                          className={cn(
                            'grid h-8 w-8 shrink-0 place-items-center border text-[10px] transition-colors duration-500',
                            i < step
                              ? 'border-clay bg-clay text-paper'
                              : i === step
                                ? 'border-ink text-ink'
                                : 'border-ink/20 text-graphite/60'
                          )}
                        >
                          {i < step ? <Check size={12} /> : String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={cn(
                            'hidden text-[10px] uppercase tracking-[0.24em] transition-colors sm:block',
                            i <= step ? 'text-ink' : 'text-graphite/50'
                          )}
                        >
                          {s}
                        </span>
                        {i < STEPS.length - 1 && (
                          <span className="mx-2 hidden h-px flex-1 bg-ink/15 sm:block" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 h-px w-full bg-ink/12">
                    <motion.div
                      className="h-px bg-clay"
                      animate={{ width: `${(step / 3) * 100}%` }}
                      transition={{ duration: 0.6, ease: EASE }}
                    />
                  </div>
                </>
              )}

              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="flex min-h-[340px] flex-col items-center justify-center text-center"
                  >
                    <span className="grid h-14 w-14 place-items-center border border-clay text-clay">
                      <Check size={24} />
                    </span>
                    <h3 className="mt-8 font-display text-4xl text-ink">Enquiry received</h3>
                    <p className="mt-3 font-display text-2xl italic text-clay">{ref}</p>
                    <p className="mt-5 max-w-sm text-sm leading-relaxed text-graphite">
                      Thank you, {d.name.split(' ')[0]}. A partner will read this and reply
                      to {d.email} within three working days.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -28 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="mt-12"
                  >
                    {step === 0 && (
                      <>
                        <h3 className="font-display text-3xl text-ink">What are you building?</h3>
                        <div className="mt-9 flex flex-wrap gap-2">
                          {KINDS.map((k) => (
                            <button
                              key={k}
                              onClick={() => set('kind', k)}
                              className={cn(
                                'border px-5 py-3 text-[10px] font-medium uppercase tracking-[0.24em] transition-colors',
                                d.kind === k
                                  ? 'border-ink bg-ink text-paper'
                                  : 'border-ink/20 text-graphite hover:border-ink hover:text-ink'
                              )}
                            >
                              {k}
                            </button>
                          ))}
                        </div>
                        <div className="mt-10">
                          <label htmlFor="c-place" className={label}>Where is the site?</label>
                          <input
                            id="c-place"
                            value={d.place}
                            onChange={(e) => set('place', e.target.value)}
                            placeholder="Town, region or address"
                            className={field}
                          />
                          {tried && !ok && (
                            <p className="mt-2 text-xs italic text-clay">
                              A town or region is enough to begin.
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {step === 1 && (
                      <>
                        <h3 className="font-display text-3xl text-ink">Scope and timing</h3>
                        <div className="mt-9 space-y-9">
                          <div>
                            <span className={label}>Indicative budget</span>
                            <div className="flex flex-wrap gap-2">
                              {BUDGETS.map((b) => (
                                <button
                                  key={b}
                                  onClick={() => set('budget', b)}
                                  className={cn(
                                    'border px-5 py-3 text-[10px] font-medium uppercase tracking-[0.24em] transition-colors',
                                    d.budget === b
                                      ? 'border-ink bg-ink text-paper'
                                      : 'border-ink/20 text-graphite hover:border-ink hover:text-ink'
                                  )}
                                >
                                  {b}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className={label}>Hoping to start</span>
                            <div className="flex flex-wrap gap-2">
                              {TIMES.map((t) => (
                                <button
                                  key={t}
                                  onClick={() => set('timing', t)}
                                  className={cn(
                                    'border px-5 py-3 text-[10px] font-medium uppercase tracking-[0.24em] transition-colors',
                                    d.timing === t
                                      ? 'border-ink bg-ink text-paper'
                                      : 'border-ink/20 text-graphite hover:border-ink hover:text-ink'
                                  )}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <h3 className="font-display text-3xl text-ink">And you</h3>
                        {/* honeypot */}
                        <div className="hidden" aria-hidden="true">
                          <label htmlFor="c-company">Company</label>
                          <input id="c-company" value={honey} onChange={(e) => setHoney(e.target.value)} tabIndex={-1} autoComplete="off" />
                        </div>
                        <div className="mt-9 grid gap-9 sm:grid-cols-2">
                          <div>
                            <label htmlFor="c-name" className={label}>Name</label>
                            <input id="c-name" value={d.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" placeholder="Your name" className={field} />
                            {tried && d.name.trim().length < 2 && (
                              <p className="mt-2 text-xs italic text-clay">Please tell us your name.</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="c-email" className={label}>Email</label>
                            <input id="c-email" type="email" value={d.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" placeholder="you@email.com" className={field} />
                            {tried && !/\S+@\S+\.\S+/.test(d.email) && (
                              <p className="mt-2 text-xs italic text-clay">A valid email, so we can reply.</p>
                            )}
                          </div>
                          <div className="sm:col-span-2">
                            <label htmlFor="c-note" className={label}>Anything else</label>
                            <textarea
                              id="c-note"
                              rows={3}
                              value={d.note}
                              onChange={(e) => set('note', e.target.value)}
                              placeholder="The site, the brief, or the suspicion that started this"
                              className={`${field} resize-none`}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <h3 className="font-display text-3xl text-ink">One last look</h3>
                        <dl className="mt-9 border-t border-ink/12">
                          {[
                            ['Project', d.kind],
                            ['Site', d.place],
                            ['Budget', d.budget],
                            ['Timing', d.timing],
                            ['Name', d.name],
                            ['Email', d.email],
                            ...(d.note.trim() ? [['Notes', d.note]] : []),
                          ].map(([k, v]) => (
                            <div key={k} className="flex items-baseline justify-between gap-6 border-b border-ink/12 py-3.5">
                              <dt className="text-[10px] uppercase tracking-[0.24em] text-graphite">{k}</dt>
                              <dd className="text-right font-display text-lg text-ink">{v}</dd>
                            </div>
                          ))}
                        </dl>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {!sent && (
                <div className="mt-12 flex items-center justify-between gap-4">
                  <button
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    className={cn(
                      'flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.26em] transition-colors',
                      step === 0 ? 'pointer-events-none opacity-0' : 'text-graphite hover:text-ink'
                    )}
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  {step < 3 ? (
                    <button
                      onClick={next}
                      className="group relative overflow-hidden bg-ink px-10 py-4 text-[10px] font-medium uppercase tracking-[0.28em] text-paper"
                    >
                      <span className="absolute inset-0 origin-left scale-x-0 bg-clay transition-transform duration-500 ease-out group-hover:scale-x-100" />
                      <span className="relative">Continue</span>
                    </button>
                  ) : (
                    <button
                      onClick={submit}
                      disabled={busy}
                      className="flex items-center gap-3 bg-clay px-10 py-4 text-[10px] font-medium uppercase tracking-[0.28em] text-paper transition-opacity disabled:opacity-60"
                    >
                      {busy && <Loader2 size={14} className="animate-spin" />}
                      {busy ? 'Sending' : 'Send enquiry'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  Check,
  Download,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react'
import { AuthError, DEMO_EMAIL, DEMO_PASSWORD, useAuth } from '../auth'
import { EASE, PageMasthead, Reveal, SectionHead } from '../components/shared'
import { IMG } from '../media'
import { cn } from '../utils/cn'

const field =
  'w-full border-b border-ink/25 bg-transparent py-3 pl-8 text-sm text-ink outline-none transition-colors placeholder:text-graphite/60 focus:border-clay'
const label = 'mb-1 block text-[10px] uppercase tracking-[0.28em] text-graphite'

/* what a signed-in client sees */
const FILES = [
  ['A-100', 'General arrangement — plans', 'Issued 12 Feb 2026', 'PDF · 4.2 MB'],
  ['A-210', 'Sections AA & BB', 'Issued 12 Feb 2026', 'PDF · 2.8 MB'],
  ['A-450', 'Joinery details, kitchen', 'Issued 04 Feb 2026', 'PDF · 1.6 MB'],
  ['S-001', 'Structural scheme', 'Issued 28 Jan 2026', 'PDF · 3.1 MB'],
  ['M-010', 'Material schedule, rev C', 'Issued 21 Jan 2026', 'XLSX · 240 KB'],
]

const MILESTONES = [
  ['Listening', 'Complete'],
  ['Massing', 'Complete'],
  ['Definition', 'In progress'],
  ['Making', 'Not started'],
]

function strength(pw: string) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

export default function Portal() {
  const { user, login, register, logout, backend } = useAuth()
  const [mode, setMode] = useState<'signin' | 'join'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<{ msg: string; retry?: number } | null>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!err?.retry) return
    setCount(err.retry)
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          window.clearInterval(id)
          setErr(null)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [err])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setErr(null)
    setBusy(true)
    try {
      if (mode === 'signin') await login(email, pw)
      else await register(name, email, pw)
    } catch (e2) {
      if (e2 instanceof AuthError) setErr({ msg: e2.message, retry: e2.retryAfter })
      else setErr({ msg: 'Something went wrong. Please try again.' })
    } finally {
      setBusy(false)
    }
  }

  /* ---------- signed in: the project room ---------- */
  if (user) {
    return (
      <>
        <PageMasthead
          no="07"
          label={`Signed in — ${user.email}`}
          title="Sund House"
          accent="files"
          sub="Current drawings, the programme and everything issued to date. Files are private to your project."
          meta={[
            ['Stage', '03 / 04'],
            ['Last issue', '12 Feb'],
            ['Documents', '28'],
          ]}
        />

        <section className="relative z-10 px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              <SectionHead index="01" label="Latest Issue" />
              <div className="mt-10 border-t border-ink/12">
                {FILES.map(([code, title, issued, meta], i) => (
                  <motion.div
                    key={code}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
                    className="group grid grid-cols-12 items-center gap-4 border-b border-ink/12 py-5"
                    data-hover
                  >
                    <span className="col-span-3 font-sans text-[11px] tracking-[0.24em] text-clay md:col-span-2">
                      {code}
                    </span>
                    <span className="col-span-9 font-display text-xl text-ink md:col-span-5 md:text-2xl">
                      {title}
                    </span>
                    <span className="col-span-6 col-start-4 text-[10px] uppercase tracking-[0.22em] text-graphite md:col-span-3 md:col-start-auto">
                      {issued}
                    </span>
                    <span className="col-span-4 text-[10px] uppercase tracking-[0.22em] text-graphite md:col-span-1">
                      {meta}
                    </span>
                    <span className="col-span-2 flex justify-end md:col-span-1">
                      <button
                        aria-label={`Download ${code}`}
                        className="grid h-9 w-9 place-items-center border border-ink/20 text-graphite transition-colors group-hover:border-ink group-hover:text-ink"
                      >
                        <Download size={14} />
                      </button>
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-4">
              <SectionHead index="02" label="Programme" />
              <div className="mt-10 border-t border-ink/12">
                {MILESTONES.map(([m, s]) => (
                  <div key={m} className="flex items-center justify-between border-b border-ink/12 py-4">
                    <span className="font-display text-xl text-ink">{m}</span>
                    <span
                      className={cn(
                        'flex items-center gap-2 text-[10px] uppercase tracking-[0.22em]',
                        s === 'Complete' ? 'text-clay' : s === 'In progress' ? 'text-ink' : 'text-graphite/60'
                      )}
                    >
                      {s === 'Complete' && <Check size={12} />}
                      {s}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10 border border-ink/12 bg-chalk p-6">
                <ShieldCheck size={18} className="text-clay" />
                <p className="mt-4 text-sm leading-relaxed text-graphite">
                  This area is protected by an encrypted session that expires after twelve
                  hours. Files are never served to unauthenticated requests.
                </p>
                <button
                  onClick={logout}
                  className="mt-6 border-b border-ink pb-0.5 text-[10px] font-medium uppercase tracking-[0.26em] text-ink transition-colors hover:border-clay hover:text-clay"
                >
                  Sign out
                </button>
              </div>
            </aside>
          </div>
        </section>
      </>
    )
  }

  /* ---------- signed out: the gate ---------- */
  const s = strength(pw)
  return (
    <>
      <PageMasthead
        no="07"
        label="Private Area"
        title="Client"
        accent="portal"
        sub="Drawings, schedules and programme for projects currently on the boards."
      />

      <section className="relative z-10 px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="hidden lg:block">
            <div className="relative overflow-hidden">
              <img
                src={IMG.brownConcrete}
                alt="Concrete facade detail"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
              <span className="absolute left-6 top-6 flex items-center gap-2.5 bg-paper px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-ink">
                <Lock size={12} className="text-clay" /> Authorised access
              </span>
            </div>
          </Reveal>

          <div>
            <SectionHead index="01" label={mode === 'signin' ? 'Sign in' : 'Create access'} />
            <div className="mt-10 border border-ink/12 bg-chalk p-7 md:p-10">
              <div className="mb-9 grid grid-cols-2 border-b border-ink/12">
                {(['signin', 'join'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setErr(null) }}
                    className={cn(
                      'relative pb-4 text-[10px] font-medium uppercase tracking-[0.26em] transition-colors',
                      mode === m ? 'text-ink' : 'text-graphite hover:text-ink'
                    )}
                  >
                    {m === 'signin' ? 'Sign in' : 'Request access'}
                    {mode === m && (
                      <motion.span layoutId="portal-tab" className="absolute -bottom-px left-0 h-px w-full bg-clay" />
                    )}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} noValidate className="space-y-7">
                <AnimatePresence initial={false}>
                  {mode === 'join' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="pb-7">
                        <label htmlFor="p-name" className={label}>Name</label>
                        <div className="relative">
                          <UserIcon size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-graphite" />
                          <input id="p-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your full name" className={field} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label htmlFor="p-email" className={label}>Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-graphite" />
                    <input id="p-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@email.com" className={field} required />
                  </div>
                </div>

                <div>
                  <label htmlFor="p-pw" className={label}>Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-graphite" />
                    <input
                      id="p-pw"
                      type={show ? 'text' : 'password'}
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      placeholder="••••••••"
                      minLength={8}
                      className={`${field} pr-9`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShow((v) => !v)}
                      aria-label={show ? 'Hide password' : 'Show password'}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-graphite transition-colors hover:text-clay"
                    >
                      {show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {mode === 'join' && pw.length > 0 && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex flex-1 gap-1">
                        {[1, 2, 3, 4].map((b) => (
                          <span key={b} className={cn('h-0.5 flex-1 transition-colors duration-500', s >= b ? 'bg-clay' : 'bg-ink/15')} />
                        ))}
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-graphite">
                        {['Too weak', 'Fair', 'Good', 'Strong', 'Very strong'][s]}
                      </span>
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {err && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div role="alert" className="flex items-start gap-3 border border-clay/50 bg-clay/10 px-4 py-3 text-xs text-clay">
                        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                        <span>
                          {err.msg}
                          {count > 0 && <span className="ml-1 font-medium tabular-nums">Retry in {count}s.</span>}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={busy || count > 0}
                  className="group relative w-full overflow-hidden bg-ink py-4 text-[10px] font-medium uppercase tracking-[0.3em] text-paper transition-opacity disabled:opacity-60"
                >
                  <span className="absolute inset-0 origin-left scale-x-0 bg-clay transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  <span className="relative flex items-center justify-center gap-3">
                    {busy && <Loader2 size={14} className="animate-spin" />}
                    {busy ? 'Checking' : count > 0 ? `Locked · ${count}s` : mode === 'signin' ? 'Enter portal' : 'Request access'}
                  </span>
                </button>

                <p className="flex items-start gap-2.5 text-xs leading-relaxed text-graphite">
                  <FileText size={13} className="mt-0.5 shrink-0 text-clay" />
                  {backend ? (
                    <>Protected by httpOnly sessions, rotating tokens and rate limiting.</>
                  ) : (
                    <>
                      Demonstration area — sign in with{' '}
                      <span className="text-ink">{DEMO_EMAIL}</span> /{' '}
                      <span className="text-ink">{DEMO_PASSWORD}</span>. Passwords are stored
                      hashed; five failed attempts lock the form.
                    </>
                  )}
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

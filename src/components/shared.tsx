import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '../utils/cn'

/* Architectural easing — measured, no bounce */
export const EASE: [number, number, number, number] = [0.22, 1, 0.28, 1]
export const DRAW: [number, number, number, number] = [0.65, 0, 0.35, 1]

/* ---------------------------------------------------------------- */
/*  SectionHead — index, drawn rule with end ticks, label            */
/* ---------------------------------------------------------------- */
export function SectionHead({
  index,
  label,
  className,
}: {
  index: string
  label: string
  className?: string
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-12%' }}
      className={cn('flex items-center gap-5', className)}
    >
      <motion.span
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.6, ease: EASE }}
        className="font-sans text-[11px] tracking-[0.3em] text-clay"
      >
        {index}
      </motion.span>
      <div className="relative h-px flex-1 max-w-24 bg-ink/15">
        <motion.span
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
          transition={{ duration: 0.8, ease: DRAW, delay: 0.08 }}
          className="absolute inset-0 origin-left bg-ink/45"
        />
        <span className="absolute -top-1 right-0 h-2 w-px bg-ink/45" />
      </div>
      <motion.span
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
        className="text-[10px] font-medium uppercase tracking-[0.32em] text-graphite"
      >
        {label}
      </motion.span>
    </motion.div>
  )
}

/* ---------------------------------------------------------------- */
/*  LineReveal — headline lines rise behind a mask                   */
/* ---------------------------------------------------------------- */
export function LineReveal({
  lines,
  className,
  delay = 0,
  accentIndex = -1,
}: {
  lines: string[]
  className?: string
  delay?: number
  accentIndex?: number
}) {
  return (
    <h2
      className={cn('font-display leading-[0.98] text-ink', className)}
      aria-label={lines.join(' ')}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            initial={{ y: '106%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-14%' }}
            transition={{ duration: 1, ease: EASE, delay: delay + i * 0.09 }}
            className={cn('block will-change-transform', i === accentIndex && 'italic text-clay')}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h2>
  )
}

/* ---------------------------------------------------------------- */
/*  Reveal — generic fade/rise                                       */
/* ---------------------------------------------------------------- */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 26,
}: {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.85, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ---------------------------------------------------------------- */
/*  Plate — image revealed by a shutter wipe, with parallax          */
/* ---------------------------------------------------------------- */
export function Plate({
  src,
  alt,
  className,
  imgClassName,
  caption,
  fig,
  delay = 0,
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  caption?: string
  fig?: string
  delay?: number
}) {
  return (
    <figure className={className}>
      <div className="relative overflow-hidden bg-ink/5">
        <motion.div
          initial={{ scaleY: 1 }}
          whileInView={{ scaleY: 0 }}
          viewport={{ once: true, margin: '-12%' }}
          transition={{ duration: 0.95, ease: DRAW, delay }}
          className="absolute inset-0 z-10 origin-top bg-paper"
        />
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          initial={{ scale: 1.14 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: '-12%' }}
          transition={{ duration: 1.5, ease: EASE, delay }}
          className={cn('h-full w-full object-cover', imgClassName)}
        />
      </div>
      {(caption || fig) && (
        <figcaption className="mt-3 flex items-baseline justify-between gap-4">
          <span className="text-[10px] uppercase tracking-[0.26em] text-graphite">{caption}</span>
          {fig && <span className="font-display text-sm italic text-clay">{fig}</span>}
        </figcaption>
      )}
    </figure>
  )
}

/* ---------------------------------------------------------------- */
/*  Buttons — architectural: solid ink, or a drawn underline link    */
/* ---------------------------------------------------------------- */
export function InkButton({
  label,
  onClick,
  className,
  tone = 'ink',
}: {
  label: string
  onClick?: () => void
  className?: string
  tone?: 'ink' | 'outline'
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative inline-flex items-center gap-3 overflow-hidden px-8 py-4 text-[11px] font-medium uppercase tracking-[0.28em] transition-colors duration-500',
        tone === 'ink'
          ? 'bg-ink text-paper hover:text-paper'
          : 'border border-ink/25 text-ink hover:border-ink',
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100',
          tone === 'ink' ? 'bg-clay' : 'bg-ink'
        )}
      />
      <span className={cn('relative z-10', tone === 'outline' && 'group-hover:text-paper')}>
        {label}
      </span>
      <ArrowUpRight
        size={14}
        className={cn(
          'relative z-10 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5',
          tone === 'outline' && 'group-hover:text-paper'
        )}
      />
    </button>
  )
}

export function LinkArrow({
  label,
  onClick,
  className,
}: {
  label: string
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.28em] text-ink transition-colors hover:text-clay',
        className
      )}
    >
      <span className="relative pb-1">
        {label}
        <span className="absolute bottom-0 left-0 h-px w-full bg-ink/25" />
        <span className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-clay transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
      </span>
      <ArrowUpRight size={13} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </button>
  )
}

/* ---------------------------------------------------------------- */
/*  Counter                                                          */
/* ---------------------------------------------------------------- */
export function Counter({
  value,
  suffix = '',
  className,
}: {
  value: number
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const spring = useSpring(0, { stiffness: 48, damping: 20 })
  const text = useTransform(spring, (v) => `${Math.round(v)}${suffix}`)
  useEffect(() => {
    if (inView) spring.set(value)
  }, [inView, spring, value])
  return (
    <span ref={ref} className={className}>
      <motion.span>{text}</motion.span>
    </span>
  )
}

/* ---------------------------------------------------------------- */
/*  PageMasthead — page header with index, rule and ghost numeral    */
/* ---------------------------------------------------------------- */
export function PageMasthead({
  no,
  label,
  title,
  accent,
  sub,
  meta = [],
}: {
  no: string
  label: string
  title: string
  accent?: string
  sub?: string
  meta?: [string, string][]
}) {
  return (
    <header className="relative overflow-hidden border-b border-ink/12 px-6 pb-14 pt-32 md:px-10 md:pb-16 md:pt-40">
      {/* ghost numeral */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
        className="rule-text pointer-events-none absolute -right-4 -top-6 select-none font-display text-[26vw] leading-none md:-top-14"
      >
        {no}
      </motion.span>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          className="flex items-center gap-5"
        >
          <span className="font-sans text-[11px] tracking-[0.3em] text-clay">{no}</span>
          <span className="h-px w-16 bg-ink/30" />
          <span className="text-[10px] font-medium uppercase tracking-[0.34em] text-graphite">
            {label}
          </span>
        </motion.div>

        <h1 className="mt-8 font-display text-[clamp(3.2rem,10vw,8.5rem)] leading-[0.92] text-ink">
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span
              initial={{ y: '106%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
              className="block"
            >
              {title}
              {accent && <span className="italic text-clay"> {accent}</span>}
            </motion.span>
          </span>
        </h1>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
          {sub && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
              className="max-w-md text-sm leading-relaxed text-graphite md:text-base"
            >
              {sub}
            </motion.p>
          )}
          {meta.length > 0 && (
            <motion.dl
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.65 }}
              className="flex flex-wrap gap-x-12 gap-y-4"
            >
              {meta.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10px] uppercase tracking-[0.26em] text-graphite">{k}</dt>
                  <dd className="mt-1 font-display text-2xl text-ink">{v}</dd>
                </div>
              ))}
            </motion.dl>
          )}
        </div>
      </div>
    </header>
  )
}

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';

const STEPS = [
  {
    n: '01',
    label: 'Upload',
    desc: 'Drop a PNG or JPEG of any screen — web, mobile, or desktop. No account required.',
  },
  {
    n: '02',
    label: 'Analyze',
    desc: 'AI scans for accessibility violations, hierarchy conflicts, and copy weaknesses. Results arrive in seconds.',
  },
  {
    n: '03',
    label: 'Collaborate',
    desc: 'Your team threads comments by finding, switches reviewer roles (designer/developer/PM), and exports the full report.',
  },
];

const CHECKS = [
  {
    label: 'Accessibility',
    desc: 'Focus indicators, colour contrast ratios, missing ARIA labels, touch-target sizes, and screen-reader landmark order.',
  },
  {
    label: 'Visual hierarchy',
    desc: 'Competing typographic weights, attention fragmentation, whitespace violations, and mis-aligned grid anchors.',
  },
  {
    label: 'Copy & microcopy',
    desc: 'Passive CTAs, jargon overload, ambiguous error messages, and headline-to-subhead ratios.',
  },
  {
    label: 'Responsive layout',
    desc: 'Breakpoint behaviour, text truncation, image containment, and tap-target crowding at 375 px.',
  },
];

function StepCard({ step, index }: { step: typeof STEPS[number]; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ willChange: 'transform, opacity' }}
      className="flex-1 min-w-0"
    >
      <div className="relative rounded-xl border border-border bg-card p-6 h-full transition-shadow duration-300 hover:shadow-md">
        {/* Accent bar at top */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute top-0 left-4 right-4 h-[2px] bg-indigo origin-left rounded-full"
        />

        <span
          className="font-mono text-2xl font-bold text-indigo/20 select-none"
          aria-hidden="true"
        >
          {step.n}
        </span>
        <div className="mt-3 space-y-2">
          <p className="text-base font-semibold text-foreground">{step.label}</p>
          <p className="text-sm text-muted-foreground leading-[1.6]">{step.desc}</p>
        </div>
      </div>
    </motion.li>
  );
}

const COVERAGE_ACCENTS = [
  'border-l-indigo',
  'border-l-[oklch(60%_0.118_185)]',
  'border-l-[oklch(65%_0.18_330)]',
  'border-l-[oklch(70%_0.16_50)]',
];

function CoverageCard({ item, index }: { item: typeof CHECKS[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ willChange: 'transform, opacity' }}
    >
      <Card className={`h-full border-l-[3px] ${COVERAGE_ACCENTS[index]} transition-shadow duration-300 hover:shadow-md`}>
        <CardContent className="space-y-2">
          <p className="text-sm font-semibold text-foreground">{item.label}</p>
          <p className="text-sm text-muted-foreground leading-[1.65]">{item.desc}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function HowItWorksAndCoverage() {
  return (
    <>
      {/* ── How it works — 3 horizontal steps ──────────────────────────── */}
      <section id="how-it-works" className="space-y-10" aria-label="How it works">
        <div className="space-y-2">
          <p className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-muted-foreground">
            How it works
          </p>
          <h2 className="text-section text-foreground max-w-[32ch]">
            Three steps to actionable feedback.
          </h2>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none p-0" aria-label="Steps">
          {STEPS.map((step, i) => (
            <StepCard key={step.n} step={step} index={i} />
          ))}
        </ol>
      </section>

      {/* ── Coverage — 4 cards ─────────────────────────────────────────── */}
      <section className="space-y-10" aria-label="What DesignSight checks">
        <div className="space-y-2">
          <p className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-muted-foreground">
            Coverage
          </p>
          <h2 className="text-section text-foreground max-w-[28ch]">
            Four lenses, one pass.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CHECKS.map((item, i) => (
            <CoverageCard key={item.label} item={item} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}

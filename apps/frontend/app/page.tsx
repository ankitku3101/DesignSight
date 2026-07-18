/*
 * Hallmark · page: Home · macrostructure: Marquee Hero (03)
 * theme: custom · anchor 255° indigo · enrichment: E-CSS art (Tier A)
 * Pre-emit critique: P5 H5 E5 S5 R4 V5
 */

import { UploadPanel } from "@/components/UploadPanel";
import { RecentScreens } from "@/components/RecentScreens";

/* ── Sample report findings — CSS art (Tier A), no fake browser chrome ─── */
const SAMPLE_FINDINGS = [
  {
    category: "Accessibility",
    tag: "A11Y",
    severity: "high",
    finding: "4 interactive elements have no visible focus indicator.",
    fix: "Add a 2px outline using your brand accent at :focus-visible.",
  },
  {
    category: "Hierarchy",
    tag: "H",
    severity: "medium",
    finding: "Two competing visual weights fight for attention in the hero.",
    fix: "Reduce secondary heading to 1.25× base size; let the h1 lead.",
  },
  {
    category: "Copy",
    tag: "C",
    severity: "low",
    finding: "CTA reads 'Submit' — passive and generic.",
    fix: "Rename to the outcome: 'Get feedback' or 'Analyze now'.",
  },
];

const SEVERITY_STYLES: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  low: "bg-indigo/10 text-indigo-text border-indigo/20",
};

/* ── What it checks — stacked rows, NOT 3-col grid ─────────────────────── */
const CHECKS = [
  {
    label: "Accessibility",
    desc: "Focus indicators, colour contrast ratios, missing ARIA labels, touch-target sizes, and screen-reader landmark order.",
  },
  {
    label: "Visual hierarchy",
    desc: "Competing typographic weights, attention fragmentation, whitespace violations, and mis-aligned grid anchors.",
  },
  {
    label: "Copy & microcopy",
    desc: "Passive CTAs, jargon overload, ambiguous error messages, and headline-to-subhead ratios.",
  },
  {
    label: "Responsive layout",
    desc: "Breakpoint behaviour, text truncation, image containment, and tap-target crowding at 375 px.",
  },
];

export default function Home() {
  return (
    <div className="space-y-24 lg:space-y-32">

      {/* ── Marquee Hero ─────────────────────────────────────────────────── */}
      <section
        className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start pt-4 lg:pt-8"
        aria-label="Product hero"
      >

        {/* Left: hook + CTAs */}
        <div className="space-y-8 lg:pt-2">
          <div className="space-y-5">
            <p className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-muted-foreground">
              AI design review
            </p>
            <h1 className="text-display text-foreground">
              Stop guessing<br className="hidden sm:block" />
              {" "}what&apos;s broken.
            </h1>
            <p className="text-lg leading-[1.65] text-muted-foreground max-w-[48ch]">
              Paste a screenshot — DesignSight surfaces accessibility gaps, hierarchy
              issues, and weak copy in seconds. Your team adds context in threaded
              comments. No back-and-forth, no guesswork.
            </p>
          </div>

          {/* CTAs — primary fill + secondary text link */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#upload"
              className="inline-flex items-center justify-center h-11 px-6 rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-85 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Analyze a screen — it&apos;s free
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              See how it works →
            </a>
          </div>

          {/* Social proof line — honest, no invented metrics */}
          <p className="text-xs text-muted-foreground/70 font-mono tracking-wide">
            Designed for product designers · developers · PMs · founders
          </p>
        </div>

        {/* Right: CSS art — sample report card (Tier A, no fake chrome) */}
        <div className="lg:sticky lg:top-[5.5rem]">
          <figure
            aria-label="Sample AI analysis output"
            className="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
          >
            {/* Report header */}
            <div className="px-4 py-3.5 border-b border-border flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="font-mono text-[0.65rem] text-muted-foreground tracking-wide uppercase">
                  Analysis · checkout-flow-v3.png
                </p>
                <p className="text-xs text-muted-foreground">
                  3 findings · reviewed just now
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-indigo/10 text-indigo-text text-[0.65rem] font-mono font-medium tracking-wide border border-indigo/20">
                AI
              </span>
            </div>

            {/* Finding rows */}
            <ul className="divide-y divide-border" aria-label="Sample findings">
              {SAMPLE_FINDINGS.map((item) => (
                <li key={item.category} className="px-4 py-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center h-5 px-2 rounded text-[0.6rem] font-mono font-medium tracking-wide border ${SEVERITY_STYLES[item.severity]}`}
                    >
                      {item.tag}
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-[1.55]">
                    {item.finding}
                  </p>
                  <p className="text-xs text-muted-foreground leading-[1.55]">
                    Fix: {item.fix}
                  </p>
                </li>
              ))}
            </ul>

            <figcaption className="px-4 py-3 border-t border-border bg-muted/40">
              <p className="text-[0.65rem] text-muted-foreground font-mono">
                Example output — your real results depend on the uploaded screen
              </p>
            </figcaption>
          </figure>
        </div>

      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="space-y-10"
        aria-label="How it works"
      >
        <div className="space-y-2">
          <p className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-muted-foreground">
            How it works
          </p>
          <h2 className="text-section text-foreground max-w-[32ch]">
            From screenshot to actionable feedback in three steps.
          </h2>
        </div>

        <ol className="border-t border-border/60 space-y-0" aria-label="Steps">
          {[
            {
              n: "01",
              label: "Upload",
              desc: "Drop a PNG or JPEG of any screen — web, mobile, or desktop. No account required.",
            },
            {
              n: "02",
              label: "Analyze",
              desc: "AI scans for accessibility violations, hierarchy conflicts, and copy weaknesses. Results arrive in seconds.",
            },
            {
              n: "03",
              label: "Collaborate",
              desc: "Your team threads comments by finding, switches reviewer roles (designer/developer/PM), and exports the full report.",
            },
          ].map((step) => (
            <li
              key={step.n}
              className="grid grid-cols-[3rem_1fr] sm:grid-cols-[4rem_1fr_auto] gap-x-5 gap-y-1 py-5 border-b border-border/40 items-start"
            >
              <span
                className="font-mono text-[0.6rem] text-indigo-text tabular-nums leading-[1.65] mt-[0.1em] select-none"
                aria-hidden="true"
              >
                {step.n}
              </span>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-foreground">{step.label}</p>
                <p className="text-sm text-muted-foreground leading-[1.6]">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── What it checks ────────────────────────────────────────────────── */}
      <section className="space-y-10" aria-label="What DesignSight checks">
        <div className="space-y-2">
          <p className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-muted-foreground">
            Coverage
          </p>
          <h2 className="text-section text-foreground max-w-[28ch]">
            Four lenses, one pass.
          </h2>
        </div>

        {/* Stacked full-width rows — not a 3-col feature grid */}
        <dl className="border-t border-border/60 space-y-0">
          {CHECKS.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-x-10 gap-y-1 py-5 border-b border-border/40"
            >
              <dt className="text-sm font-semibold text-foreground">{item.label}</dt>
              <dd className="text-sm text-muted-foreground leading-[1.65]">{item.desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Upload CTA ────────────────────────────────────────────────────── */}
      <section
        id="upload"
        className="space-y-8"
        aria-label="Upload a screen"
      >
        <div className="space-y-2">
          <p className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-muted-foreground">
            Get started
          </p>
          <h2 className="text-section text-foreground">
            Try it — it&apos;s free.
          </h2>
          <p className="text-sm text-muted-foreground max-w-[52ch] leading-[1.65]">
            No sign-up, no credit card. Upload any screen and get a full AI
            analysis in under 30 seconds.
          </p>
        </div>
        <div className="max-w-2xl">
          <UploadPanel />
        </div>
      </section>

      {/* ── Recent screens ────────────────────────────────────────────────── */}
      <section className="space-y-5" aria-label="Recently analyzed screens">
        <h2 className="font-sans text-sm font-semibold text-muted-foreground">
          Recently analyzed
        </h2>
        <RecentScreens />
      </section>

    </div>
  );
}

/*
 * Hallmark · page: Home · macrostructure: Marquee Hero (03)
 * theme: custom · anchor 255° indigo · enrichment: E-CSS art (Tier A)
 * Pre-emit critique: P5 H5 E5 S5 R4 V5
 */

import { UploadPanel } from "@/components/UploadPanel";
import { RecentScreens } from "@/components/RecentScreens";
import { HowItWorksAndCoverage } from "@/components/HowItWorksAndCoverage";

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
              className="inline-flex items-center justify-center h-11 px-6 rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-85 transition-opacity duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Analyze a screen — it&apos;s free
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
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

      {/* ── Upload CTA — right below hero ─────────────────────────────────── */}
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
        <UploadPanel />
      </section>

      <HowItWorksAndCoverage />

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

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/Providers";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

/*
 * Hallmark · genre: modern-minimal · macrostructure: Marquee Hero · theme: custom
 * vibe: "precise, confident, AI design review" · anchor hue: 255° (indigo)
 * nav: N9 · footer: Ft5 · enrichment: E-CSS art (sample report, Tier A)
 * fonts: Bricolage Grotesque (display 700) + Plus Jakarta Sans (body 400)
 * Pre-emit critique: P5 H5 E5 S5 R4 V5
 */

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DesignSight — AI feedback on your UI",
  description:
    "Upload a screenshot. AI reviews accessibility gaps, layout hierarchy, and copy issues. Your team adds context in threaded comments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${jakarta.variable} ${geistMono.variable}`}
    >
      <body className="antialiased bg-background text-foreground font-sans">
        <Providers>
          <TooltipProvider>
            <div className="min-h-screen flex flex-col page-glow">

              {/* N9 · Minimal two-end · wordmark left · [toggle + CTA] right */}
              <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md backdrop-saturate-150 transition-[border-color,background-color] duration-200 relative">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

                  {/* Left: brand */}
                  <Link
                    href="/"
                    className="flex items-center gap-2.5 shrink-0 group"
                    aria-label="DesignSight home"
                  >
                    <Image
                      src="/logo.png"
                      alt=""
                      width={18}
                      height={18}
                      className="rounded-[3px] flex-shrink-0 transition-opacity duration-150 group-hover:opacity-75"
                      priority
                    />
                    <span className="font-mono text-[0.8rem] font-medium tracking-tight text-foreground transition-colors duration-150 group-hover:text-indigo-text">
                      DesignSight
                    </span>
                  </Link>

                  {/* Right: theme toggle + primary CTA */}
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Link
                      href="#upload"
                      className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-85 transition-opacity duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                    >
                      Upload a screen
                    </Link>
                  </div>

                </div>
              </header>

              {/* Main content */}
              <main className="flex-1 relative z-10">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 lg:py-16">
                  {children}
                </div>
              </main>

              {/* Ft5 · Statement footer · editorial closing line + meta */}
              <footer className="border-t border-border/60 mt-auto relative z-10">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 lg:py-14 space-y-6">
                  <p className="text-section text-foreground max-w-[24ch]">
                    Your best design is the next one.
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/40">
                    <span className="font-mono text-xs text-muted-foreground tracking-tight">
                      DesignSight
                    </span>
                    <span className="text-xs text-muted-foreground">
                      © {new Date().getFullYear()} · AI feedback for designers, developers, and product teams
                    </span>
                  </div>
                </div>
              </footer>

            </div>
          </TooltipProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

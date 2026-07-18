import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DesignSight",
  description: "A collaborative platform for designers and developers to share, review, and provide feedback on design screens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-border/80 bg-background/70 backdrop-blur">
              <div className="mx-auto w-full max-w-6xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-foreground"></div>
                  <span className="font-semibold tracking-tight">DesignSight</span>
                </div>
                <nav className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Link href="/" className="hover:text-foreground transition-colors">Dashboard</Link>
                </nav>
              </div>
            </header>

            {/* Main */}
            <main className="flex-1">
              <div className="mx-auto w-full max-w-6xl px-4 py-8">
                {children}
              </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/80">
              <div className="mx-auto w-full max-w-6xl px-4 py-6 text-xs text-muted-foreground">
                © {new Date().getFullYear()} DesignSight
              </div>
            </footer>
          </div>
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowRight, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Lenis from "lenis";

// Brand funnel logo SVG
function FunnelLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className ?? "size-7"} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="cfLogoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect x="2" y="3" width="24" height="5" rx="2.5" fill="url(#cfLogoGrad)" />
      <rect x="6" y="11.5" width="16" height="5" rx="2.5" fill="url(#cfLogoGrad)" />
      <rect x="10" y="20" width="8" height="5" rx="2.5" fill="url(#cfLogoGrad)" />
    </svg>
  );
}

interface MarketingLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function MarketingLayout({ children, title, description }: MarketingLayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Set document title + meta description dynamically
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", description);
    }
  }, [title, description]);

  // Initialize Lenis smooth scrolling (marketing pages only)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Navbar scroll shadow
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: "Product", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ];

  return (
    <div className="theme-marketing min-h-screen bg-background text-foreground flex flex-col selection:bg-blue-100 selection:text-blue-800">
      {/* Announcement Strip */}
      <div
        className="relative z-50 py-2.5 text-center text-xs font-medium overflow-hidden"
        style={{ background: "linear-gradient(90deg, #0B1426 0%, #1A2744 50%, #0B1426 100%)" }}
      >
        <span className="text-white/70">New:</span>
        <Link
          href="/how-it-works"
          className="ml-1.5 text-white font-semibold underline underline-offset-2 hover:text-blue-300 transition-colors"
        >
          Validation Harness v2 — test ATS rules before they touch your pipeline →
        </Link>
      </div>

      {/* Floating Navbar */}
      <header
        className={`sticky top-0 left-0 right-0 z-40 px-4 md:px-6 py-3 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm shadow-black/5 border-b border-border"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <FunnelLogo />
            <span
              className="font-bold text-lg tracking-tight"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
            >
              ClearFunnel
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location === link.href ? "text-blue-600" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTAs + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/app/dashboard"
              className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Button
              asChild
              className="hidden sm:inline-flex rounded-full font-semibold px-5 h-9 text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all"
            >
              <Link href="/app/dashboard">Open Dashboard</Link>
            </Button>
            <button
              className="md:hidden p-2 text-foreground rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-white flex flex-col pt-24 pb-8 px-6 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xl font-bold py-3 border-b border-border/50 transition-colors ${
                  location === link.href ? "text-blue-600" : "text-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/app/dashboard"
              className="text-xl font-bold py-3 text-muted-foreground border-b border-border/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign in
            </Link>
          </nav>
          <div className="mt-auto">
            <Button
              asChild
              className="w-full rounded-full h-14 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Link href="/app/dashboard" onClick={() => setMobileMenuOpen(false)}>
                Open Dashboard <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              No credit card required. 14-day free trial.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full max-w-[100vw] overflow-x-hidden">
        {children}
      </main>

      {/* Footer */}
      <footer style={{ background: "linear-gradient(180deg, #0B1426 0%, #060D1A 100%)" }} className="py-16 md:py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 pb-12 border-b border-white/10">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-5">
              <Link href="/" className="flex items-center gap-2.5">
                <FunnelLogo className="size-8" />
                <span className="font-bold text-xl tracking-tight text-white" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                  ClearFunnel
                </span>
              </Link>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                The governance layer for modern ATS infrastructure. Making every automated rejection decision visible, testable, and recoverable.
              </p>
              <p className="text-white/30 text-xs italic">
                "See every decision. Trust every hire."
              </p>
              <div className="flex items-center gap-4 pt-1">
                <a
                  href="https://linkedin.com/company/clearfunnel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white/80 transition-colors"
                  aria-label="ClearFunnel on LinkedIn"
                >
                  <Linkedin className="size-4" />
                </a>
                <a
                  href="https://twitter.com/clearfunnel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white/80 transition-colors"
                  aria-label="ClearFunnel on X / Twitter"
                >
                  <Twitter className="size-4" />
                </a>
              </div>
            </div>

            {/* Product links */}
            <div>
              <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-widest opacity-60">
                Product
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "How it works", href: "/how-it-works" },
                  { label: "Pricing", href: "/pricing" },
                  { label: "Dashboard", href: "/app/dashboard" },
                  { label: "Rule Registry", href: "/app/rules" },
                  { label: "Validation Harness", href: "/app/validation" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-white/50 hover:text-white/90 transition-colors text-sm">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-widest opacity-60">
                Company
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "About us", href: "/about" },
                  { label: "Contact us", href: "mailto:stanley@clearfunnel.com" },
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms of Service", href: "#" },
                  { label: "Security", href: "#" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-white/50 hover:text-white/90 transition-colors text-sm">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/25">
            <p>© {new Date().getFullYear()} ClearFunnel Inc. All rights reserved. · Nairobi, Kenya</p>
            <div className="flex items-center gap-6">
              <span>Built for fair, accountable hiring teams</span>
              <a href="/sitemap.xml" className="hover:text-white/50 transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Database, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Product", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ];

  return (
    <div className="theme-marketing min-h-screen bg-background text-foreground font-marketing flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Announcement Strip */}
      <div className="bg-foreground text-background text-xs py-2 text-center font-medium">
        <span className="opacity-80">Introducing Validation Harness v2:</span>
        <Link href="/how-it-works" className="ml-2 underline underline-offset-2 hover:opacity-80 transition-opacity font-semibold">
          Learn how to test ATS rules before they go live
        </Link>
      </div>

      {/* Floating Navbar */}
      <header className="fixed top-12 left-0 right-0 z-50 px-4 md:px-6 pointer-events-none">
        <div className="mx-auto max-w-5xl">
          <div className="pointer-events-auto bg-background/80 backdrop-blur-md border border-border rounded-full shadow-lg shadow-black/5 px-4 md:px-6 py-3 flex items-center justify-between transition-all duration-300">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground group-hover:scale-105 transition-transform duration-300">
                <Database className="size-4" />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight">ClearFunnel</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Button asChild className="hidden sm:inline-flex rounded-full font-semibold px-6 shadow-sm hover:shadow-md transition-all">
                <Link href="/app/dashboard">Open Dashboard</Link>
              </Button>
              <button
                className="md:hidden p-2 text-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm md:hidden pt-32 px-6 pb-6 flex flex-col">
          <nav className="flex flex-col gap-6 text-2xl font-heading font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={location === link.href ? "text-primary" : "text-foreground"}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-6 border-t border-border">
            <Button asChild className="w-full rounded-full text-lg py-6" size="lg">
              <Link href="/app/dashboard">Open Dashboard</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-32 w-full max-w-[100vw] overflow-x-hidden relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16 md:py-24 px-6 mt-24">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <Database className="size-4" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-white">ClearFunnel</span>
            </Link>
            <p className="text-muted text-sm max-w-sm leading-relaxed">
              The governance layer for modern ATS infrastructure.
              Making every automated rejection decision visible, testable, and recoverable.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/how-it-works" className="text-muted hover:text-white transition-colors text-sm">How it works</Link></li>
              <li><Link href="/pricing" className="text-muted hover:text-white transition-colors text-sm">Pricing</Link></li>
              <li><Link href="/app/dashboard" className="text-muted hover:text-white transition-colors text-sm">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-muted hover:text-white transition-colors text-sm">About us</Link></li>
              <li><a href="#" className="text-muted hover:text-white transition-colors text-sm">Contact</a></li>
              <li><a href="#" className="text-muted hover:text-white transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-muted hover:text-white transition-colors text-sm">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-6xl mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} ClearFunnel Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built for modern hiring teams</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

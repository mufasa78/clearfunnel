import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Activity, ShieldAlert, Users, LayoutDashboard,
  Settings as SettingsIcon, ShieldCheck, ArrowLeft, ExternalLink, Bell, ChevronRight
} from "lucide-react";
import React from "react";

// Brand funnel logo (same as marketing layout)
function FunnelLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className ?? "size-6"} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="cfAppGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect x="2" y="3" width="24" height="5" rx="2.5" fill="url(#cfAppGrad)" />
      <rect x="6" y="11.5" width="16" height="5" rx="2.5" fill="url(#cfAppGrad)" />
      <rect x="10" y="20" width="8" height="5" rx="2.5" fill="url(#cfAppGrad)" />
    </svg>
  );
}

const navigation = [
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard, desc: "Overview & metrics" },
  { name: "Rule Registry", href: "/app/rules", icon: ShieldCheck, desc: "Manage filter rules" },
  { name: "Decision Log", href: "/app/decisions", icon: ShieldAlert, desc: "Full rejection audit" },
  { name: "Recovery Pool", href: "/app/candidates", icon: Users, desc: "Recoverable candidates" },
  { name: "Anomaly Alerts", href: "/app/alerts", icon: Activity, desc: "Live anomaly detection" },
  { name: "Validation Harness", href: "/app/validation", icon: ShieldCheck, desc: "Test rules safely" },
];

// Derive a readable page title and breadcrumb from the current location
function usePageMeta(location: string) {
  const segments = location.replace("/app/", "").split("/").filter(Boolean);
  const first = segments[0];
  const isDetail = segments.length > 1;

  const titles: Record<string, string> = {
    dashboard: "Dashboard",
    rules: "Rule Registry",
    decisions: "Decision Log",
    candidates: "Recovery Pool",
    alerts: "Anomaly Alerts",
    validation: "Validation Harness",
    settings: "Settings",
  };

  const title = titles[first] ?? "Dashboard";
  const parent = isDetail ? titles[first] : null;
  const parentHref = isDetail ? `/app/${first}` : null;
  const detail = isDetail ? `#${segments[1]}` : null;

  return { title, parent, parentHref, detail };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { title, parent, parentHref, detail } = usePageMeta(location);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* ─── Sidebar ───────────────────────────────── */}
        <Sidebar className="border-r border-border bg-sidebar">
          {/* Logo */}
          <SidebarHeader className="py-5 px-4 border-b border-border">
            <Link href="/app/dashboard" className="flex items-center gap-2.5 group">
              <FunnelLogo className="size-7" />
              <div className="flex flex-col leading-none">
                <span
                  className="font-bold text-sm tracking-tight text-foreground"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  ClearFunnel
                </span>
                <span className="text-[10px] text-muted-foreground font-medium mt-0.5 uppercase tracking-wider">
                  ATS Governance
                </span>
              </div>
            </Link>
          </SidebarHeader>

          {/* Nav links */}
          <SidebarContent className="px-3 py-4">
            <div className="mb-2 px-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Navigation
              </span>
            </div>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive =
                  location === item.href ||
                  (item.href !== "/app/dashboard" && location.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.desc}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 w-full rounded-lg px-2 py-2.5 text-sm font-medium transition-colors"
                      >
                        <item.icon className="size-4 shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          {/* Footer */}
          <SidebarFooter className="px-3 py-4 border-t border-border space-y-1">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === "/app/settings"} tooltip="Settings">
                  <Link href="/app/settings" className="flex items-center gap-3 w-full text-sm font-medium">
                    <SettingsIcon className="size-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Back to marketing site">
                  <Link href="/" className="flex items-center gap-3 w-full text-sm font-medium text-muted-foreground hover:text-foreground">
                    <ExternalLink className="size-4" />
                    <span>Marketing Site</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Version badge */}
            <div className="mt-3 mx-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">System Healthy</span>
              </div>
              <p className="text-[10px] text-blue-600/70 leading-tight">
                All webhooks active · ClearFunnel v2.1
              </p>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* ─── Main Content ──────────────────────────── */}
        <div className="flex-1 flex flex-col h-[100dvh] overflow-hidden min-w-0">
          {/* Top Header Bar */}
          <header className="flex items-center justify-between px-4 sm:px-6 h-14 border-b border-border bg-background shrink-0">
            <div className="flex items-center gap-3">
              {/* Mobile sidebar trigger */}
              <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />

              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
                {parent ? (
                  <>
                    <Link
                      href={parentHref!}
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      <ArrowLeft className="size-3.5" />
                      {parent}
                    </Link>
                    <ChevronRight className="size-3.5 text-muted-foreground/40" />
                    <span className="font-semibold text-foreground">{detail}</span>
                  </>
                ) : (
                  <span className="font-semibold text-foreground" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                    {title}
                  </span>
                )}
              </nav>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
              >
                <ExternalLink className="size-3.5" />
                Back to site
              </Link>
              <Link
                href="/app/alerts"
                className="relative p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                aria-label="Alerts"
              >
                <Bell className="size-4" />
              </Link>
              <div
                className="size-8 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer"
                style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}
                title="Account settings"
              >
                HR
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-slate-50/40">
            <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

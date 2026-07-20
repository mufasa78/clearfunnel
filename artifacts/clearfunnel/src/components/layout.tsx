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
} from "@/components/ui/sidebar";
import { Activity, ShieldAlert, Users, Database, LayoutDashboard, Settings as SettingsIcon, ShieldCheck } from "lucide-react";
import React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
    { name: "Rule Registry", href: "/app/rules", icon: Database },
    { name: "Decision Log", href: "/app/decisions", icon: ShieldAlert },
    { name: "Recovery Pool", href: "/app/candidates", icon: Users },
    { name: "Anomaly Alerts", href: "/app/alerts", icon: Activity },
    { name: "Validation Harness", href: "/app/validation", icon: ShieldCheck },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r border-border/50">
          <SidebarHeader className="py-6 px-4">
            <Link href="/app/dashboard" className="flex items-center gap-2 group">
              <div className="size-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                <Database className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold tracking-wider text-foreground">CLEAR<span className="text-primary">FUNNEL</span></span>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">ATC Gov Layer</span>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-2">
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = location === item.href || (item.href !== "/app/dashboard" && location.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                      <Link href={item.href} className="flex items-center gap-3 w-full font-mono text-sm">
                        <item.icon className="size-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-border/50">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === "/app/settings"} tooltip="Settings">
                  <Link href="/app/settings" className="flex items-center gap-3 w-full font-mono text-sm">
                    <SettingsIcon className="size-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

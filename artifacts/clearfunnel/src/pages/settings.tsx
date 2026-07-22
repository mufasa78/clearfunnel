import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings as SettingsIcon, Link2, Key, Database } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-mono font-bold uppercase tracking-wide">System Settings</h1>
        <p className="text-muted-foreground text-sm font-mono mt-1">Configure ATS integrations and governance parameters</p>
      </div>

      <div className="space-y-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-sm font-mono flex items-center gap-2">
              <Link2 className="size-4 text-primary" />
              ATS INTEGRATION
            </CardTitle>
            <CardDescription className="font-mono text-xs">Connect ClearFunnel to your primary Applicant Tracking System</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">Provider</label>
                <select className="flex h-9 w-full rounded-md border border-border/50 bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono">
                  <option>Workday</option>
                  <option>Greenhouse</option>
                  <option>Lever</option>
                  <option>Ashby</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">API Endpoint URL</label>
                <Input defaultValue="https://api.workday.com/v1/tenant/clearfunnel" className="font-mono text-sm border-border/50 bg-background" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">API Key / Bearer Token</label>
                <div className="relative">
                  <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="password" defaultValue="************************" className="pl-9 font-mono text-sm border-border/50 bg-background" />
                </div>
              </div>
            </div>
            <Button className="font-mono text-xs mt-2" disabled>SAVE CONNECTION</Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-sm font-mono flex items-center gap-2">
              <Database className="size-4 text-primary" />
              RETENTION POLICY
            </CardTitle>
            <CardDescription className="font-mono text-xs">Configure how long auto-rejected candidates remain in the recovery pool</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-w-xs">
              <label className="text-xs font-mono text-muted-foreground uppercase">Recovery Window (Days)</label>
              <Input type="number" defaultValue="90" className="font-mono text-sm border-border/50 bg-background" />
              <p className="text-[10px] font-mono text-muted-foreground">After this period, records are purged in compliance with GDPR/CCPA.</p>
            </div>
            <Button className="font-mono text-xs mt-2" variant="outline">UPDATE POLICY</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

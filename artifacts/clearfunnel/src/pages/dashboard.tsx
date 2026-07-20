import { 
  useGetDashboardSummary, 
  useGetRejectionRates, 
  useGetRuleImpact,
  DashboardSummary
} from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Activity, AlertTriangle, ArrowUpRight, Database, Users, Fingerprint, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

export default function Dashboard() {
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummary();
  const { data: rates, isLoading: isRatesLoading } = useGetRejectionRates({ days: 30 });
  const { data: impact, isLoading: isImpactLoading } = useGetRuleImpact();

  if (isSummaryLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold uppercase tracking-wide">System Overview</h1>
          <p className="text-muted-foreground text-sm font-mono mt-1">Live feed from ATS webhooks</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-primary">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          SYSTEM HEALTHY
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Total Rejections (30d)" 
          value={summary?.totalRejections?.toLocaleString() || "0"} 
          icon={<Fingerprint className="size-4 text-muted-foreground" />}
          trend={`${summary?.rejectionRateToday.toFixed(1)}% rate today`}
        />
        <SummaryCard 
          title="Open Alerts" 
          value={summary?.openAlerts?.toString() || "0"} 
          icon={<AlertTriangle className={summary?.openAlerts ? "size-4 text-destructive" : "size-4 text-muted-foreground"} />}
          trend="Requires attention"
          highlight={!!summary?.openAlerts}
        />
        <SummaryCard 
          title="Recoverable Pool" 
          value={summary?.recoverableCandidates?.toString() || "0"} 
          icon={<Users className="size-4 text-muted-foreground" />}
          trend="Candidates in 90d window"
        />
        <SummaryCard 
          title="Validation Pass Rate" 
          value={`${summary?.validationPassRate.toFixed(1)}%`} 
          icon={<ShieldCheckIcon className="size-4 text-primary" />}
          trend={`${summary?.pendingValidations} pending runs`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-sm font-mono text-muted-foreground flex items-center justify-between">
              <span>Rejection Rate Over Time</span>
              <Activity className="size-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isRatesLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCw className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rates}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickFormatter={(val) => `${val}%`}
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.25rem' }}
                      itemStyle={{ color: 'hsl(var(--primary))' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rejectionRate" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm font-mono text-muted-foreground">Rule Impact</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {isImpactLoading ? (
              <div className="h-full flex items-center justify-center">
                <RefreshCw className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                {impact?.slice(0, 5).map((rule) => (
                  <div key={rule.ruleId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="truncate pr-2">{rule.ruleName}</span>
                      <span className="text-muted-foreground">{rule.percentageOfAll.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary/70 rounded-full" 
                        style={{ width: `${rule.percentageOfAll}%` }} 
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-4 mt-auto">
                  <Link href="/app/rules" className="text-xs font-mono text-primary flex items-center gap-1 hover:underline">
                    View all rules <ArrowUpRight className="size-3" />
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-mono text-muted-foreground">Recent Decisions</CardTitle>
            <Link href="/app/decisions" className="text-xs font-mono text-primary hover:underline">View Log</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary?.recentDecisions?.map((decision) => (
                <div key={decision.id} className="flex items-start justify-between p-3 rounded bg-muted/30 border border-border/30">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{decision.candidateName}</span>
                      <Badge variant="outline" className="text-[10px] font-mono rounded-sm px-1.5 py-0">
                        {decision.roleName}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{decision.rejectionSummary}</p>
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground text-right">
                    {new Date(decision.rejectedAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              {!summary?.recentDecisions?.length && (
                <div className="text-center py-6 text-sm text-muted-foreground font-mono">No recent decisions</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-mono text-muted-foreground">Active Anomalies</CardTitle>
            <Link href="/app/alerts" className="text-xs font-mono text-primary hover:underline">View Alerts</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary?.recentAlerts?.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded bg-destructive/5 border border-destructive/20">
                  <AlertTriangle className="size-4 text-destructive mt-0.5 shrink-0" />
                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-destructive-foreground">{alert.alertType.replace('_', ' ').toUpperCase()}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {new Date(alert.detectedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
              ))}
              {!summary?.recentAlerts?.length && (
                <div className="text-center py-6 text-sm text-muted-foreground font-mono">System normal. No active anomalies.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ShieldCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function SummaryCard({ title, value, icon, trend, highlight }: { title: string, value: string, icon: React.ReactNode, trend?: string, highlight?: boolean }) {
  return (
    <Card className={`border-border/50 bg-card/50 backdrop-blur ${highlight ? 'border-destructive/50 shadow-[0_0_15px_rgba(255,0,0,0.1)]' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground font-mono">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold font-mono ${highlight ? 'text-destructive' : ''}`}>{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

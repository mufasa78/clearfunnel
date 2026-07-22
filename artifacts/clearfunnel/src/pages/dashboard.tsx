import {
  useGetDashboardSummary,
  useGetRejectionRates,
  useGetRuleImpact,
} from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import {
  Activity, AlertTriangle, ArrowUpRight, Users, Fingerprint,
  RefreshCw, ShieldCheck, ArrowRight, TrendingDown, CheckCircle2, Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummary();
  const { data: rates, isLoading: isRatesLoading } = useGetRejectionRates({ days: 30 });
  const { data: impact, isLoading: isImpactLoading } = useGetRuleImpact();

  if (isSummaryLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* ─── Page Header ───────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-black tracking-tight text-foreground"
            style={{ fontFamily: "'Satoshi', sans-serif" }}
          >
            System Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Live feed from your ATS webhooks · Last updated just now
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            All systems healthy
          </div>
          <Button size="sm" variant="outline" className="rounded-lg h-9 font-medium" asChild>
            <Link href="/app/validation">
              Run Validation <ArrowRight className="ml-1.5 size-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* ─── KPI Cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Rejections (30d)"
          value={summary?.totalRejections?.toLocaleString() ?? "0"}
          icon={<Fingerprint className="size-4" />}
          sub={`${summary?.rejectionRateToday?.toFixed(1) ?? 0}% rate today`}
          color="blue"
          href="/app/decisions"
        />
        <MetricCard
          title="Open Alerts"
          value={summary?.openAlerts?.toString() ?? "0"}
          icon={<AlertTriangle className="size-4" />}
          sub="Requires attention"
          color={summary?.openAlerts ? "red" : "green"}
          href="/app/alerts"
        />
        <MetricCard
          title="Recovery Pool"
          value={summary?.recoverableCandidates?.toString() ?? "0"}
          icon={<Users className="size-4" />}
          sub="Candidates within 90-day window"
          color="violet"
          href="/app/candidates"
        />
        <MetricCard
          title="Validation Pass Rate"
          value={`${summary?.validationPassRate?.toFixed(1) ?? 0}%`}
          icon={<ShieldCheck className="size-4" />}
          sub={`${summary?.pendingValidations ?? 0} runs pending`}
          color="green"
          href="/app/validation"
        />
      </div>

      {/* ─── Charts Row ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rejection rate chart */}
        <Card className="col-span-1 lg:col-span-2 rounded-xl border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle
                className="text-base font-bold text-foreground"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                Rejection Rate — Last 30 Days
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Auto-rejections as % of total applications received
              </p>
            </div>
            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isRatesLoading ? (
              <div className="h-[260px] flex items-center justify-center">
                <RefreshCw className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rates} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#7C3AED" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(215 16% 60%)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) =>
                        new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis
                      stroke="hsl(215 16% 60%)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderColor: "hsl(214 32% 91%)",
                        borderRadius: "0.5rem",
                        fontSize: 12,
                        boxShadow: "0 4px 12px rgba(15,27,61,0.08)",
                      }}
                      itemStyle={{ color: "#2563EB" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rejectionRate"
                      stroke="url(#lineGrad)"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, fill: "#2563EB", strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rule impact */}
        <Card className="rounded-xl border border-border shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle
                className="text-base font-bold text-foreground"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                Top Rules by Impact
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Share of all rejections</p>
            </div>
            <TrendingDown className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex-1">
            {isImpactLoading ? (
              <div className="h-full flex items-center justify-center">
                <RefreshCw className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                {impact?.slice(0, 5).map((rule, idx) => (
                  <div key={rule.ruleId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground truncate pr-2 max-w-[160px]">
                        {rule.ruleName}
                      </span>
                      <span className="text-muted-foreground font-semibold tabular-nums">
                        {rule.percentageOfAll.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${rule.percentageOfAll}%`,
                          background: idx === 0
                            ? "linear-gradient(90deg, #2563EB, #7C3AED)"
                            : idx === 1
                            ? "linear-gradient(90deg, #3B82F6, #8B5CF6)"
                            : "#93C5FD",
                        }}
                      />
                    </div>
                  </div>
                ))}
                {!impact?.length && (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No rule impact data yet
                  </div>
                )}
                <div className="pt-3 border-t border-border">
                  <Link
                    href="/app/rules"
                    className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:text-blue-700 transition-colors"
                  >
                    View all rules <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── Quick Actions ──────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Review Rejections", desc: "Full audit log", href: "/app/decisions", icon: ShieldCheck, color: "blue" },
          { label: "Validate a Rule", desc: "Test before deploy", href: "/app/validation", icon: CheckCircle2, color: "green" },
          { label: "Recover Candidates", desc: "90-day pool", href: "/app/candidates", icon: Users, color: "violet" },
          { label: "Check Alerts", desc: "Anomaly feed", href: "/app/alerts", icon: Activity, color: "red" },
        ].map((action) => (
          <Link key={action.href} href={action.href}>
            <div className="group bg-white rounded-xl border border-border p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
              <div
                className={`size-9 rounded-lg flex items-center justify-center mb-3 ${
                  action.color === "blue" ? "bg-blue-50 text-blue-600" :
                  action.color === "green" ? "bg-green-50 text-green-600" :
                  action.color === "violet" ? "bg-violet-50 text-violet-600" :
                  "bg-red-50 text-red-600"
                }`}
              >
                <action.icon className="size-4" />
              </div>
              <p className="text-sm font-semibold text-foreground group-hover:text-blue-700 transition-colors" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                {action.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ─── Activity Tables ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Decisions */}
        <Card className="rounded-xl border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle
              className="text-base font-bold text-foreground"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Recent Auto-Rejections
            </CardTitle>
            <Button size="sm" variant="ghost" className="text-xs text-blue-600 font-semibold h-7 px-2 hover:bg-blue-50" asChild>
              <Link href="/app/decisions">View all <ArrowRight className="ml-1 size-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary?.recentDecisions?.map((decision) => (
                <div
                  key={decision.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-slate-50 border border-border/60 hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-foreground">{decision.candidateName}</span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded-md font-medium">
                        {decision.roleName}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{decision.rejectionSummary}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2 text-[10px] text-muted-foreground mt-0.5">
                    <Clock className="size-3" />
                    {new Date(decision.rejectedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))}
              {!summary?.recentDecisions?.length && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No recent decisions logged.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Anomalies */}
        <Card className="rounded-xl border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle
              className="text-base font-bold text-foreground"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Active Anomalies
            </CardTitle>
            <Button size="sm" variant="ghost" className="text-xs text-blue-600 font-semibold h-7 px-2 hover:bg-blue-50" asChild>
              <Link href="/app/alerts">View all <ArrowRight className="ml-1 size-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary?.recentAlerts?.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-red-50/50 border border-red-100 hover:border-red-200 transition-colors"
                >
                  <AlertTriangle className="size-4 text-red-500 mt-0.5 shrink-0" />
                  <div className="space-y-0.5 w-full min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-red-700 capitalize">
                        {alert.alertType.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {new Date(alert.detectedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
              ))}
              {!summary?.recentAlerts?.length && (
                <div className="flex flex-col items-center py-8 gap-2 text-center">
                  <CheckCircle2 className="size-6 text-green-500" />
                  <p className="text-sm font-medium text-green-700">All clear — no active anomalies</p>
                  <p className="text-xs text-muted-foreground">System is operating within normal parameters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Nav hint to Recovery Pool ──────────────── */}
      {(summary?.recoverableCandidates ?? 0) > 0 && (
        <div
          className="rounded-xl p-5 flex items-center justify-between gap-4 border border-violet-200"
          style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(124,58,237,0.06))" }}
        >
          <div>
            <p className="font-bold text-foreground text-sm" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {summary?.recoverableCandidates} candidates are awaiting recovery
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              These candidates were auto-rejected and are within the 90-day recovery window. Review them before the window closes.
            </p>
          </div>
          <Button
            className="rounded-lg shrink-0 font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
            asChild
          >
            <Link href="/app/candidates">
              Review Pool <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Metric Card ────────────────────────────────────────
function MetricCard({
  title, value, icon, sub, color, href
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  sub?: string;
  color: "blue" | "red" | "green" | "violet";
  href: string;
}) {
  const colorMap = {
    blue:   { bg: "bg-blue-50",   text: "text-blue-600",   val: "text-blue-700" },
    red:    { bg: "bg-red-50",    text: "text-red-600",    val: "text-red-700" },
    green:  { bg: "bg-green-50",  text: "text-green-600",  val: "text-green-700" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", val: "text-violet-700" },
  };
  const c = colorMap[color];

  return (
    <Link href={href}>
      <Card className="rounded-xl border border-border shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5 px-5">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
          </CardTitle>
          <div className={`size-8 rounded-lg flex items-center justify-center ${c.bg} ${c.text}`}>
            {icon}
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div
            className={`text-3xl font-black tracking-tight ${c.val}`}
            style={{ fontFamily: "'Satoshi', sans-serif" }}
          >
            {value}
          </div>
          {sub && <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>}
          <div className="flex items-center gap-1 mt-3 text-[11px] font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
            View details <ArrowRight className="size-3" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

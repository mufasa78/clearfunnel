import {
  useGetDashboardSummary,
  useGetRejectionRates,
  useGetRuleImpact,
  useGetGovernanceScore,
  useGetRecruiterStats,
} from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import {
  Activity, AlertTriangle, Users, Fingerprint, RefreshCw, ShieldCheck,
  ArrowRight, TrendingDown, TrendingUp, DollarSign, Target, Zap,
  Brain, BarChart3, Award, AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, AreaChart, Area,
} from "recharts";

// ─── Governance Score Ring ───────────────────────────────────────────────────
function GovernanceRing({ score, label }: { score: number; label: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? "#22c55e" : score >= 75 ? "#3b82f6" : score >= 60 ? "#f59e0b" : "#ef4444";
  const bg = score >= 90 ? "bg-green-50" : score >= 75 ? "bg-blue-50" : score >= 60 ? "bg-amber-50" : "bg-red-50";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-32">
        <svg className="size-32 -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="12" />
          <circle
            cx="64" cy="64" r={radius}
            fill="none" stroke={color} strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black tracking-tight" style={{ color, fontFamily: "'Satoshi', sans-serif" }}>
            {score}
          </span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">/100</span>
        </div>
      </div>
      <Badge className={`${bg} border-0 text-sm font-semibold px-3 py-0.5`} style={{ color }}>
        {label}
      </Badge>
    </div>
  );
}

// ─── Score Bar ───────────────────────────────────────────────────────────────
function ScoreBar({ label, value, max = 100, invert = false, weight }: {
  label: string; value: number; max?: number; invert?: boolean; weight: string;
}) {
  const pct = Math.round((value / max) * 100);
  const effectivePct = invert ? 100 - pct : pct;
  const color = effectivePct >= 80 ? "bg-green-500" : effectivePct >= 60 ? "bg-blue-500" : effectivePct >= 40 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground/60">{weight}</span>
          <span className="font-bold tabular-nums" style={{ color: effectivePct >= 80 ? "#22c55e" : effectivePct >= 60 ? "#3b82f6" : effectivePct >= 40 ? "#f59e0b" : "#ef4444" }}>
            {invert ? `${value.toFixed(0)}%` : `${value}%`}
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${effectivePct}%` }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummary();
  const { data: rates, isLoading: isRatesLoading } = useGetRejectionRates({ days: 30 });
  const { data: impact, isLoading: isImpactLoading } = useGetRuleImpact();
  const { data: governance } = useGetGovernanceScore();
  const { data: recruiterStats } = useGetRecruiterStats();

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

  const gc = summary?.governanceComponents;
  const govScore = summary?.governanceScore ?? 0;
  const govLabel = summary?.governanceLabel ?? "Loading";

  // Chart data for rejection rates
  const ratesByDate = rates?.reduce((acc, r) => {
    const existing = acc.find((e: any) => e.date === r.date);
    if (existing) {
      existing.rate = Math.max(existing.rate, r.rejectionRate);
    } else {
      acc.push({ date: r.date.slice(5), rate: r.rejectionRate });
    }
    return acc;
  }, [] as { date: string; rate: number }[]) ?? [];

  const trendData = governance?.trend?.slice(-12) ?? [];

  const ruleImpactItems = (impact ?? []).slice(0, 5);

  return (
    <div className="space-y-7">
      {/* ─── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ fontFamily: "'Satoshi', sans-serif" }}>
            Hiring Governance Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Intelligence-driven ATS governance · All metrics are computed, not counted
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Live feed active
          </div>
          <Button size="sm" variant="outline" className="rounded-lg h-9 font-medium" asChild>
            <Link href="/app/validation">Run Validation <ArrowRight className="ml-1.5 size-3.5" /></Link>
          </Button>
        </div>
      </div>

      {/* ─── Hero: Governance Score + ATS Health ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Governance Score */}
        <Card className="lg:col-span-1 rounded-xl border border-border shadow-sm bg-gradient-to-br from-white to-blue-50/40">
          <CardHeader className="pb-2 pt-5 px-5">
            <div className="flex items-center gap-2">
              <Award className="size-4 text-blue-600" />
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Governance Score
              </CardTitle>
            </div>
            <CardDescription className="text-[11px] mt-0.5">
              Composite hiring-process health · 0–100 like a credit score
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 flex flex-col items-center gap-4">
            <GovernanceRing score={govScore} label={govLabel} />
            {gc && (
              <div className="w-full space-y-2 pt-2 border-t border-border/50">
                <ScoreBar label="Rule Accuracy" value={gc.ruleAccuracy} weight="20%" />
                <ScoreBar label="False Rejection Rate" value={gc.falseRejectionRate ?? 0} weight="20%" invert />
                <ScoreBar label="Recovery Success" value={gc.recoverySuccessRate} weight="15%" />
                <ScoreBar label="Recruiter Consistency" value={gc.recruiterConsistency} weight="15%" />
                <ScoreBar label="Explainability" value={gc.explainabilityCoverage} weight="10%" />
                <ScoreBar label="Bias Risk" value={gc.biasRisk ?? 0} weight="10%" invert />
                <ScoreBar label="Validation Pass Rate" value={gc.validationPassRate} weight="10%" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right column: KPIs + trend */}
        <div className="lg:col-span-2 space-y-4">
          {/* 4 KPI cards */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="ATS Health Score"
              value={`${summary?.atsHealthScore ?? 0}`}
              suffix="/100"
              icon={<Zap className="size-4" />}
              sub={`${summary?.highRiskRules ?? 0} high-risk rules`}
              color={summary?.atsHealthScore && summary.atsHealthScore >= 75 ? "green" : "amber"}
              href="/app/rules"
            />
            <MetricCard
              title="Recovery Pool"
              value={summary?.recoverableCandidates?.toString() ?? "0"}
              icon={<Users className="size-4" />}
              sub={`${summary?.recoverySuccessRate ?? 0}% recovery success rate`}
              color="violet"
              href="/app/candidates"
            />
            <MetricCard
              title="Open Anomaly Alerts"
              value={summary?.openAlerts?.toString() ?? "0"}
              icon={<AlertTriangle className="size-4" />}
              sub="Requires attention"
              color={summary?.openAlerts ? "red" : "green"}
              href="/app/alerts"
            />
            <MetricCard
              title="Validation Pass Rate"
              value={`${summary?.validationPassRate?.toFixed(0) ?? 0}%`}
              icon={<ShieldCheck className="size-4" />}
              sub={`${summary?.pendingValidations ?? 0} rules pending`}
              color="blue"
              href="/app/validation"
            />
          </div>

          {/* Financial Impact Banner */}
          <Card className="rounded-xl border border-amber-200 bg-amber-50/60 shadow-sm">
            <CardContent className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-amber-100 flex items-center justify-center">
                  <DollarSign className="size-4 text-amber-700" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-amber-900 uppercase tracking-wide">Estimated Revenue at Risk</div>
                  <div className="text-xs text-amber-700 mt-0.5">
                    From {summary?.falseRejectionCount ?? 0} false rejections this period
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-xl font-black text-amber-700" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                    ${((summary?.talentLossCost ?? 0) / 1000).toFixed(0)}K
                  </div>
                  <div className="text-[10px] text-amber-600 font-medium">Talent Loss</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-black text-amber-700" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                    ${((summary?.recruiterReworkCost ?? 0) / 1000).toFixed(0)}K
                  </div>
                  <div className="text-[10px] text-amber-600 font-medium">Rework Cost</div>
                </div>
                <div className="text-center border-l border-amber-200 pl-6">
                  <div className="text-2xl font-black text-amber-800" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                    ${((summary?.estimatedRevenueLost ?? 0) / 1000).toFixed(0)}K
                  </div>
                  <div className="text-[10px] text-amber-700 font-bold">Total Estimated</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ─── Governance Trend + Rule Impact ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Governance trend over 12 months */}
        <Card className="lg:col-span-3 rounded-xl border border-border shadow-sm">
          <CardHeader className="pb-2 pt-5 px-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Governance Score Trend</CardTitle>
                <CardDescription className="text-xs mt-0.5">12-month trajectory — improving = better process</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono rounded-sm">
                +{trendData.length > 1 ? trendData[trendData.length - 1]?.governanceScore - trendData[0]?.governanceScore : 0}pts this year
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            {isRatesLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="govGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="atsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                  <YAxis domain={[40, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    contentStyle={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 11 }}
                    formatter={(v: any, name: string) => [`${v}`, name === "governanceScore" ? "Governance" : "ATS Health"]}
                  />
                  <Area type="monotone" dataKey="governanceScore" stroke="#3b82f6" strokeWidth={2} fill="url(#govGrad)" name="governanceScore" />
                  <Area type="monotone" dataKey="atsHealthScore" stroke="#22c55e" strokeWidth={1.5} strokeDasharray="4 2" fill="url(#atsGrad)" name="atsHealthScore" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Rule Impact with accuracy */}
        <Card className="lg:col-span-2 rounded-xl border border-border shadow-sm">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-semibold">Top Rules by Impact</CardTitle>
            <CardDescription className="text-xs mt-0.5">Sorted by rejections · accuracy shows correctness</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-4 space-y-3">
            {isImpactLoading ? (
              <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
            ) : ruleImpactItems.map((rule) => {
              const isHighRisk = (rule.fpRate ?? 0) > 30;
              return (
                <div key={rule.ruleId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium truncate max-w-[140px] ${isHighRisk ? "text-red-700" : "text-foreground"}`}>
                      {rule.ruleName}
                    </span>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {isHighRisk && (
                        <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 rounded px-1 py-0.5">
                          {rule.fpRate?.toFixed(0)}% FP
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {rule.accuracyScore?.toFixed(0)}% acc
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="h-1.5 rounded-full bg-blue-500/80 transition-all" style={{ width: `${rule.percentageOfAll}%` }} />
                    <div className="h-1.5 rounded-full bg-red-400/60 transition-all" style={{ width: `${rule.fpRate ?? 0}%` }} />
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>{rule.totalRejections.toLocaleString()} rejections</span>
                    <span>{rule.percentageOfAll}% of total</span>
                  </div>
                </div>
              );
            })}
            <div className="text-[10px] text-muted-foreground flex items-center gap-2 pt-1 border-t border-border/50">
              <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-blue-500/80" /> Rejections</div>
              <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-red-400/60" /> False Positives</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Recruiter Consistency + Recent Decisions ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recruiter Consistency */}
        <Card className="rounded-xl border border-border shadow-sm">
          <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Recruiter Consistency</CardTitle>
                <CardDescription className="text-xs mt-0.5">Rejection rate vs. team average · flagged = needs review</CardDescription>
              </div>
              <Link href="/app/alerts" className="text-[10px] font-semibold text-blue-600 hover:underline flex items-center gap-1">
                View alerts <ArrowRight className="size-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-4 space-y-2">
            {recruiterStats?.recruiters?.map((r) => {
              const flagColor = r.flagged ? "text-red-600" : "text-muted-foreground";
              const zAbs = Math.abs(r.zScore);
              const barColor = r.consistencyScore >= 80 ? "bg-green-500" : r.consistencyScore >= 60 ? "bg-amber-500" : "bg-red-500";
              return (
                <div key={r.recruiterId} className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                    {r.recruiterName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium truncate">{r.recruiterName}</span>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {r.flagged && (
                          <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 rounded px-1 py-0.5 uppercase">
                            {r.flagged}
                          </span>
                        )}
                        <span className={`text-[10px] font-semibold ${flagColor}`}>
                          {r.rejectionRate.toFixed(0)}% ({r.zScore > 0 ? "+" : ""}{r.zScore.toFixed(1)}σ)
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} rounded-full`} style={{ width: `${r.consistencyScore}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/50">
              Team mean: {recruiterStats?.teamMeanRejectionRate?.toFixed(1)}% · σ = {recruiterStats?.teamStdDev?.toFixed(1)} · Consistency: {recruiterStats?.teamConsistencyScore}/100
            </div>
          </CardContent>
        </Card>

        {/* Recent Decisions with confidence */}
        <Card className="rounded-xl border border-border shadow-sm">
          <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Recent Decisions</CardTitle>
                <CardDescription className="text-xs mt-0.5">Confidence scores show how certain each rejection is</CardDescription>
              </div>
              <Link href="/app/decisions" className="text-[10px] font-semibold text-blue-600 hover:underline flex items-center gap-1">
                Full log <ArrowRight className="size-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-4 space-y-2">
            {summary?.recentDecisions?.map((d) => {
              const conf = d.confidenceScore ?? 75;
              const confColor = conf >= 85 ? "text-green-700 bg-green-50 border-green-200" :
                                conf >= 65 ? "text-blue-700 bg-blue-50 border-blue-200" :
                                "text-red-700 bg-red-50 border-red-200";
              const strength = d.evidenceStrength ?? "moderate";
              return (
                <div key={d.id} className="flex items-center gap-3 py-1.5 border-b border-border/30 last:border-0">
                  <div className={`text-[11px] font-bold border rounded px-1.5 py-0.5 shrink-0 ${confColor}`}>
                    {conf}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{d.candidateName}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{d.roleName}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-medium text-muted-foreground capitalize">{strength}</div>
                    <div className="text-[9px] text-muted-foreground">
                      {new Date(d.rejectedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
            <Link href="/app/decisions" className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 pt-1 hover:underline">
              View all decisions <ArrowRight className="size-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* ─── Active Anomaly Alerts ─────────────────────────────────────── */}
      {(summary?.recentAlerts?.length ?? 0) > 0 && (
        <Card className="rounded-xl border border-red-200 bg-red-50/30 shadow-sm">
          <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 text-red-600" />
                <CardTitle className="text-sm font-semibold text-red-800">
                  {summary?.openAlerts} Active Anomalies
                </CardTitle>
              </div>
              <Link href="/app/alerts" className="text-[10px] font-semibold text-red-700 hover:underline flex items-center gap-1">
                Manage alerts <ArrowRight className="size-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-4 space-y-2">
            {summary?.recentAlerts?.slice(0, 3).map((a) => (
              <div key={a.id} className="flex items-start gap-3 py-2 border-b border-red-100 last:border-0">
                <div className={`text-[10px] font-bold rounded px-1.5 py-0.5 shrink-0 mt-0.5 ${
                  a.severity === "critical" ? "bg-red-100 text-red-800 border border-red-200" :
                  a.severity === "high" ? "bg-orange-100 text-orange-800 border border-orange-200" :
                  "bg-amber-100 text-amber-800 border border-amber-200"
                }`}>
                  {a.severity.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-snug">{a.message}</p>
                  {a.zScore !== null && a.zScore !== undefined && (
                    <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">
                      z = {a.zScore > 0 ? "+" : ""}{a.zScore?.toFixed(1)} · {a.affectedCandidates} candidates affected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Metric Card ────────────────────────────────────────────────────────────
function MetricCard({
  title, value, suffix, icon, sub, color, href
}: {
  title: string; value: string; suffix?: string; icon: React.ReactNode;
  sub?: string; color: "blue" | "red" | "green" | "violet" | "amber"; href: string;
}) {
  const colorMap = {
    blue:   { bg: "bg-blue-50",   text: "text-blue-600",   val: "text-blue-700" },
    red:    { bg: "bg-red-50",    text: "text-red-600",    val: "text-red-700" },
    green:  { bg: "bg-green-50",  text: "text-green-600",  val: "text-green-700" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", val: "text-violet-700" },
    amber:  { bg: "bg-amber-50",  text: "text-amber-600",  val: "text-amber-700" },
  };
  const c = colorMap[color];

  return (
    <Link href={href}>
      <Card className="rounded-xl border border-border shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
          <CardTitle className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{title}</CardTitle>
          <div className={`size-7 rounded-lg flex items-center justify-center ${c.bg} ${c.text}`}>{icon}</div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex items-baseline gap-1">
            <div className={`text-2xl font-black tracking-tight ${c.val}`} style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {value}
            </div>
            {suffix && <span className={`text-sm font-semibold ${c.val} opacity-70`}>{suffix}</span>}
          </div>
          {sub && <p className="text-[10px] text-muted-foreground mt-1">{sub}</p>}
        </CardContent>
      </Card>
    </Link>
  );
}

import { useState } from "react";
import { useListAlerts, useUpdateAlert, getListAlertsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertTriangle, TrendingUp, TrendingDown, ShieldAlert, CheckCircle2,
  Activity, Users, Info, Zap, Eye,
} from "lucide-react";

const alertTypeConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  rejection_spike: { icon: <TrendingUp className="size-4" />, label: "Rejection Spike", color: "text-red-600" },
  rejection_drop: { icon: <TrendingDown className="size-4" />, label: "Rejection Drop", color: "text-amber-600" },
  validation_failure: { icon: <ShieldAlert className="size-4" />, label: "Validation Failure", color: "text-orange-600" },
  rule_change: { icon: <Activity className="size-4" />, label: "Rule Change Impact", color: "text-blue-600" },
  recruiter_anomaly: { icon: <Users className="size-4" />, label: "Recruiter Anomaly", color: "text-purple-600" },
  bias_detected: { icon: <Eye className="size-4" />, label: "Bias Detected", color: "text-red-700" },
};

const severityConfig: Record<string, string> = {
  critical: "bg-red-100 text-red-800 border-red-300",
  high:     "bg-orange-100 text-orange-800 border-orange-300",
  medium:   "bg-amber-100 text-amber-800 border-amber-300",
  low:      "bg-blue-100 text-blue-800 border-blue-300",
};

const cardBorder: Record<string, string> = {
  critical: "border-red-300 bg-red-50/40",
  high:     "border-orange-200 bg-orange-50/30",
  medium:   "border-amber-200 bg-amber-50/20",
  low:      "border-blue-100 bg-blue-50/10",
};

function ZScoreMeter({ zScore, baselineRate, currentRate }: {
  zScore: number; baselineRate: number; currentRate: number;
}) {
  const abs = Math.abs(zScore);
  const isAbove = zScore > 0;
  const color = abs >= 3 ? "bg-red-500" : abs >= 2.5 ? "bg-orange-500" : abs >= 2 ? "bg-amber-500" : "bg-blue-400";

  return (
    <div className="space-y-1.5 bg-white/60 border border-border/40 rounded-lg p-3">
      <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
        <span>Statistical Anomaly Detector</span>
        <span className={`font-black text-sm ${abs >= 2.5 ? "text-red-600" : abs >= 2 ? "text-amber-600" : "text-blue-600"}`}>
          {isAbove ? "+" : ""}{zScore.toFixed(1)}σ
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Baseline: {baselineRate.toFixed(1)}%</span>
            <span className={isAbove ? "text-red-600 font-semibold" : "text-amber-600 font-semibold"}>
              Current: {currentRate.toFixed(1)}%
            </span>
          </div>
          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
            {/* Baseline marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10"
              style={{ left: `${Math.min(baselineRate, 95)}%` }}
            />
            {/* Current level */}
            <div
              className={`absolute top-0 left-0 bottom-0 ${color} opacity-70 rounded-full transition-all`}
              style={{ width: `${Math.min(currentRate, 99)}%` }}
            />
          </div>
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground">
        Z-score {Math.abs(zScore).toFixed(1)}: deviation from 30-day mean ·
        {abs >= 3 ? " Critical anomaly" : abs >= 2.5 ? " High anomaly" : abs >= 2 ? " Moderate anomaly" : " Low anomaly"}
      </div>
    </div>
  );
}

export default function Alerts() {
  const queryClient = useQueryClient();
  const { data: response, isLoading } = useListAlerts();
  const updateAlert = useUpdateAlert();

  const alerts = response?.alerts ?? [];
  const summary = response?.summary;
  const openAlerts = alerts.filter((a) => a.status === "open");
  const resolvedAlerts = alerts.filter((a) => a.status === "resolved");

  const handleAcknowledge = (id: number) => {
    updateAlert.mutate({ id, data: { status: "resolved", resolvedBy: "Current User" } }, {
      onSuccess: () => {
        toast.success("Alert resolved");
        queryClient.invalidateQueries({ queryKey: getListAlertsQueryKey() });
      },
      onError: () => toast.error("Failed to resolve alert"),
    });
  };

  if (isLoading) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-mono font-bold uppercase tracking-wide">Anomaly Alerts</h1>
        <p className="text-muted-foreground text-sm font-mono mt-1">
          Z-score anomaly detection · flags statistical deviations in rejection rates, recruiter behaviour, and bias signals
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className={`${summary?.criticalCount ? "border-red-300 bg-red-50/60" : "border-border/50"}`}>
          <CardContent className="p-3 flex items-center gap-3">
            <AlertTriangle className={`size-4 ${summary?.criticalCount ? "text-red-600" : "text-muted-foreground"}`} />
            <div>
              <div className={`text-xl font-black ${summary?.criticalCount ? "text-red-600" : "text-foreground"}`} style={{ fontFamily: "'Satoshi', sans-serif" }}>
                {summary?.criticalCount ?? 0}
              </div>
              <div className="text-[10px] text-muted-foreground font-semibold">CRITICAL</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 flex items-center gap-3">
            <Zap className="size-4 text-orange-500" />
            <div>
              <div className="text-xl font-black" style={{ fontFamily: "'Satoshi', sans-serif" }}>{summary?.highCount ?? 0}</div>
              <div className="text-[10px] text-muted-foreground font-semibold">HIGH SEVERITY</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 flex items-center gap-3">
            <Users className="size-4 text-muted-foreground" />
            <div>
              <div className="text-xl font-black" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                {summary?.totalAffectedCandidates ?? 0}
              </div>
              <div className="text-[10px] text-muted-foreground font-semibold">CANDIDATES AFFECTED</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 flex items-center gap-3">
            <Activity className="size-4 text-muted-foreground" />
            <div>
              <div className="text-xl font-black" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                {summary?.avgZScore != null ? `${summary.avgZScore.toFixed(1)}σ` : "—"}
              </div>
              <div className="text-[10px] text-muted-foreground font-semibold">AVG Z-SCORE</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-[11px] text-muted-foreground bg-muted/30 border border-border/50 rounded-lg p-3">
        <strong>How anomaly detection works:</strong> Every day, ClearFunnel computes the 30-day mean and standard deviation of rejection rates per role and recruiter.
        If today's rate deviates by more than 2σ, an alert fires. Z-score ≥3σ = Critical, 2.5–3σ = High, 2–2.5σ = Medium.
      </div>

      {/* Open alerts */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-wider">
          Active Alerts ({openAlerts.length})
        </h2>

        {openAlerts.length === 0 && (
          <div className="p-8 border border-dashed border-primary/30 rounded-lg bg-primary/5 text-center flex flex-col items-center">
            <CheckCircle2 className="size-8 text-primary/50 mb-2" />
            <p className="font-mono text-sm text-primary">System is nominal. No active anomalies detected.</p>
          </div>
        )}

        {openAlerts.map((alert) => {
          const typeConf = alertTypeConfig[alert.alertType] ?? { icon: <AlertTriangle className="size-4" />, label: alert.alertType, color: "text-muted-foreground" };
          return (
            <Card key={alert.id} className={`border shadow-sm ${cardBorder[alert.severity] ?? ""}`}>
              <CardContent className="p-5 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg bg-white/60 ${typeConf.color} shrink-0`}>
                      {typeConf.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant="outline" className={`text-[10px] font-bold border rounded px-1.5 py-0.5 ${severityConfig[alert.severity]}`}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className={`text-xs font-bold ${typeConf.color}`}>{typeConf.label}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {new Date(alert.detectedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-snug">{alert.message}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                        <span>Role: <strong className="text-foreground">{alert.roleName}</strong></span>
                        {alert.affectedCandidates != null && (
                          <span className="flex items-center gap-1">
                            <Users className="size-3" /> {alert.affectedCandidates} candidates affected
                          </span>
                        )}
                        {alert.recruiterId && (
                          <span>Recruiter: <strong className="text-foreground">{alert.recruiterId}</strong></span>
                        )}
                        {alert.correlatedRuleName && (
                          <span>Rule: <strong className="text-foreground">{alert.correlatedRuleName}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAcknowledge(alert.id)}
                    disabled={updateAlert.isPending}
                    className="text-xs h-8 shrink-0"
                  >
                    <CheckCircle2 className="size-3 mr-1.5" /> Resolve
                  </Button>
                </div>

                {/* Z-Score meter for statistical anomalies */}
                {alert.zScore != null && alert.baselineRate != null && alert.currentRate != null && (
                  <ZScoreMeter
                    zScore={alert.zScore}
                    baselineRate={alert.baselineRate}
                    currentRate={alert.currentRate}
                  />
                )}

                {/* Anomaly label */}
                {alert.anomalyLabel && (
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-muted-foreground">
                    <Activity className="size-3" />
                    {alert.anomalyLabel} from baseline
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resolved alerts */}
      {resolvedAlerts.length > 0 && (
        <div>
          <h2 className="text-sm font-mono font-bold text-muted-foreground mb-4 uppercase tracking-wider">
            Recent History ({resolvedAlerts.length})
          </h2>
          <div className="space-y-2 opacity-60">
            {resolvedAlerts.slice(0, 5).map((alert) => {
              const typeConf = alertTypeConfig[alert.alertType] ?? { icon: <AlertTriangle className="size-4" />, label: alert.alertType, color: "text-muted-foreground" };
              return (
                <Card key={alert.id} className="border-border/50 bg-card/30">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded bg-muted/50 ${typeConf.color}`}>{typeConf.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-muted-foreground">{typeConf.label}</span>
                          {alert.zScore != null && (
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {alert.zScore > 0 ? "+" : ""}{alert.zScore.toFixed(1)}σ
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-muted-foreground/60">
                            {new Date(alert.detectedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant="outline" className="font-mono text-[10px] rounded-sm py-0 border-border/50 text-muted-foreground">RESOLVED</Badge>
                      {alert.resolvedBy && <div className="text-[10px] font-mono text-muted-foreground mt-0.5">by {alert.resolvedBy}</div>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

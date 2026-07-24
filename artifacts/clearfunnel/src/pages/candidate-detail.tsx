import { useParams, Link } from "wouter";
import { useGetCandidate, useRecoverCandidate, getGetCandidateQueryKey, getListCandidatesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Mail, Briefcase, ShieldCheck, AlertTriangle, Star, Info } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

// ─── Recovery Score Gauge ────────────────────────────────────────────────────
function RecoveryGauge({ score }: { score: number }) {
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const bg = score >= 75 ? "text-green-700 bg-green-50 border-green-200" :
             score >= 50 ? "text-amber-700 bg-amber-50 border-amber-200" :
             "text-red-700 bg-red-50 border-red-200";
  const label = score >= 75 ? "Recommend Recovery" : score >= 50 ? "Manual Review" : "Low Priority";
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-28">
        <svg className="size-28 -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="12" />
          <circle cx="64" cy="64" r={radius} fill="none" stroke={color} strokeWidth="12"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black" style={{ color, fontFamily: "'Satoshi', sans-serif" }}>{score}</span>
          <span className="text-[9px] font-semibold text-muted-foreground uppercase">/100</span>
        </div>
      </div>
      <Badge variant="outline" className={`text-xs font-semibold px-2 py-0.5 ${bg}`}>{label}</Badge>
    </div>
  );
}

// ─── Score Component Bar ─────────────────────────────────────────────────────
function ComponentBar({ label, value, weight, contribution }: {
  label: string; value: number; weight: number; contribution: number;
}) {
  const color = value >= 80 ? "bg-green-500" : value >= 60 ? "bg-blue-500" : value >= 40 ? "bg-amber-500" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">{label}</span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground/60">×{weight}%</span>
          <span className="font-bold tabular-nums">{value}%</span>
          <span className="text-[10px] font-semibold text-muted-foreground">= +{contribution}</span>
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function CandidateDetail() {
  const { id } = useParams();
  const candidateId = parseInt(id || "0", 10);
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);

  const { data: detail, isLoading } = useGetCandidate(candidateId, {
    query: { enabled: !!candidateId, queryKey: getGetCandidateQueryKey(candidateId) }
  });
  const recoverMutation = useRecoverCandidate();

  const handleRecover = () => {
    if (!reason.trim()) { toast.error("Please provide a reason for recovery"); return; }
    recoverMutation.mutate({ id: candidateId, data: { reason, recoveredBy: "Current User" } }, {
      onSuccess: () => {
        toast.success("Candidate recovered successfully");
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: getGetCandidateQueryKey(candidateId) });
        queryClient.invalidateQueries({ queryKey: getListCandidatesQueryKey() });
      },
      onError: () => toast.error("Failed to recover candidate"),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!detail) return <div className="text-muted-foreground font-mono text-sm p-8">Candidate not found</div>;

  const { candidate, decisions, scoreBreakdown } = detail;
  const daysLeft = Math.ceil((new Date(candidate.retentionExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const recovScore = scoreBreakdown?.recoveryScore ?? candidate.recoveryScore ?? 0;

  return (
    <div className="space-y-6">
      <Link href="/app/candidates" className="text-xs font-mono text-muted-foreground flex items-center gap-1 hover:text-foreground w-fit">
        <ArrowLeft className="size-3" /> BACK TO POOL
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ─── Recovery Score Card ─── */}
        <Card className="lg:col-span-1 rounded-xl border border-border shadow-sm bg-gradient-to-br from-white to-blue-50/30">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-semibold">Recovery Score</CardTitle>
            <CardDescription className="text-[11px]">
              Algorithm-computed likelihood of wrongful rejection
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 flex flex-col items-center gap-4">
            <RecoveryGauge score={recovScore} />

            {scoreBreakdown?.components && (
              <div className="w-full space-y-2 pt-3 border-t border-border/50">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Score Breakdown</div>
                {scoreBreakdown.components.map((c) => (
                  <ComponentBar key={c.label} label={c.label} value={c.value} weight={c.weight} contribution={c.contribution} />
                ))}
              </div>
            )}

            {scoreBreakdown?.explanation && (
              <div className="w-full border border-border/50 rounded-lg p-3 bg-muted/20 text-[11px] text-muted-foreground">
                <Info className="size-3 inline mr-1" />
                {scoreBreakdown.explanation}
              </div>
            )}

            {candidate.similarityWarning && (
              <div className="w-full border border-amber-200 rounded-lg p-3 bg-amber-50/60 text-[11px] text-amber-800 flex items-start gap-2">
                <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
                <span><strong>Similarity Warning:</strong> {candidate.similarityWarning}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ─── Candidate Profile ─── */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="rounded-xl border border-border shadow-sm">
            <CardHeader className="pb-3 pt-5 px-5">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl font-black tracking-tight" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                    {candidate.name}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-4 mt-1.5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Mail className="size-3" />{candidate.email}</span>
                    <span className="flex items-center gap-1.5"><Briefcase className="size-3" />{candidate.roleName}</span>
                    {candidate.department && <span className="text-xs bg-muted rounded px-1.5 py-0.5">{candidate.department}</span>}
                  </div>
                </div>
                {!candidate.recovered && (
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                        <ShieldCheck className="size-4" /> Recover
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Override Rejection</DialogTitle>
                        <DialogDescription>
                          Recovery Score: <strong>{recovScore}/100</strong>. This action re-queues {candidate.name} for the hiring pipeline.
                        </DialogDescription>
                      </DialogHeader>
                      <Textarea
                        placeholder="Reason for recovery override..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="min-h-[80px] font-mono text-sm"
                      />
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleRecover} disabled={recoverMutation.isPending} className="bg-green-600 hover:bg-green-700 text-white">
                          {recoverMutation.isPending ? "Recovering..." : "Confirm Recovery"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                {candidate.recovered && (
                  <Badge className="bg-green-100 text-green-800 border border-green-200 flex items-center gap-1.5 px-3 py-1.5">
                    <ShieldCheck className="size-4" /> Recovered
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {candidate.yearsExperience != null && (
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-xl font-black">{candidate.yearsExperience}</div>
                    <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">YEARS EXP</div>
                  </div>
                )}
                {candidate.educationLevel && (
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-sm font-black capitalize">{candidate.educationLevel.replace("_", " ")}</div>
                    <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">EDUCATION</div>
                  </div>
                )}
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className={`text-xl font-black ${daysLeft <= 14 ? "text-red-600" : "text-foreground"}`}>{daysLeft}</div>
                  <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">DAYS LEFT</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-xl font-black">{decisions?.length ?? 0}</div>
                  <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">DECISIONS</div>
                </div>
              </div>

              {candidate.skills && candidate.skills.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-[10px] rounded font-mono py-0">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ─── Decision Audit Trail ─── */}
          <Card className="rounded-xl border border-border shadow-sm">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-sm font-semibold">Decision Audit Trail</CardTitle>
              <CardDescription className="text-[11px]">Each rejection with confidence score and triggered rules</CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              {decisions?.map((d) => {
                const conf = d.confidenceScore ?? 75;
                const confColor = conf >= 85 ? "text-green-700 bg-green-50 border-green-200" :
                                  conf >= 65 ? "text-blue-700 bg-blue-50 border-blue-200" :
                                  "text-red-700 bg-red-50 border-red-200";
                const strength = d.evidenceStrength ?? "moderate";
                return (
                  <div key={d.id} className="border border-border/50 rounded-lg p-4 space-y-3 bg-muted/10">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={`text-[10px] font-bold border ${confColor}`}>
                            {conf}% confidence
                          </Badge>
                          <span className={`text-[10px] font-semibold capitalize ${
                            strength === "strong" ? "text-green-600" : strength === "moderate" ? "text-blue-600" : "text-red-600"
                          }`}>
                            {strength} evidence
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(d.rejectedAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{d.rejectionSummary}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Triggered Rules</div>
                      <div className="flex flex-wrap gap-1.5">
                        {d.triggeredRules?.map((r) => (
                          <div key={r.ruleId} className="border border-border rounded px-2 py-1 text-[10px] bg-background">
                            <span className="font-semibold">{r.ruleName}</span>
                            {r.ruleAccuracy != null && (
                              <span className={`ml-1.5 ${r.ruleAccuracy < 70 ? "text-red-600 font-bold" : "text-muted-foreground"}`}>
                                ({r.ruleAccuracy}% acc)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground bg-muted/20 rounded px-2 py-1">
                      Decision Confidence = (Rule Weights: {d.triggeredRules?.map((r) => r.weightPercent ?? "?").join(" + ")}) × evidence strength modifier
                    </div>
                  </div>
                );
              })}
              {(!decisions || decisions.length === 0) && (
                <div className="text-center text-muted-foreground text-sm font-mono py-4">No decisions logged</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

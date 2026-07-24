import { useState } from "react";
import { Link } from "wouter";
import { useListCandidates } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Clock, ShieldCheck, TrendingUp, Users, AlertTriangle, Star } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

function RecoveryScoreBadge({ score }: { score: number | null | undefined }) {
  if (score == null) return <span className="text-muted-foreground text-xs">—</span>;
  const color = score >= 75 ? "bg-green-100 text-green-800 border-green-200" :
                score >= 50 ? "bg-amber-100 text-amber-800 border-amber-200" :
                "bg-red-100 text-red-800 border-red-200";
  return (
    <div className="flex items-center gap-2">
      <div className={`text-xs font-bold border rounded px-1.5 py-0.5 ${color}`}>
        {score}
      </div>
      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${score >= 75 ? "bg-green-500" : score >= 50 ? "bg-amber-500" : "bg-red-400"}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function RecommendationBadge({ rec }: { rec: string | null | undefined }) {
  if (!rec) return null;
  const styles = {
    recover: "bg-green-50 text-green-700 border-green-200",
    review:  "bg-amber-50 text-amber-700 border-amber-200",
    reject:  "bg-red-50 text-red-700 border-red-200",
  } as Record<string, string>;
  const icons = { recover: "↑", review: "?", reject: "×" };
  return (
    <Badge variant="outline" className={`text-[10px] font-bold rounded px-1.5 py-0.5 ${styles[rec] ?? ""}`}>
      {icons[rec as keyof typeof icons]} {rec.toUpperCase()}
    </Badge>
  );
}

function ScoreMiniBar({ label, value }: { label: string; value: number | null | undefined }) {
  if (value == null) return null;
  const color = value >= 80 ? "bg-green-400" : value >= 60 ? "bg-blue-400" : value >= 40 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
      <span className="w-8 shrink-0">{label}</span>
      <div className="w-10 h-1 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
      <span className="tabular-nums font-medium">{value}</span>
    </div>
  );
}

export default function Candidates() {
  const [search, setSearch] = useState("");
  const { data: candidates, isLoading } = useListCandidates({ search: search || undefined });

  const recoverRecommended = candidates?.filter((c) => c.recruiterRecommendation === "recover") ?? [];
  const reviewNeeded = candidates?.filter((c) => c.recruiterRecommendation === "review") ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold uppercase tracking-wide">Recovery Pool</h1>
          <p className="text-muted-foreground text-sm font-mono mt-1">
            Candidates ranked by Recovery Score — higher score = stronger case for wrongful rejection
          </p>
        </div>
        <div className="flex gap-3">
          <div className="text-center">
            <div className="text-2xl font-black text-green-600" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {recoverRecommended.length}
            </div>
            <div className="text-[10px] font-semibold text-green-700">RECOVER</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-amber-600" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {reviewNeeded.length}
            </div>
            <div className="text-[10px] font-semibold text-amber-700">REVIEW</div>
          </div>
        </div>
      </div>

      {/* Summary bar */}
      {candidates && candidates.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-3 flex items-center gap-3">
              <Star className="size-4 text-green-600 shrink-0" />
              <div>
                <div className="text-sm font-bold text-green-700">{recoverRecommended.length} candidates</div>
                <div className="text-[10px] text-green-600">Score ≥75 · Wrongful rejection likely</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="p-3 flex items-center gap-3">
              <AlertTriangle className="size-4 text-amber-600 shrink-0" />
              <div>
                <div className="text-sm font-bold text-amber-700">{reviewNeeded.length} candidates</div>
                <div className="text-[10px] text-amber-600">Score 50–74 · Manual review needed</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 flex items-center gap-3">
              <TrendingUp className="size-4 text-muted-foreground shrink-0" />
              <div>
                <div className="text-sm font-bold">
                  {candidates.length > 0
                    ? Math.round(candidates.reduce((s, c) => s + (c.recoveryScore ?? 0), 0) / candidates.length)
                    : 0} avg
                </div>
                <div className="text-[10px] text-muted-foreground">Pool average Recovery Score</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="py-4 border-b border-border/50">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                className="pl-9 font-mono text-sm bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              Sorted by Recovery Score ↓
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="font-mono text-xs h-10">CANDIDATE</TableHead>
                  <TableHead className="font-mono text-xs h-10">ROLE</TableHead>
                  <TableHead className="font-mono text-xs h-10">RECOVERY SCORE</TableHead>
                  <TableHead className="font-mono text-xs h-10">MATCH BREAKDOWN</TableHead>
                  <TableHead className="font-mono text-xs h-10">RECOMMENDATION</TableHead>
                  <TableHead className="font-mono text-xs h-10 text-right">EXPIRES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates?.map((candidate) => {
                  const daysLeft = Math.ceil((new Date(candidate.retentionExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  const isUrgent = daysLeft <= 14;
                  return (
                    <TableRow key={candidate.id} className="border-border/50 hover:bg-muted/20">
                      <TableCell>
                        <div className="space-y-0.5">
                          <Link href={`/app/candidates/${candidate.id}`} className="font-medium text-sm hover:text-primary transition-colors block">
                            {candidate.name}
                          </Link>
                          <div className="text-[10px] font-mono text-muted-foreground">{candidate.email}</div>
                          {candidate.similarityWarning && (
                            <div className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
                              <AlertTriangle className="size-2.5" />
                              {candidate.similarityWarning}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <span className="text-xs font-mono text-muted-foreground block">{candidate.roleName}</span>
                          {candidate.yearsExperience != null && (
                            <span className="text-[10px] text-muted-foreground/70">{candidate.yearsExperience}y exp · {candidate.educationLevel?.replace("_", " ")}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <RecoveryScoreBadge score={candidate.recoveryScore} />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <ScoreMiniBar label="Skill" value={candidate.skillMatch} />
                          <ScoreMiniBar label="Exp" value={candidate.experienceMatch} />
                          <ScoreMiniBar label="Edu" value={candidate.educationMatch} />
                        </div>
                      </TableCell>
                      <TableCell>
                        {candidate.recovered ? (
                          <Badge variant="outline" className="font-mono text-[10px] rounded-sm py-0 border-primary/50 text-primary bg-primary/5 flex items-center gap-1 w-fit">
                            <ShieldCheck className="size-2.5" /> RECOVERED
                          </Badge>
                        ) : (
                          <RecommendationBadge rec={candidate.recruiterRecommendation} />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={`flex items-center justify-end gap-1 text-xs font-mono ${isUrgent ? "text-red-600 font-bold" : "text-muted-foreground"}`}>
                          <Clock className="size-3" />
                          {daysLeft}d
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {candidates?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground font-mono text-sm">
                      No candidates found in the retention window.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="text-[11px] text-muted-foreground bg-muted/30 border border-border/50 rounded-lg p-3 space-y-0.5">
        <p className="font-semibold">How Recovery Score works:</p>
        <p>Score = (Skill Match × 35%) + (Experience Match × 30%) + (Education Match × 20%) + (ATS Confidence Inverse × 15%)</p>
        <p>≥75 = Recommend Recovery · 50–74 = Manual Review · &lt;50 = Low priority</p>
      </div>
    </div>
  );
}

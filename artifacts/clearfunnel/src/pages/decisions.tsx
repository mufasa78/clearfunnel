import { useState } from "react";
import { Link } from "wouter";
import { useListDecisions } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ShieldCheck, ShieldAlert, AlertTriangle, Info } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

function ConfidenceBadge({ score }: { score: number | null | undefined }) {
  if (score == null) return <span className="text-muted-foreground text-xs">—</span>;
  const color = score >= 85 ? "bg-green-100 text-green-800 border-green-200" :
                score >= 65 ? "bg-blue-100 text-blue-800 border-blue-200" :
                "bg-red-100 text-red-800 border-red-200";
  const label = score >= 85 ? "Strong" : score >= 65 ? "Moderate" : "Weak";
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className={`text-xs font-bold border rounded px-1.5 py-0.5 ${color}`}>{score}%</div>
      <div className={`text-[9px] font-medium ${
        score >= 85 ? "text-green-700" : score >= 65 ? "text-blue-700" : "text-red-700"
      }`}>{label}</div>
    </div>
  );
}

export default function Decisions() {
  const [search, setSearch] = useState("");
  const { data: response, isLoading } = useListDecisions({ limit: 50 });

  const decisions = response?.decisions ?? [];
  const summary = response?.summary;

  const filtered = decisions.filter((d) =>
    !search ||
    d.candidateName?.toLowerCase().includes(search.toLowerCase()) ||
    d.roleName?.toLowerCase().includes(search.toLowerCase()) ||
    d.triggeredRules?.some((r) => r.ruleName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-mono font-bold uppercase tracking-wide">Decision Log</h1>
        <p className="text-muted-foreground text-sm font-mono mt-1">
          Immutable audit trail with Decision Confidence Scores — how certain is each rejection?
        </p>
      </div>

      {/* Confidence distribution */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-black text-green-600" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {summary?.strongDecisions ?? 0}
            </div>
            <div className="text-[10px] text-green-700 font-semibold mt-0.5">STRONG (≥85%)</div>
            <div className="text-[9px] text-green-600">{summary?.strongPct ?? 0}% of all decisions</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-black" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {summary?.avgConfidence ?? 0}%
            </div>
            <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">AVG CONFIDENCE</div>
            <div className="text-[9px] text-muted-foreground">Across all decisions</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-black text-red-600" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {summary?.weakDecisions ?? 0}
            </div>
            <div className="text-[10px] text-red-700 font-semibold mt-0.5">WEAK (&lt;65%)</div>
            <div className="text-[9px] text-red-600">{summary?.weakPct ?? 0}% need review</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-100 bg-blue-50/30">
        <CardContent className="p-3 flex items-start gap-2">
          <Info className="size-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-800">
            <strong>Decision Confidence Score</strong> = (Σ Rule Weights / Max Possible Weight) × 70% + (Average Rule Accuracy) × 20% + (Evidence Count Factor) × 10%.
            A score below 65% indicates the rejection may be based on weak evidence — these candidates should be prioritised for recovery review.
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="py-4 border-b border-border/50">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidate, role, or rule..."
                className="pl-9 font-mono text-sm bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Badge variant="outline" className="font-mono text-xs rounded-sm border-border/50">
              {response?.total ?? 0} TOTAL
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="font-mono text-xs h-10">CONFIDENCE</TableHead>
                  <TableHead className="font-mono text-xs h-10">CANDIDATE</TableHead>
                  <TableHead className="font-mono text-xs h-10">ROLE</TableHead>
                  <TableHead className="font-mono text-xs h-10">TRIGGERED RULES</TableHead>
                  <TableHead className="font-mono text-xs h-10">DATE</TableHead>
                  <TableHead className="font-mono text-xs h-10 text-right">STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((decision) => (
                  <TableRow key={decision.id} className={`border-border/50 hover:bg-muted/20 ${
                    (decision.confidenceScore ?? 75) < 65 ? "bg-red-50/20" : ""
                  }`}>
                    <TableCell>
                      <ConfidenceBadge score={decision.confidenceScore} />
                    </TableCell>
                    <TableCell>
                      <Link href={`/app/candidates/${decision.candidateId}`} className="font-medium text-sm hover:text-primary transition-colors block">
                        {decision.candidateName}
                      </Link>
                      {decision.recruiterId && (
                        <div className="text-[10px] text-muted-foreground font-mono">{decision.recruiterId}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-mono text-muted-foreground">{decision.roleName}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {decision.triggeredRules?.map((rule) => {
                          const isLowAccuracy = (rule.ruleAccuracy != null) && rule.ruleAccuracy < 70;
                          return (
                            <Badge key={rule.ruleId} variant="secondary" className={`font-mono text-[10px] rounded-sm py-0 ${isLowAccuracy ? "border border-red-200 bg-red-50 text-red-700" : ""}`}>
                              {rule.ruleName}
                              {isLowAccuracy && <span className="ml-1 text-red-500">!</span>}
                            </Badge>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {new Date(decision.rejectedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {decision.recovered ? (
                        <Badge variant="outline" className="font-mono text-[10px] rounded-sm py-0 border-primary/50 text-primary bg-primary/5 flex items-center gap-1 w-fit ml-auto">
                          <ShieldCheck className="size-2.5" /> RECOVERED
                        </Badge>
                      ) : (decision.confidenceScore ?? 75) < 65 ? (
                        <Badge variant="outline" className="font-mono text-[10px] rounded-sm py-0 border-amber-500/50 text-amber-700 bg-amber-50 flex items-center gap-1 w-fit ml-auto">
                          <AlertTriangle className="size-2.5" /> REVIEW
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="font-mono text-[10px] rounded-sm py-0 border-destructive/50 text-destructive bg-destructive/5">
                          REJECTED
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground font-mono text-sm">
                      No decisions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

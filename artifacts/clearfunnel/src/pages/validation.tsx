import { useState } from "react";
import { useListValidationRuns, useListBenchmarkResumes, getListBenchmarkResumesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, Clock, FileText, Info, Target, BarChart3 } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

function ConfidencePill({ confidence }: { confidence: number | null | undefined }) {
  if (confidence == null) return null;
  const color = confidence >= 80 ? "bg-green-100 text-green-800 border-green-200" :
                confidence >= 60 ? "bg-blue-100 text-blue-800 border-blue-200" :
                confidence >= 40 ? "bg-amber-100 text-amber-800 border-amber-200" :
                "bg-red-100 text-red-800 border-red-200";
  const label = confidence >= 80 ? "High" : confidence >= 60 ? "Moderate" : confidence >= 40 ? "Low" : "Very Low";
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className={`text-xs font-bold border rounded px-2 py-0.5 ${color}`}>{confidence}%</div>
      <div className="text-[9px] text-muted-foreground">{label}</div>
    </div>
  );
}

function PassRateBar({ passCount, failCount }: { passCount: number; failCount: number }) {
  const total = passCount + failCount;
  if (total === 0) return null;
  const passPct = Math.round((passCount / total) * 100);
  return (
    <div className="space-y-1 min-w-[100px]">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-green-600 font-semibold">{passPct}% pass</span>
        <span className="text-red-500 font-semibold">{100 - passPct}% fail</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden flex">
        <div className="h-full bg-green-500 rounded-l-full" style={{ width: `${passPct}%` }} />
        <div className="h-full bg-red-400 rounded-r-full" style={{ width: `${100 - passPct}%` }} />
      </div>
      <div className="text-[9px] text-muted-foreground text-center">{passCount} / {total} benchmarks</div>
    </div>
  );
}

export default function Validation() {
  const { data: runs, isLoading: isRunsLoading } = useListValidationRuns();
  const { data: resumes, isLoading: isResumesLoading } = useListBenchmarkResumes();

  const totalRuns = runs?.length ?? 0;
  const passedRuns = runs?.filter((r) => r.status === "passed").length ?? 0;
  const avgConfidence = runs && runs.length > 0
    ? Math.round(runs.reduce((s, r) => s + (r.validationConfidence ?? 0), 0) / runs.length)
    : 0;
  const avgPassRate = runs && runs.length > 0
    ? Math.round(runs.reduce((s, r) => s + (r.passRate ?? 0), 0) / runs.length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-mono font-bold uppercase tracking-wide">Validation Harness</h1>
        <p className="text-muted-foreground text-sm font-mono mt-1">
          Test ATS rules against benchmark resumes before production · Validation Confidence = pass rate × historical accuracy × evidence completeness
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-black" style={{ fontFamily: "'Satoshi', sans-serif" }}>{totalRuns}</div>
            <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">TOTAL RUNS</div>
          </CardContent>
        </Card>
        <Card className={`${passedRuns / Math.max(totalRuns, 1) >= 0.7 ? "border-green-200 bg-green-50/40" : "border-red-200 bg-red-50/40"}`}>
          <CardContent className="p-3 text-center">
            <div className={`text-2xl font-black ${passedRuns / Math.max(totalRuns, 1) >= 0.7 ? "text-green-600" : "text-red-600"}`} style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {totalRuns > 0 ? Math.round((passedRuns / totalRuns) * 100) : 0}%
            </div>
            <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">PASS RATE</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-black" style={{ fontFamily: "'Satoshi', sans-serif" }}>{avgPassRate}%</div>
            <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">AVG BENCHMARK PASS</div>
          </CardContent>
        </Card>
        <Card className={`${avgConfidence >= 70 ? "border-blue-200 bg-blue-50/40" : "border-amber-200 bg-amber-50/40"}`}>
          <CardContent className="p-3 text-center">
            <div className={`text-2xl font-black ${avgConfidence >= 70 ? "text-blue-600" : "text-amber-600"}`} style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {avgConfidence}%
            </div>
            <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">AVG CONFIDENCE</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-100 bg-blue-50/30">
        <CardContent className="p-3 flex items-start gap-2">
          <Info className="size-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-800">
            <strong>Validation Confidence</strong> = Pass Rate × Historical Rule Accuracy × Evidence Completeness (benchmark count / target 10).
            A score below 60% means the rule needs more benchmark data or significant accuracy improvement before it's safe to activate.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="runs" className="w-full">
        <TabsList className="bg-muted/20 border border-border/50 w-full justify-start rounded-none h-10 p-0 mb-6">
          <TabsTrigger value="runs" className="font-mono text-xs rounded-none h-10 data-[state=active]:bg-card data-[state=active]:border-b-2 data-[state=active]:border-primary">
            VALIDATION RUNS ({totalRuns})
          </TabsTrigger>
          <TabsTrigger value="benchmarks" className="font-mono text-xs rounded-none h-10 data-[state=active]:bg-card data-[state=active]:border-b-2 data-[state=active]:border-primary">
            BENCHMARK SET ({resumes?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="runs" className="space-y-0">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-0">
              {isRunsLoading ? (
                <div className="p-4 space-y-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="font-mono text-xs h-10">RUN</TableHead>
                      <TableHead className="font-mono text-xs h-10">PASS RATE</TableHead>
                      <TableHead className="font-mono text-xs h-10 text-center">CONFIDENCE</TableHead>
                      <TableHead className="font-mono text-xs h-10">STATUS</TableHead>
                      <TableHead className="font-mono text-xs h-10">DATE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {runs?.map((run) => (
                      <TableRow key={run.id} className="border-border/50 hover:bg-muted/20">
                        <TableCell>
                          <Link href={`/app/rules/${run.ruleId}`} className="font-mono font-bold text-sm hover:text-primary">
                            Run #{run.id}
                          </Link>
                          <div className="text-[10px] font-mono text-muted-foreground">Rule #{run.ruleId} · {run.benchmarkCount} benchmarks</div>
                        </TableCell>
                        <TableCell>
                          <PassRateBar passCount={run.passCount} failCount={run.failCount} />
                        </TableCell>
                        <TableCell className="text-center">
                          <ConfidencePill confidence={run.validationConfidence} />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`font-mono text-[10px] rounded-sm py-0 ${
                            run.status === "passed" ? "border-primary/50 text-primary bg-primary/5" :
                            run.status === "failed" ? "border-destructive/50 text-destructive bg-destructive/5" :
                            "text-muted-foreground"
                          }`}>
                            {run.status === "passed" ? "✓" : run.status === "failed" ? "✗" : "⏳"} {run.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {run.completedAt ? new Date(run.completedAt).toLocaleDateString() : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!runs || runs.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground font-mono text-sm">
                          No validation runs yet. Go to <Link href="/app/rules" className="text-primary hover:underline">Rule Registry</Link> to trigger one.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-4">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="py-4 px-5 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">Benchmark Resume Set</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Standardised test corpus — each resume has a known expected outcome (pass/fail)
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-xs rounded-sm">{resumes?.length ?? 0} RESUMES</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isResumesLoading ? (
                <div className="p-4 space-y-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="font-mono text-xs h-10">BENCHMARK</TableHead>
                      <TableHead className="font-mono text-xs h-10">SCENARIO</TableHead>
                      <TableHead className="font-mono text-xs h-10">EXPECTED</TableHead>
                      <TableHead className="font-mono text-xs h-10">TAGS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resumes?.map((r) => (
                      <TableRow key={r.id} className="border-border/50 hover:bg-muted/20">
                        <TableCell>
                          <div className="font-medium text-sm">{r.candidateName}</div>
                          <div className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px]">{r.background}</div>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs text-muted-foreground max-w-xs">{r.scenario}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`font-mono text-[10px] rounded-sm py-0 ${
                            r.expectedOutcome === "pass" ? "border-primary/50 text-primary bg-primary/5" :
                            "border-destructive/50 text-destructive bg-destructive/5"
                          }`}>
                            {r.expectedOutcome === "pass" ? "✓ PASS" : "✗ FAIL"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {r.tags.map((t) => (
                              <Badge key={t} variant="secondary" className="font-mono text-[9px] rounded-sm py-0">{t}</Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

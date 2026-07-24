import { useState } from "react";
import { Link } from "wouter";
import { useListRules, useTriggerRuleValidation, getListRulesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Play, AlertTriangle, CheckCircle2, Lightbulb, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

function AccuracyBar({ accuracy, fpRate, fnRate }: { accuracy: number; fpRate: number; fnRate: number }) {
  const accColor = accuracy >= 90 ? "bg-green-500" : accuracy >= 75 ? "bg-blue-500" : accuracy >= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="space-y-1 min-w-[120px]">
      <div className="flex items-center justify-between text-[10px]">
        <span className="font-semibold text-foreground">{accuracy.toFixed(0)}% accurate</span>
        {fpRate > 20 && (
          <span className="text-red-600 font-bold">{fpRate.toFixed(0)}% FP</span>
        )}
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden flex gap-0.5">
        <div className={`h-full ${accColor} rounded-l-full`} style={{ width: `${accuracy}%` }} />
        <div className="h-full bg-red-400/70 rounded-r-full" style={{ width: `${fpRate}%` }} />
      </div>
      <div className="flex gap-3 text-[9px] text-muted-foreground">
        <span>Correct: {accuracy.toFixed(0)}%</span>
        <span className="text-red-600">FP: {fpRate.toFixed(0)}%</span>
        {fnRate > 0 && <span className="text-amber-600">FN: {fnRate.toFixed(0)}%</span>}
      </div>
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const styles = {
    low:      "bg-green-50 text-green-700 border-green-200",
    medium:   "bg-amber-50 text-amber-700 border-amber-200",
    high:     "bg-orange-50 text-orange-700 border-orange-200",
    critical: "bg-red-50 text-red-700 border-red-200",
  } as Record<string, string>;
  return (
    <Badge variant="outline" className={`text-[10px] font-bold rounded px-1.5 py-0.5 uppercase ${styles[level] ?? ""}`}>
      {level}
    </Badge>
  );
}

export default function Rules() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { data: response, isLoading } = useListRules();
  const triggerValidation = useTriggerRuleValidation();

  const rules = response?.rules ?? [];
  const summary = response?.summary;

  const handleValidate = (id: number) => {
    triggerValidation.mutate({ id }, {
      onSuccess: () => {
        toast.success("Validation triggered");
        queryClient.invalidateQueries({ queryKey: getListRulesQueryKey() });
      },
      onError: () => toast.error("Failed to trigger validation"),
    });
  };

  const filteredRules = rules.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.ruleType.toLowerCase().includes(search.toLowerCase())
  );

  const optimizerFlags = rules.filter((r) => r.optimizerRecommendation).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold uppercase tracking-wide">Rule Registry</h1>
          <p className="text-muted-foreground text-sm font-mono mt-1">
            Performance metrics for every ATS filter · accuracy = correct decisions / total triggered
          </p>
        </div>
        <Button className="font-mono text-xs gap-2">
          <Plus className="size-4" /> NEW RULE
        </Button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-black text-foreground" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {summary?.avgAccuracy?.toFixed(0) ?? 0}%
            </div>
            <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">AVG RULE ACCURACY</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-black text-foreground" style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {(summary?.totalTriggered ?? 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">TOTAL TRIGGERED</div>
          </CardContent>
        </Card>
        <Card className={`border-${summary?.highRiskRules ? "red" : "border"}-200 ${summary?.highRiskRules ? "bg-red-50/50" : ""}`}>
          <CardContent className="p-3 text-center">
            <div className={`text-2xl font-black ${summary?.highRiskRules ? "text-red-600" : "text-foreground"}`} style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {summary?.highRiskRules ?? 0}
            </div>
            <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">HIGH RISK RULES</div>
          </CardContent>
        </Card>
        <Card className={`border-${optimizerFlags ? "amber" : "border"}-200 ${optimizerFlags ? "bg-amber-50/50" : ""}`}>
          <CardContent className="p-3 text-center">
            <div className={`text-2xl font-black ${optimizerFlags ? "text-amber-600" : "text-foreground"}`} style={{ fontFamily: "'Satoshi', sans-serif" }}>
              {optimizerFlags}
            </div>
            <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">OPTIMIZER FLAGS</div>
          </CardContent>
        </Card>
      </div>

      {/* Optimizer recommendations */}
      {filteredRules.filter((r) => r.optimizerRecommendation).length > 0 && (
        <Card className="border-amber-200 bg-amber-50/40">
          <CardHeader className="pb-2 pt-4 px-5">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-amber-600" />
              <CardTitle className="text-sm font-semibold text-amber-800">Rule Optimizer Recommendations</CardTitle>
            </div>
            <CardDescription className="text-xs text-amber-700">
              Based on {(summary?.totalTriggered ?? 0).toLocaleString()} historical decisions analysed
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-4 space-y-3">
            {filteredRules.filter((r) => r.optimizerRecommendation).map((rule) => (
              <div key={rule.id} className="flex items-start gap-3 border border-amber-200 rounded-lg p-3 bg-white/60">
                <AlertTriangle className="size-3.5 text-amber-600 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-amber-900">{rule.name}</span>
                    <RiskBadge level={rule.riskLevel ?? "medium"} />
                    <span className="text-[10px] text-amber-700">{rule.fpRate?.toFixed(0)}% false positive rate</span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1 leading-snug">{rule.optimizerRecommendation}</p>
                </div>
                <Link href={`/app/rules/${rule.id}`}>
                  <Button size="sm" variant="outline" className="text-[10px] h-6 px-2 border-amber-300 text-amber-800 hover:bg-amber-100 shrink-0">
                    Review
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="py-4 border-b border-border/50">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rules..."
                className="pl-9 font-mono text-sm bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <Badge variant="outline" className="rounded-sm border-border/50">{rules.length} TOTAL</Badge>
              <Badge variant="outline" className="rounded-sm border-primary/50 text-primary bg-primary/5">
                {rules.filter((r) => r.status === "active").length} ACTIVE
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="font-mono text-xs h-10">RULE</TableHead>
                  <TableHead className="font-mono text-xs h-10">ACCURACY / FALSE POSITIVES</TableHead>
                  <TableHead className="font-mono text-xs h-10 text-center">TRIGGERED</TableHead>
                  <TableHead className="font-mono text-xs h-10 text-center">WEIGHT</TableHead>
                  <TableHead className="font-mono text-xs h-10">RISK</TableHead>
                  <TableHead className="font-mono text-xs h-10">STATUS</TableHead>
                  <TableHead className="font-mono text-xs h-10 text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => (
                  <TableRow key={rule.id} className={`border-border/50 hover:bg-muted/20 ${rule.riskLevel === "critical" ? "bg-red-50/30" : rule.riskLevel === "high" ? "bg-orange-50/20" : ""}`}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <Link href={`/app/rules/${rule.id}`} className="font-medium text-sm hover:text-primary transition-colors block">
                          {rule.name}
                        </Link>
                        <div className="text-[10px] font-mono text-muted-foreground uppercase">{rule.ruleType.replace("_", " ")}</div>
                        {rule.optimizerRecommendation && (
                          <div className="flex items-center gap-1 text-[10px] text-amber-600">
                            <Lightbulb className="size-2.5" /> Optimizer flag
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <AccuracyBar
                        accuracy={rule.accuracyScore ?? 100}
                        fpRate={rule.fpRate ?? 0}
                        fnRate={rule.fnRate ?? 0}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-mono text-sm font-bold">{(rule.triggeredCount ?? 0).toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground">{(rule.correctCount ?? 0).toLocaleString()} correct</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-mono text-sm font-bold">{rule.weightPercent ?? 50}%</div>
                    </TableCell>
                    <TableCell>
                      <RiskBadge level={rule.riskLevel ?? "low"} />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-mono text-[10px] rounded-sm py-0 ${
                        rule.status === "active" ? "border-primary/50 text-primary bg-primary/5" :
                        rule.status === "pending_validation" ? "border-amber-500/50 text-amber-700 bg-amber-50" :
                        "border-border/50 text-muted-foreground"
                      }`}>
                        {rule.status === "pending_validation" ? "PENDING" : rule.status?.toUpperCase()}
                      </Badge>
                      {rule.validationStatus === "failed" && (
                        <div className="text-[9px] text-red-600 font-medium mt-0.5">Validation failed</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-mono text-[10px] h-7 px-2 gap-1"
                        onClick={() => handleValidate(rule.id)}
                        disabled={triggerValidation.isPending}
                      >
                        <Play className="size-3" /> TEST
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRules.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground font-mono text-sm">
                      No rules found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="text-[11px] text-muted-foreground bg-muted/30 border border-border/50 rounded-lg p-3 space-y-0.5">
        <p className="font-semibold">Rule Accuracy = Correct Decisions / Total Triggered · False Positive Rate = Wrongly Rejected / Total Triggered</p>
        <p>Risk levels: Low &lt;10% FP · Medium 10–25% · High 25–40% · Critical &gt;40% — Critical rules should be reviewed or replaced immediately.</p>
      </div>
    </div>
  );
}

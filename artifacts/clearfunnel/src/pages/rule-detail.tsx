import { useParams, Link } from "wouter";
import { useGetRule, useTriggerRuleValidation, getGetRuleQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, GitBranch, Play, Clock, CheckCircle2, XCircle, FileText, Database, Settings } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RuleDetail() {
  const { id } = useParams();
  const ruleId = parseInt(id || "0", 10);
  const queryClient = useQueryClient();
  
  const { data: detail, isLoading } = useGetRule(ruleId, { 
    query: { enabled: !!ruleId, queryKey: getGetRuleQueryKey(ruleId) } 
  });
  const triggerValidation = useTriggerRuleValidation();

  const handleValidate = () => {
    triggerValidation.mutate({ id: ruleId }, {
      onSuccess: () => {
        toast.success("Validation triggered", { description: "Running against benchmark resumes." });
        queryClient.invalidateQueries({ queryKey: getGetRuleQueryKey(ruleId) });
      },
      onError: () => toast.error("Failed to trigger validation")
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!detail) {
    return <div>Rule not found</div>;
  }

  const { rule, history, validationRuns } = detail;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/app/rules" className="text-xs font-mono text-muted-foreground flex items-center gap-1 hover:text-foreground mb-4 w-fit">
          <ArrowLeft className="size-3" /> BACK TO REGISTRY
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-mono font-bold tracking-tight">{rule.name}</h1>
              <Badge variant="outline" className="font-mono text-xs rounded bg-muted/30">
                v{rule.version}
              </Badge>
              <Badge 
                variant={rule.status === 'active' ? 'default' : 'outline'} 
                className={`font-mono text-[10px] rounded-sm py-0 ${rule.status === 'active' ? 'bg-primary/20 text-primary' : ''}`}
              >
                {rule.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1 max-w-3xl">{rule.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="font-mono text-xs">EDIT RULE</Button>
            <Button onClick={handleValidate} disabled={triggerValidation.isPending} className="font-mono text-xs gap-2">
              <Play className="size-4" />
              RUN VALIDATION
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-mono flex items-center gap-2 text-muted-foreground">
                <Database className="size-4" />
                CRITERIA DEFINITION
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="bg-muted/30 border border-border/30 rounded p-4 font-mono text-sm whitespace-pre-wrap text-foreground/90">
                {rule.criteria || "No plain-text criteria provided."}
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Settings className="size-3" /> Type: {rule.ruleType}
                </div>
                {rule.roleName && (
                  <div className="flex items-center gap-1">
                    <FileText className="size-3" /> Target Role: {rule.roleName}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="validation" className="w-full">
            <TabsList className="bg-muted/20 border border-border/50 w-full justify-start rounded-none h-10 p-0">
              <TabsTrigger value="validation" className="font-mono text-xs rounded-none h-10 data-[state=active]:bg-card data-[state=active]:border-b-2 data-[state=active]:border-primary">
                VALIDATION RUNS ({validationRuns.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="font-mono text-xs rounded-none h-10 data-[state=active]:bg-card data-[state=active]:border-b-2 data-[state=active]:border-primary">
                VERSION HISTORY
              </TabsTrigger>
            </TabsList>
            <TabsContent value="validation" className="pt-4 space-y-4">
              {validationRuns.map((run) => (
                <div key={run.id} className="p-4 border border-border/50 rounded bg-card/30 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold">Run #{run.id}</span>
                      <Badge variant="outline" className={`font-mono text-[10px] rounded-sm py-0 ${
                        run.status === 'passed' ? 'text-primary border-primary/50 bg-primary/5' : 
                        run.status === 'failed' ? 'text-destructive border-destructive/50 bg-destructive/5' : ''
                      }`}>
                        {run.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        {new Date(run.startedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tested against {run.benchmarkCount} benchmark resumes. {run.passCount} passed expected outcomes.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-mono font-bold">
                      {run.benchmarkCount > 0 ? Math.round((run.passCount / run.benchmarkCount) * 100) : 0}%
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase">Accuracy</div>
                  </div>
                </div>
              ))}
              {validationRuns.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground font-mono border border-dashed border-border/50 rounded">
                  No validation runs recorded.
                </div>
              )}
            </TabsContent>
            <TabsContent value="history" className="pt-4">
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
                {history.map((entry, idx) => (
                  <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-muted/50 text-muted-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                      <GitBranch className="size-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-border/50 bg-card/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-sm">v{entry.version}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{new Date(entry.changedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{entry.changes}</p>
                      <div className="mt-2 text-[10px] font-mono text-muted-foreground">By {entry.changedBy}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-mono text-muted-foreground">STATUS</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex justify-between items-center text-sm font-mono">
                <span className="text-muted-foreground">Current State</span>
                <span className={rule.status === 'active' ? 'text-primary' : ''}>{rule.status.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-mono">
                <span className="text-muted-foreground">Validation</span>
                <span className="flex items-center gap-1">
                  {rule.validationStatus === 'passed' ? <><CheckCircle2 className="size-3 text-primary"/> Passed</> : 
                   rule.validationStatus === 'failed' ? <><XCircle className="size-3 text-destructive"/> Failed</> : 
                   <><Clock className="size-3 text-muted-foreground"/> Not Run</>}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm font-mono">
                <span className="text-muted-foreground">Last Validated</span>
                <span>{rule.lastValidatedAt ? new Date(rule.lastValidatedAt).toLocaleDateString() : 'Never'}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-mono text-muted-foreground">METADATA</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-muted-foreground uppercase">Created By</div>
                <div className="text-sm">{rule.createdBy || 'System'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-muted-foreground uppercase">Created At</div>
                <div className="text-sm font-mono">{new Date(rule.createdAt).toLocaleString()}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-muted-foreground uppercase">Last Updated</div>
                <div className="text-sm font-mono">{new Date(rule.updatedAt).toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

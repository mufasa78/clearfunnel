import { useState } from "react";
import { Link } from "wouter";
import { useListRules, useTriggerRuleValidation, getListRulesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Play, ShieldAlert, CheckCircle2, Clock, GitBranch } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Rules() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { data: rules, isLoading } = useListRules();
  const triggerValidation = useTriggerRuleValidation();

  const handleValidate = (id: number) => {
    triggerValidation.mutate({ id }, {
      onSuccess: () => {
        toast.success("Validation triggered", {
          description: "A new benchmark run has started for this rule."
        });
        queryClient.invalidateQueries({ queryKey: getListRulesQueryKey() });
      },
      onError: () => {
        toast.error("Failed to trigger validation");
      }
    });
  };

  const filteredRules = rules?.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.ruleType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold uppercase tracking-wide">Rule Registry</h1>
          <p className="text-muted-foreground text-sm font-mono mt-1">Manage and validate auto-rejection criteria</p>
        </div>
        <Button className="font-mono text-xs gap-2">
          <Plus className="size-4" />
          NEW RULE
        </Button>
      </div>

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
              <Badge variant="outline" className="rounded-sm border-border/50">{rules?.length || 0} TOTAL</Badge>
              <Badge variant="outline" className="rounded-sm border-primary/50 text-primary bg-primary/5">{rules?.filter(r => r.status === 'active').length || 0} ACTIVE</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="font-mono text-xs h-10">RULE</TableHead>
                  <TableHead className="font-mono text-xs h-10">TYPE</TableHead>
                  <TableHead className="font-mono text-xs h-10">STATUS</TableHead>
                  <TableHead className="font-mono text-xs h-10">VALIDATION</TableHead>
                  <TableHead className="font-mono text-xs h-10 text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules?.map((rule) => (
                  <TableRow key={rule.id} className="border-border/50 hover:bg-muted/20">
                    <TableCell>
                      <div className="space-y-1">
                        <Link href={`/app/rules/${rule.id}`} className="font-medium text-sm hover:text-primary transition-colors">
                          {rule.name}
                        </Link>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                          <span className="flex items-center gap-1"><GitBranch className="size-3" /> v{rule.version}</span>
                          {rule.roleName && <span>• Role: {rule.roleName}</span>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-[10px] rounded-sm py-0">
                        {rule.ruleType.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={rule.status === 'active' ? 'default' : 'outline'} 
                        className={`font-mono text-[10px] rounded-sm py-0 ${rule.status === 'active' ? 'bg-primary/20 text-primary hover:bg-primary/30' : ''}`}
                      >
                        {rule.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {rule.validationStatus === 'passed' && (
                        <div className="flex items-center gap-1.5 text-primary text-xs font-mono">
                          <CheckCircle2 className="size-3" /> PASSED
                        </div>
                      )}
                      {rule.validationStatus === 'failed' && (
                        <div className="flex items-center gap-1.5 text-destructive text-xs font-mono">
                          <ShieldAlert className="size-3" /> FAILED
                        </div>
                      )}
                      {(rule.validationStatus === 'not_run' || !rule.validationStatus) && (
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-mono">
                          <Clock className="size-3" /> NOT RUN
                        </div>
                      )}
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {rule.lastValidatedAt ? new Date(rule.lastValidatedAt).toLocaleDateString() : 'Never'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 font-mono text-[10px] bg-transparent border-border/50 hover:bg-muted/50"
                          onClick={() => handleValidate(rule.id)}
                          disabled={triggerValidation.isPending}
                        >
                          <Play className="size-3 mr-1" /> RUN TEST
                        </Button>
                        <Button variant="ghost" size="sm" asChild className="h-8 font-mono text-[10px]">
                          <Link href={`/app/rules/${rule.id}`}>VIEW</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRules?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground font-mono text-sm">
                      No rules found.
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

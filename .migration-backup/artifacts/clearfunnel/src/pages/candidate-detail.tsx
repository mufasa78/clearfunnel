import { useParams, Link } from "wouter";
import { useGetCandidate, useRecoverCandidate, getGetCandidateQueryKey, getListCandidatesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Mail, Briefcase, Calendar, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
    if (!reason.trim()) {
      toast.error("Please provide a reason for recovery");
      return;
    }
    
    recoverMutation.mutate({ 
      id: candidateId, 
      data: { reason, recoveredBy: "Current User" } 
    }, {
      onSuccess: () => {
        toast.success("Candidate recovered successfully");
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: getGetCandidateQueryKey(candidateId) });
        queryClient.invalidateQueries({ queryKey: getListCandidatesQueryKey() });
      },
      onError: () => toast.error("Failed to recover candidate")
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

  if (!detail) {
    return <div>Candidate not found</div>;
  }

  const { candidate, decisions } = detail;
  const daysLeft = Math.ceil((new Date(candidate.retentionExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/app/candidates" className="text-xs font-mono text-muted-foreground flex items-center gap-1 hover:text-foreground mb-4 w-fit">
          <ArrowLeft className="size-3" /> BACK TO POOL
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-mono font-bold tracking-tight">{candidate.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground font-mono">
              <span className="flex items-center gap-1.5"><Mail className="size-3" /> {candidate.email}</span>
              <span className="flex items-center gap-1.5"><Briefcase className="size-3" /> {candidate.roleName}</span>
            </div>
          </div>
          <div>
            {candidate.recovered ? (
              <Badge variant="outline" className="font-mono text-xs rounded bg-primary/10 text-primary border-primary/30 px-3 py-1 flex items-center gap-1.5">
                <ShieldCheck className="size-4" /> RECOVERED
              </Badge>
            ) : (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="font-mono text-xs gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <ShieldCheck className="size-4" /> OVERRIDE REJECTION
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] border-border/50 bg-card">
                  <DialogHeader>
                    <DialogTitle className="font-mono uppercase tracking-tight">Recover Candidate</DialogTitle>
                    <DialogDescription className="font-mono text-xs">
                      This will override the ATS rejection and move the candidate back into the active pipeline.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-muted-foreground">Justification</label>
                      <Textarea 
                        placeholder="Provide reasoning for audit logs..."
                        className="font-mono text-sm bg-background border-border/50 resize-none"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="font-mono text-xs" onClick={() => setOpen(false)}>CANCEL</Button>
                    <Button 
                      className="font-mono text-xs" 
                      onClick={handleRecover}
                      disabled={recoverMutation.isPending}
                    >
                      {recoverMutation.isPending ? "RECOVERING..." : "CONFIRM RECOVERY"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-mono flex items-center gap-2 text-muted-foreground">
                <AlertTriangle className="size-4" />
                AUTOMATED REJECTION SUMMARY
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-foreground/90 font-mono whitespace-pre-wrap leading-relaxed">
                {candidate.rejectionSummary}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground">Rule Triggers</h3>
            {decisions.map((decision) => (
              <Card key={decision.id} className="border-border/50 bg-card/30">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pb-2 border-b border-border/30">
                    <span className="flex items-center gap-1.5"><Calendar className="size-3" /> {new Date(decision.rejectedAt).toLocaleString()}</span>
                    <span>Decision ID: #{decision.id}</span>
                  </div>
                  <div className="space-y-3">
                    {decision.triggeredRules.map((rule, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="mt-0.5 shrink-0 flex items-center justify-center size-5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 text-[10px] font-mono font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-mono text-sm font-bold text-destructive-foreground">{rule.ruleName}</div>
                          <div className="text-xs text-muted-foreground mt-1">{rule.ruleDescription}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-mono text-muted-foreground">RETENTION STATUS</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {candidate.recovered ? (
                <div className="space-y-4">
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded">
                    <div className="text-[10px] font-mono text-primary uppercase mb-1">Recovered By</div>
                    <div className="text-sm font-mono">{candidate.recoveredBy}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase">Recovery Reason</div>
                    <div className="text-xs text-muted-foreground italic border-l-2 border-border/50 pl-2 py-1">"{candidate.recoveryReason}"</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase">Recovered At</div>
                    <div className="text-xs font-mono">{candidate.recoveredAt ? new Date(candidate.recoveredAt).toLocaleString() : '-'}</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded border ${daysLeft < 7 ? 'bg-destructive/5 border-destructive/30 text-destructive' : 'bg-muted/30 border-border/50 text-foreground'}`}>
                    <div className="text-3xl font-mono font-bold">{daysLeft}</div>
                    <div className="text-xs font-mono uppercase mt-1 opacity-80">Days remaining in pool</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase">Initial Rejection</div>
                    <div className="text-xs font-mono">{new Date(candidate.rejectedAt).toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase">Purge Date</div>
                    <div className="text-xs font-mono">{new Date(candidate.retentionExpiresAt).toLocaleDateString()}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

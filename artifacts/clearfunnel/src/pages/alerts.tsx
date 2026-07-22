import { useListAlerts, useUpdateAlert, getListAlertsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Clock, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Alerts() {
  const queryClient = useQueryClient();
  const { data: alerts, isLoading } = useListAlerts();
  const updateAlert = useUpdateAlert();

  const handleResolve = (id: number) => {
    updateAlert.mutate({ id, data: { status: 'resolved', resolvedBy: 'Current User' } }, {
      onSuccess: () => {
        toast.success("Alert resolved");
        queryClient.invalidateQueries({ queryKey: getListAlertsQueryKey() });
      },
      onError: () => toast.error("Failed to resolve alert")
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive border-destructive/50 bg-destructive/10';
      case 'high': return 'text-orange-500 border-orange-500/50 bg-orange-500/10';
      case 'medium': return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10';
      default: return 'text-muted-foreground border-border/50 bg-muted/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rejection_spike': return <TrendingUp className="size-4" />;
      case 'rejection_drop': return <TrendingDown className="size-4" />;
      case 'validation_failure': return <ShieldAlert className="size-4" />;
      default: return <AlertTriangle className="size-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  const openAlerts = alerts?.filter(a => a.status === 'open') || [];
  const resolvedAlerts = alerts?.filter(a => a.status === 'resolved') || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold uppercase tracking-wide">Anomaly Alerts</h1>
          <p className="text-muted-foreground text-sm font-mono mt-1">System-detected deviations in funnel behavior</p>
        </div>
        <Badge variant="outline" className="font-mono rounded-sm border-destructive/30 bg-destructive/5 text-destructive px-3 py-1">
          {openAlerts.length} OPEN ALERTS
        </Badge>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-sm font-mono font-bold text-muted-foreground mb-4 uppercase tracking-wider">Active Anomalies</h2>
          <div className="space-y-4">
            {openAlerts.map(alert => (
              <Card key={alert.id} className="border-destructive/20 bg-destructive/5 backdrop-blur overflow-hidden relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-destructive/50" />
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded mt-0.5 ${getSeverityColor(alert.severity)}`}>
                      {getTypeIcon(alert.alertType)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold uppercase text-sm text-foreground">{alert.alertType.replace('_', ' ')}</span>
                        <Badge variant="outline" className={`font-mono text-[10px] rounded-sm py-0 ${getSeverityColor(alert.severity)} uppercase`}>
                          {alert.severity}
                        </Badge>
                        <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                          <Clock className="size-3" /> {new Date(alert.detectedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80">{alert.message}</p>
                      {alert.correlatedRuleId && (
                        <div className="text-xs font-mono text-muted-foreground mt-2">
                          Correlated with rule: <Link href={`/app/rules/${alert.correlatedRuleId}`} className="text-primary hover:underline">{alert.correlatedRuleName}</Link>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="font-mono text-xs border-destructive/30 hover:bg-destructive/10 text-destructive shrink-0"
                    onClick={() => handleResolve(alert.id)}
                    disabled={updateAlert.isPending}
                  >
                    <CheckCircle2 className="size-4 mr-2" /> ACKNOWLEDGE
                  </Button>
                </CardContent>
              </Card>
            ))}
            {openAlerts.length === 0 && (
              <div className="p-8 border border-dashed border-primary/30 rounded bg-primary/5 text-center flex flex-col items-center">
                <CheckCircle2 className="size-8 text-primary/50 mb-2" />
                <p className="font-mono text-sm text-primary">System is nominal. No active anomalies detected.</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-mono font-bold text-muted-foreground mb-4 uppercase tracking-wider">Recent History</h2>
          <div className="space-y-3 opacity-70">
            {resolvedAlerts.slice(0, 5).map(alert => (
              <Card key={alert.id} className="border-border/50 bg-card/30 backdrop-blur">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-1.5 rounded bg-muted/50 text-muted-foreground">
                      {getTypeIcon(alert.alertType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold uppercase text-xs text-muted-foreground">{alert.alertType.replace('_', ' ')}</span>
                        <span className="text-[10px] font-mono text-muted-foreground/60">{new Date(alert.detectedAt).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="font-mono text-[10px] rounded-sm py-0 border-border/50 text-muted-foreground">
                      RESOLVED
                    </Badge>
                    <div className="text-[10px] font-mono text-muted-foreground mt-1">by {alert.resolvedBy}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {resolvedAlerts.length === 0 && (
              <div className="text-center py-4 text-xs font-mono text-muted-foreground">No historical alerts</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

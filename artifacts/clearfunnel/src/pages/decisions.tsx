import { useState } from "react";
import { Link } from "wouter";
import { useListDecisions } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, History, ShieldAlert } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Decisions() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useListDecisions();

  const filteredDecisions = data?.items.filter(d => 
    d.candidateName.toLowerCase().includes(search.toLowerCase()) || 
    d.roleName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-mono font-bold uppercase tracking-wide">Decision Log</h1>
        <p className="text-muted-foreground text-sm font-mono mt-1">Immutable audit trail of all automated rejections</p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="py-4 border-b border-border/50">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates or roles..."
                className="pl-9 font-mono text-sm bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <Badge variant="outline" className="rounded-sm border-border/50">{data?.total || 0} TOTAL</Badge>
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
                  <TableHead className="font-mono text-xs h-10">CANDIDATE</TableHead>
                  <TableHead className="font-mono text-xs h-10">ROLE</TableHead>
                  <TableHead className="font-mono text-xs h-10">TRIGGERED RULES</TableHead>
                  <TableHead className="font-mono text-xs h-10">TIMESTAMP</TableHead>
                  <TableHead className="font-mono text-xs h-10 text-right">STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDecisions?.map((decision) => (
                  <TableRow key={decision.id} className="border-border/50 hover:bg-muted/20">
                    <TableCell>
                      <Link href={`/app/candidates/${decision.candidateId}`} className="font-medium text-sm hover:text-primary transition-colors block">
                        {decision.candidateName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-mono text-muted-foreground">{decision.roleName}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {decision.triggeredRules.map(rule => (
                          <Badge key={rule.ruleId} variant="secondary" className="font-mono text-[10px] rounded-sm py-0">
                            {rule.ruleName}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {new Date(decision.rejectedAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {decision.recovered ? (
                        <Badge variant="outline" className="font-mono text-[10px] rounded-sm py-0 border-primary/50 text-primary bg-primary/5">
                          RECOVERED
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="font-mono text-[10px] rounded-sm py-0 border-destructive/50 text-destructive bg-destructive/5">
                          REJECTED
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDecisions?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground font-mono text-sm">
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

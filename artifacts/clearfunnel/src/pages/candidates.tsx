import { useState } from "react";
import { Link } from "wouter";
import { useListCandidates } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Clock, ShieldCheck, Timer } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Candidates() {
  const [search, setSearch] = useState("");
  const { data: candidates, isLoading } = useListCandidates({ search: search || undefined });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-mono font-bold uppercase tracking-wide">Recovery Pool</h1>
        <p className="text-muted-foreground text-sm font-mono mt-1">Candidates within the 90-day retention window eligible for recovery</p>
      </div>

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
                  <TableHead className="font-mono text-xs h-10">REJECTION SUMMARY</TableHead>
                  <TableHead className="font-mono text-xs h-10">STATUS</TableHead>
                  <TableHead className="font-mono text-xs h-10 text-right">EXPIRES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates?.map((candidate) => {
                  const daysLeft = Math.ceil((new Date(candidate.retentionExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  return (
                    <TableRow key={candidate.id} className="border-border/50 hover:bg-muted/20">
                      <TableCell>
                        <div className="space-y-1">
                          <Link href={`/app/candidates/${candidate.id}`} className="font-medium text-sm hover:text-primary transition-colors">
                            {candidate.name}
                          </Link>
                          <div className="text-[10px] font-mono text-muted-foreground">{candidate.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-mono text-muted-foreground">{candidate.roleName}</span>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs text-muted-foreground max-w-xs truncate">
                          {candidate.rejectionSummary || "No summary provided"}
                        </p>
                      </TableCell>
                      <TableCell>
                        {candidate.recovered ? (
                          <Badge variant="outline" className="font-mono text-[10px] rounded-sm py-0 border-primary/50 text-primary bg-primary/5 flex w-fit items-center gap-1">
                            <ShieldCheck className="size-3" /> RECOVERED
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="font-mono text-[10px] rounded-sm py-0 border-border/50 flex w-fit items-center gap-1 text-muted-foreground">
                            <Clock className="size-3" /> PENDING
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={`font-mono text-xs flex items-center justify-end gap-1 ${daysLeft < 7 && !candidate.recovered ? 'text-destructive' : 'text-muted-foreground'}`}>
                          <Timer className="size-3" />
                          {candidate.recovered ? '-' : `${daysLeft}d`}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {candidates?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground font-mono text-sm">
                      No candidates found.
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

import { useState } from "react";
import { useListValidationRuns, useListBenchmarkResumes, getListBenchmarkResumesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

export default function Validation() {
  const { data: runs, isLoading: isRunsLoading } = useListValidationRuns();
  const { data: resumes, isLoading: isResumesLoading } = useListBenchmarkResumes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-mono font-bold uppercase tracking-wide">Validation Harness</h1>
        <p className="text-muted-foreground text-sm font-mono mt-1">Test ATS rules against standardized benchmark resumes</p>
      </div>

      <Tabs defaultValue="runs" className="w-full">
        <TabsList className="bg-muted/20 border border-border/50 w-full justify-start rounded-none h-10 p-0 mb-6">
          <TabsTrigger value="runs" className="font-mono text-xs rounded-none h-10 data-[state=active]:bg-card data-[state=active]:border-b-2 data-[state=active]:border-primary">
            RECENT RUNS
          </TabsTrigger>
          <TabsTrigger value="benchmarks" className="font-mono text-xs rounded-none h-10 data-[state=active]:bg-card data-[state=active]:border-b-2 data-[state=active]:border-primary">
            BENCHMARK SET
          </TabsTrigger>
        </TabsList>

        <TabsContent value="runs" className="space-y-4">
          {isRunsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <div className="grid gap-4">
              {runs?.map(run => (
                <Card key={run.id} className="border-border/50 bg-card/30 backdrop-blur">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={`font-mono text-[10px] rounded-sm py-0 ${
                          run.status === 'passed' ? 'text-primary border-primary/50 bg-primary/5' : 
                          run.status === 'failed' ? 'text-destructive border-destructive/50 bg-destructive/5' : 'text-muted-foreground'
                        }`}>
                          {run.status.toUpperCase()}
                        </Badge>
                        <span className="font-mono font-bold text-sm">Run #{run.id}</span>
                        <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                          <Clock className="size-3" /> {new Date(run.startedAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm">
                        Rule: <Link href={`/app/rules/${run.ruleId}`} className="font-mono text-primary hover:underline">{run.ruleName}</Link>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-border/30 pt-4 sm:pt-0 sm:pl-6">
                      <div className="text-center">
                        <div className="text-xl font-mono font-bold">{run.benchmarkCount}</div>
                        <div className="text-[10px] font-mono text-muted-foreground uppercase">Resumes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-mono font-bold text-primary">{run.passCount}</div>
                        <div className="text-[10px] font-mono text-primary/70 uppercase">Passed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-mono font-bold text-destructive">{run.failCount}</div>
                        <div className="text-[10px] font-mono text-destructive/70 uppercase">Failed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {runs?.length === 0 && (
                <div className="text-center py-12 text-sm text-muted-foreground font-mono border border-dashed border-border/50 rounded">
                  No validation runs recorded.
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="benchmarks">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="py-4 border-b border-border/50 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-mono text-muted-foreground">Test Corpus</CardTitle>
              <Button variant="outline" size="sm" className="font-mono text-[10px] h-8 border-border/50">
                <FileText className="size-3 mr-1" /> ADD BENCHMARK
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {isResumesLoading ? (
                <div className="p-4 space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="font-mono text-xs h-10">CANDIDATE PROFILE</TableHead>
                      <TableHead className="font-mono text-xs h-10">SCENARIO</TableHead>
                      <TableHead className="font-mono text-xs h-10">EXPECTED OUTCOME</TableHead>
                      <TableHead className="font-mono text-xs h-10">TAGS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resumes?.map((resume) => (
                      <TableRow key={resume.id} className="border-border/50 hover:bg-muted/20">
                        <TableCell>
                          <div className="font-medium text-sm">{resume.candidateName}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{resume.background}</div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-mono text-muted-foreground">{resume.scenario}</span>
                        </TableCell>
                        <TableCell>
                          {resume.expectedOutcome === 'pass' ? (
                            <Badge variant="outline" className="font-mono text-[10px] rounded-sm py-0 border-primary/50 text-primary bg-primary/5">
                              SHOULD PASS
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="font-mono text-[10px] rounded-sm py-0 border-destructive/50 text-destructive bg-destructive/5">
                              SHOULD FAIL
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {resume.tags?.map(tag => (
                              <Badge key={tag} variant="secondary" className="font-mono text-[10px] rounded-sm py-0 bg-muted/50">
                                {tag}
                              </Badge>
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

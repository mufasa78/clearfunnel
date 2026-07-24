/**
 * ClearFunnel Demo Seed Script
 *
 * Generates rich, realistic data demonstrating every intelligence algorithm.
 * Run: pnpm --filter @workspace/scripts run seed
 */
import { db } from "@workspace/db";
import {
  rolesTable, filterRulesTable, ruleHistoryTable,
  candidatesTable, decisionsTable, decisionRulesTable,
  alertsTable, validationRunsTable, validationResultsTable,
  benchmarkResumesTable, governanceSnapshotsTable, recruiterStatsTable,
} from "@workspace/db";
import { sql } from "drizzle-orm";
import {
  computeRecoveryScore, recoveryRecommendation,
  computeDecisionConfidence, evidenceStrength,
  computeGovernanceScore, computeATSHealthScore,
  computeFinancialImpact,
} from "../../artifacts/api-server/src/lib/algorithms.js";

const log = (msg: string) => process.stdout.write(`[seed] ${msg}\n`);

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function daysAgo(n: number) {
  return new Date(Date.now() - n * 86_400_000);
}

async function clearAll() {
  log("Clearing existing data...");
  await db.execute(sql`TRUNCATE TABLE governance_snapshots, recruiter_stats, validation_results, validation_runs, benchmark_resumes, decision_rules, decisions, alerts, candidates, rule_history, filter_rules, roles RESTART IDENTITY CASCADE`);
}

async function main() {
  await clearAll();

  // ─── Roles ─────────────────────────────────────────────────────────────
  log("Seeding roles...");
  const roleData = [
    { name: "Senior Software Engineer", department: "Engineering" },
    { name: "Product Manager", department: "Product" },
    { name: "Sales Account Executive", department: "Sales" },
    { name: "UX Designer", department: "Design" },
    { name: "Data Scientist", department: "Data" },
    { name: "Marketing Manager", department: "Marketing" },
    { name: "DevOps Engineer", department: "Engineering" },
    { name: "Financial Analyst", department: "Finance" },
  ];
  const roles = await db.insert(rolesTable).values(roleData).returning();
  log(`  → ${roles.length} roles`);

  // ─── Filter Rules ──────────────────────────────────────────────────────
  log("Seeding filter rules...");
  const rulesData = [
    {
      name: "Minimum 5 Years Experience",
      description: "Candidates must have at least 5 years of relevant work experience",
      ruleType: "experience_years", criteria: "years_experience >= 5",
      status: "active", version: 3, createdBy: "sarah.chen@corp.com",
      triggeredCount: 2340, correctCount: 1930, falsePositiveCount: 410, falseNegativeCount: 62,
      weightPercent: 40,
      optimizerRecommendation: "Consider reducing to 4 years — 410 qualified candidates rejected over 6 months.",
      lastValidatedAt: daysAgo(14), validationStatus: "passed",
    },
    {
      name: "Bachelor's Degree Required",
      description: "Minimum bachelor's degree in a relevant field",
      ruleType: "degree_requirement", criteria: "education_level IN (bachelors, masters, phd)",
      status: "active", version: 2, createdBy: "sarah.chen@corp.com",
      triggeredCount: 980, correctCount: 820, falsePositiveCount: 160, falseNegativeCount: 28,
      weightPercent: 35,
      optimizerRecommendation: null,
      lastValidatedAt: daysAgo(7), validationStatus: "passed",
    },
    {
      name: "Missing Required Skills (Java)",
      description: "Java must appear in skills for backend engineering roles",
      ruleType: "keyword_match", criteria: "skills CONTAINS java",
      status: "active", version: 1, createdBy: "tom.harris@corp.com",
      triggeredCount: 432, correctCount: 410, falsePositiveCount: 22, falseNegativeCount: 8,
      weightPercent: 60,
      optimizerRecommendation: null,
      lastValidatedAt: daysAgo(3), validationStatus: "passed",
    },
    {
      name: "Employment Gap > 12 Months",
      description: "Flag candidates with unexplained gaps longer than 12 months",
      ruleType: "employment_gap", criteria: "max_gap_months > 12",
      status: "active", version: 4, createdBy: "sarah.chen@corp.com",
      triggeredCount: 267, correctCount: 89, falsePositiveCount: 178, falseNegativeCount: 5,
      weightPercent: 20,
      optimizerRecommendation: "HIGH RISK: 66.7% false positive rate. Consider requiring manual review instead of auto-reject. Caregivers, illness, and education are common legitimate gaps.",
      lastValidatedAt: daysAgo(30), validationStatus: "failed",
    },
    {
      name: "Location Not in Target Market",
      description: "Candidates must be located in approved metro areas for on-site roles",
      ruleType: "location", criteria: "location IN (New York, San Francisco, London, Austin)",
      status: "active", version: 2, createdBy: "priya.patel@corp.com",
      triggeredCount: 567, correctCount: 412, falsePositiveCount: 155, falseNegativeCount: 20,
      weightPercent: 30,
      optimizerRecommendation: null,
      lastValidatedAt: daysAgo(21), validationStatus: "passed",
    },
    {
      name: "GPA Below 3.0",
      description: "Minimum GPA threshold for recent graduates (within 3 years of graduation)",
      ruleType: "custom", criteria: "gpa >= 3.0 OR years_since_graduation > 3",
      status: "active", version: 1, createdBy: "tom.harris@corp.com",
      triggeredCount: 234, correctCount: 156, falsePositiveCount: 78, falseNegativeCount: 12,
      weightPercent: 15,
      optimizerRecommendation: "33.3% false positive rate. GPA correlates poorly with job performance after 5+ years of experience.",
      lastValidatedAt: daysAgo(45), validationStatus: "passed",
    },
    {
      name: "Cover Letter Missing",
      description: "Cover letter is required for all management and senior roles",
      ruleType: "keyword_match", criteria: "has_cover_letter == true",
      status: "active", version: 1, createdBy: "priya.patel@corp.com",
      triggeredCount: 891, correctCount: 845, falsePositiveCount: 46, falseNegativeCount: 3,
      weightPercent: 25,
      optimizerRecommendation: null,
      lastValidatedAt: daysAgo(5), validationStatus: "passed",
    },
    {
      name: "No Python Experience",
      description: "Python required for data science and analytics roles",
      ruleType: "keyword_match", criteria: "skills CONTAINS python",
      status: "active", version: 2, createdBy: "sarah.chen@corp.com",
      triggeredCount: 345, correctCount: 312, falsePositiveCount: 33, falseNegativeCount: 10,
      weightPercent: 55,
      optimizerRecommendation: null,
      lastValidatedAt: daysAgo(10), validationStatus: "passed",
    },
    {
      name: "Less than 3 Years in Current Role",
      description: "Senior roles require candidates to have 3+ years in their most recent position",
      ruleType: "experience_years", criteria: "current_role_years >= 3",
      status: "active", version: 3, createdBy: "tom.harris@corp.com",
      triggeredCount: 678, correctCount: 289, falsePositiveCount: 389, falseNegativeCount: 18,
      weightPercent: 20,
      optimizerRecommendation: "CRITICAL: 57.4% false positive rate. High performers often move quickly. Consider removing or replacing with interview assessment.",
      lastValidatedAt: daysAgo(60), validationStatus: "failed",
    },
    {
      name: "Missing Portfolio Link",
      description: "Portfolio required for design and creative roles",
      ruleType: "keyword_match", criteria: "has_portfolio == true",
      status: "active", version: 1, createdBy: "priya.patel@corp.com",
      triggeredCount: 234, correctCount: 198, falsePositiveCount: 36, falseNegativeCount: 7,
      weightPercent: 45,
      optimizerRecommendation: null,
      lastValidatedAt: daysAgo(18), validationStatus: "passed",
    },
    {
      name: "Notice Period > 60 Days",
      description: "Roles with immediate start require notice period under 60 days",
      ruleType: "custom", criteria: "notice_days <= 60",
      status: "pending_validation", version: 1, createdBy: "sarah.chen@corp.com",
      triggeredCount: 156, correctCount: 134, falsePositiveCount: 22, falseNegativeCount: 4,
      weightPercent: 15,
      optimizerRecommendation: null,
      lastValidatedAt: null, validationStatus: "not_run",
    },
    {
      name: "Salary Expectation > Budget",
      description: "Candidate's stated salary expectation exceeds the approved band by more than 20%",
      ruleType: "custom", criteria: "salary_expectation <= budget * 1.2",
      status: "active", version: 2, createdBy: "tom.harris@corp.com",
      triggeredCount: 123, correctCount: 98, falsePositiveCount: 25, falseNegativeCount: 6,
      weightPercent: 20,
      optimizerRecommendation: null,
      lastValidatedAt: daysAgo(28), validationStatus: "passed",
    },
  ];

  const rules = await db.insert(filterRulesTable).values(rulesData.map((r) => ({
    ...r,
    roleId: null,
  }))).returning();

  // Rule history
  for (const rule of rules) {
    const versions = Array.from({ length: rule.version }, (_, i) => ({
      ruleId: rule.id, version: i + 1,
      changedBy: rule.createdBy,
      changes: i === 0 ? "Rule created" : `Threshold adjusted based on Q${i + 1} review`,
      changedAt: daysAgo(90 - i * 20),
    }));
    await db.insert(ruleHistoryTable).values(versions);
  }
  log(`  → ${rules.length} rules`);

  // ─── Benchmark Resumes ─────────────────────────────────────────────────
  log("Seeding benchmark resumes...");
  const benchmarkData = [
    { candidateName: "Alex Kim", scenario: "Strong pass — 8 years SWE, CS degree, Java+Python", expectedOutcome: "pass", background: "8 years experience, BS Computer Science, Java, Python, React", tags: ["engineering", "senior"] },
    { candidateName: "Morgan Lee", scenario: "Edge case — 4.5 years, borderline experience", expectedOutcome: "pass", background: "4.5 years SWE, self-taught, strong portfolio, contributed to open source", tags: ["engineering", "borderline"] },
    { candidateName: "Casey Rivera", scenario: "Clear fail — 1 year experience, no degree", expectedOutcome: "fail", background: "1 year bootcamp graduate, no degree, limited production experience", tags: ["junior", "clear-fail"] },
    { candidateName: "Jordan Walsh", scenario: "Career changer — MBA + 3 years analyst, no CS degree", expectedOutcome: "pass", background: "MBA, 3 years business analyst, teaching himself Python, strong problem-solving", tags: ["career-change", "non-traditional"] },
    { candidateName: "Sam Patel", scenario: "Caregiver gap — 18 months gap, excellent track record", expectedOutcome: "pass", background: "7 years SWE, caregiver gap 2022-2023, previously led team of 6", tags: ["employment-gap", "false-positive-risk"] },
    { candidateName: "Taylor Brooks", scenario: "Recent grad — Stanford CS, GPA 3.8", expectedOutcome: "pass", background: "Stanford BS CS, GPA 3.8, two internships at FAANG companies", tags: ["new-grad", "top-school"] },
    { candidateName: "Robin Chen", scenario: "Missing cover letter — senior PM, 10 years", expectedOutcome: "fail", background: "10 years PM experience, no cover letter submitted, excellent portfolio", tags: ["missing-document", "senior"] },
    { candidateName: "Drew Martinez", scenario: "Wrong location — remote-eligible role, candidate in Chicago", expectedOutcome: "pass", background: "6 years SWE, excellent references, role was marked remote-ok but rule not updated", tags: ["location", "rule-mismatch"] },
  ];
  const benchmarks = await db.insert(benchmarkResumesTable).values(benchmarkData).returning();
  log(`  → ${benchmarks.length} benchmark resumes`);

  // ─── Candidates + Decisions ────────────────────────────────────────────
  log("Seeding candidates and decisions...");

  const firstNames = ["Alex", "Jordan", "Morgan", "Casey", "Taylor", "Riley", "Quinn", "Avery",
    "Blake", "Cameron", "Dana", "Ellis", "Finley", "Gray", "Harper", "Indira",
    "Jamie", "Kennedy", "Leslie", "Madison", "Noel", "Oakley", "Parker", "Quinn",
    "Reese", "Skylar", "Terri", "Uma", "Val", "Whitney", "Xander", "Yael", "Zara",
    "Priya", "Rahul", "Chen", "Aiko", "Fatima", "Carlos", "Olga", "Dmitri"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
    "Davis", "Wilson", "Anderson", "Taylor", "Thomas", "Jackson", "White", "Harris",
    "Martin", "Thompson", "Young", "Allen", "King", "Scott", "Green", "Baker",
    "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Patel", "Kim",
    "Wang", "Chen", "Singh", "Nakamura", "Ali", "Hassan", "Lopez", "Martinez"];

  const recruiterIds = ["sarah.chen", "tom.harris", "priya.patel", "james.o", "nina.r"];
  const educationLevels = ["high_school", "bachelors", "masters", "phd"] as const;
  const skillPools = [
    ["Java", "Spring", "SQL", "Docker"],
    ["Python", "TensorFlow", "SQL", "R"],
    ["React", "TypeScript", "CSS", "Figma"],
    ["Go", "Kubernetes", "AWS", "Terraform"],
    ["Python", "Pandas", "Spark", "Tableau"],
    ["Salesforce", "SQL", "Excel", "Hubspot"],
    ["JavaScript", "Node.js", "PostgreSQL", "Redis"],
    ["Excel", "SQL", "Bloomberg", "PowerBI"],
  ];

  const allCandidates: typeof candidatesTable.$inferSelect[] = [];
  const allDecisions: typeof decisionsTable.$inferSelect[] = [];

  const candidateBatch = 120;
  for (let i = 0; i < candidateBatch; i++) {
    const role = pick(roles);
    const name = `${pick(firstNames)} ${pick(lastNames)}`;
    const email = `${name.toLowerCase().replace(" ", ".")}${i}@gmail.com`;
    const yearsExp = rand(1, 15);
    const educLevel = pick(educationLevels);
    const skills = pick(skillPools);
    const rejectedDaysAgo = rand(1, 85);
    const retentionDays = 90;

    // Compute match scores based on realistic logic
    const skillMatch = rand(45, 99);
    const experienceMatch = yearsExp >= 5 ? rand(70, 99) : rand(20, 65);
    const educMatch = ["masters", "phd"].includes(educLevel) ? rand(80, 99) : rand(50, 85);
    const rejectionConf = rand(35, 95);

    const recovScore = computeRecoveryScore(skillMatch, experienceMatch, educMatch, rejectionConf);
    const recommendation = recoveryRecommendation(recovScore);

    // Candidate record
    const [c] = await db.insert(candidatesTable).values({
      name, email,
      roleId: role.id,
      rejectedAt: daysAgo(rejectedDaysAgo),
      recovered: recommendation === "recover" && Math.random() > 0.6,
      retentionExpiresAt: new Date(Date.now() + (retentionDays - rejectedDaysAgo) * 86_400_000),
      recoveryScore: recovScore,
      skillMatch, experienceMatch, educationMatch: educMatch, rejectionConfidence: rejectionConf,
      yearsExperience: yearsExp,
      educationLevel: educLevel,
      skills,
      department: role.department,
      recruiterRecommendation: recommendation,
      similarityWarning: recovScore >= 85 ? `${rand(80, 95)}% similar to ${rand(2, 5)} top performers` : null,
    }).returning();

    // Pick triggered rules (1–3)
    const numRules = rand(1, 3);
    const shuffled = [...rules].sort(() => Math.random() - 0.5).slice(0, numRules);

    const confidenceScore = computeDecisionConfidence(
      shuffled.map((r) => r.weightPercent),
      shuffled.map((r) => {
        const { accuracy } = { accuracy: r.triggeredCount > 0 ? Math.round((r.correctCount / r.triggeredCount) * 100) : 100 };
        return accuracy;
      }),
    );

    const summary = shuffled.map((r) => r.name).join("; ");
    const [d] = await db.insert(decisionsTable).values({
      candidateId: c.id,
      roleId: role.id,
      rejectionSummary: summary,
      recoverable: recommendation !== "reject",
      recovered: c.recovered,
      rejectedAt: daysAgo(rejectedDaysAgo),
      confidenceScore,
      evidenceCount: numRules,
      recruiterId: pick(recruiterIds),
      evidenceStrength: evidenceStrength(confidenceScore),
    }).returning();

    // Decision rules junction
    for (const rule of shuffled) {
      await db.insert(decisionRulesTable).values({
        decisionId: d.id,
        ruleId: rule.id,
        ruleName: rule.name,
        ruleDescription: rule.description,
      });
    }

    allCandidates.push(c);
    allDecisions.push(d);
  }
  log(`  → ${allCandidates.length} candidates, ${allDecisions.length} decisions`);

  // ─── Alerts (Anomaly Detection) ────────────────────────────────────────
  log("Seeding anomaly alerts...");
  const alertData = [
    {
      roleId: roles[0].id,
      alertType: "rejection_spike",
      severity: "critical",
      message: "Rejection rate for Senior Software Engineer jumped from 24% to 87% today — 3.4σ above 30-day baseline",
      status: "open",
      zScore: 3.4, baselineRate: 24.2, currentRate: 87.1,
      recruiterId: "tom.harris",
      affectedCandidates: 34,
      detectedAt: daysAgo(1),
    },
    {
      roleId: roles[2].id,
      alertType: "recruiter_anomaly",
      severity: "high",
      message: "Tom Harris rejection rate (91%) is 2.8σ above team average (43%). Possible inconsistent rule application.",
      status: "open",
      zScore: 2.8, baselineRate: 43.0, currentRate: 91.0,
      recruiterId: "tom.harris",
      affectedCandidates: 18,
      detectedAt: daysAgo(2),
    },
    {
      roleId: roles[4].id,
      alertType: "bias_detected",
      severity: "high",
      message: "Rejection rate for candidates without a degree (78%) vs. degree-holders (31%) — 47pp disparity flagged",
      status: "open",
      zScore: 2.1, baselineRate: 31.0, currentRate: 78.0,
      recruiterId: null,
      affectedCandidates: 42,
      detectedAt: daysAgo(3),
    },
    {
      roleId: roles[1].id,
      alertType: "validation_failure",
      severity: "high",
      message: "Rule 'Employment Gap > 12 Months' failed benchmark validation — 66% false positive rate detected",
      status: "open",
      correlatedRuleId: rules[3].id,
      correlatedRuleName: rules[3].name,
      zScore: null, baselineRate: null, currentRate: null,
      affectedCandidates: 178,
      detectedAt: daysAgo(4),
    },
    {
      roleId: roles[3].id,
      alertType: "rejection_spike",
      severity: "medium",
      message: "UX Designer applications rejected at 72% — 2.2σ above 30-day average of 38%",
      status: "open",
      zScore: 2.2, baselineRate: 38.0, currentRate: 72.0,
      recruiterId: "priya.patel",
      affectedCandidates: 11,
      detectedAt: daysAgo(5),
    },
    {
      roleId: roles[6].id,
      alertType: "rejection_spike",
      severity: "medium",
      message: "DevOps Engineer pipeline: 'Less than 3 Years in Current Role' rule triggered on 89% of applicants this week",
      status: "open",
      correlatedRuleId: rules[8].id,
      correlatedRuleName: rules[8].name,
      zScore: 2.0, baselineRate: 45.0, currentRate: 89.0,
      affectedCandidates: 23,
      detectedAt: daysAgo(6),
    },
    {
      roleId: roles[0].id,
      alertType: "rejection_spike",
      severity: "critical",
      message: "Rejection surge detected — 118 rejections today vs. predicted 43 (175% above forecast)",
      status: "resolved",
      zScore: 3.1, baselineRate: 43.0, currentRate: 118.0,
      affectedCandidates: 75,
      detectedAt: daysAgo(15),
      resolvedAt: daysAgo(14),
      resolvedBy: "sarah.chen",
    },
    {
      roleId: roles[5].id,
      alertType: "rule_change",
      severity: "low",
      message: "Marketing Manager pipeline: new 'Cover Letter Missing' rule caused 34% jump in rejections",
      status: "resolved",
      correlatedRuleId: rules[6].id,
      correlatedRuleName: rules[6].name,
      zScore: 1.8, baselineRate: 22.0, currentRate: 56.0,
      affectedCandidates: 14,
      detectedAt: daysAgo(22),
      resolvedAt: daysAgo(20),
      resolvedBy: "priya.patel",
    },
    {
      roleId: roles[7].id,
      alertType: "recruiter_anomaly",
      severity: "medium",
      message: "Nina R rejection rate (12%) is 2.3σ below team average — possible under-application of rules",
      status: "resolved",
      zScore: -2.3, baselineRate: 43.0, currentRate: 12.0,
      recruiterId: "nina.r",
      affectedCandidates: 8,
      detectedAt: daysAgo(28),
      resolvedAt: daysAgo(25),
      resolvedBy: "sarah.chen",
    },
  ];

  await db.insert(alertsTable).values(alertData.map((a) => ({
    roleId: a.roleId,
    alertType: a.alertType,
    severity: a.severity,
    message: a.message,
    status: a.status ?? "open",
    correlatedRuleId: (a as any).correlatedRuleId ?? null,
    correlatedRuleName: (a as any).correlatedRuleName ?? null,
    detectedAt: (a as any).detectedAt ?? new Date(),
    resolvedAt: (a as any).resolvedAt ?? null,
    resolvedBy: (a as any).resolvedBy ?? null,
    zScore: (a as any).zScore ?? null,
    baselineRate: (a as any).baselineRate ?? null,
    currentRate: (a as any).currentRate ?? null,
    recruiterId: (a as any).recruiterId ?? null,
    affectedCandidates: (a as any).affectedCandidates ?? null,
  })));
  log(`  → ${alertData.length} alerts`);

  // ─── Validation Runs ───────────────────────────────────────────────────
  log("Seeding validation runs...");
  for (const rule of rules.slice(0, 8)) {
    for (let run = 0; run < rand(2, 5); run++) {
      const isHighAccuracy = rule.falsePositiveCount / Math.max(rule.triggeredCount, 1) < 0.30;
      const passCount = isHighAccuracy ? rand(6, 8) : rand(2, 5);
      const failCount = benchmarks.length - passCount;
      const [vRun] = await db.insert(validationRunsTable).values({
        ruleId: rule.id,
        status: failCount > 2 ? "failed" : "passed",
        benchmarkCount: benchmarks.length,
        passCount, failCount,
        startedAt: daysAgo(rand(7, 90)),
        completedAt: daysAgo(rand(1, 6)),
      }).returning();

      const results = benchmarks.map((b, idx) => {
        const passed = idx < passCount;
        return {
          validationRunId: vRun.id,
          benchmarkResumeId: b.id,
          candidateName: b.candidateName,
          expectedOutcome: b.expectedOutcome,
          actualOutcome: passed ? b.expectedOutcome : (b.expectedOutcome === "pass" ? "fail" : "pass"),
          passed,
          failReason: !passed ? `Rule over-triggered: candidate qualifies but ${rule.name} flagged as reject` : null,
        };
      });
      await db.insert(validationResultsTable).values(results);
    }
  }
  log("  → validation runs complete");

  // ─── Recruiter Stats ───────────────────────────────────────────────────
  log("Seeding recruiter stats...");
  const recruiterData = [
    { recruiterId: "sarah.chen", recruiterName: "Sarah Chen", department: "Engineering", totalDecisions: 312, rejectionRate: 38.5, recoveryRate: 22.1, consistencyScore: 94, zScore: 0.3, flagged: null },
    { recruiterId: "tom.harris", recruiterName: "Tom Harris", department: "Engineering", totalDecisions: 287, rejectionRate: 91.0, recoveryRate: 4.2, consistencyScore: 28, zScore: 2.8, flagged: "inconsistent" },
    { recruiterId: "priya.patel", recruiterName: "Priya Patel", department: "Product", totalDecisions: 198, rejectionRate: 41.2, recoveryRate: 19.8, consistencyScore: 89, zScore: 0.6, flagged: null },
    { recruiterId: "james.o", recruiterName: "James O'Brien", department: "Sales", totalDecisions: 156, rejectionRate: 44.9, recoveryRate: 18.5, consistencyScore: 85, zScore: 0.9, flagged: null },
    { recruiterId: "nina.r", recruiterName: "Nina Reyes", department: "Design", totalDecisions: 89, rejectionRate: 12.0, recoveryRate: 8.1, consistencyScore: 52, zScore: -2.3, flagged: "inconsistent" },
  ];
  await db.insert(recruiterStatsTable).values(recruiterData.map((r) => ({
    ...r, snapshotDate: new Date(),
  })));
  log(`  → ${recruiterData.length} recruiter stats`);

  // ─── Governance Snapshots (12 months) ─────────────────────────────────
  log("Seeding governance snapshots...");
  const monthlySnapshots = [];
  for (let m = 11; m >= 0; m--) {
    const d = new Date();
    d.setMonth(d.getMonth() - m);
    d.setDate(1);

    // Scores improve over time (left = older, right = now)
    const progress = (11 - m) / 11; // 0 = 11 months ago, 1 = now
    const ruleAccuracy = Math.round(65 + progress * 17 + rand(-3, 3));
    const falseRejectionRate = Math.round(32 - progress * 12 + rand(-2, 2));
    const recoverySuccessRate = Math.round(48 + progress * 24 + rand(-3, 3));
    const recruiterConsistency = Math.round(58 + progress * 28 + rand(-4, 4));
    const explainabilityCoverage = Math.round(72 + progress * 18 + rand(-2, 2));
    const biasRisk = Math.round(45 - progress * 20 + rand(-3, 3));
    const validationPassRate = Math.round(55 + progress * 32 + rand(-3, 3));

    const governanceScore = computeGovernanceScore({
      ruleAccuracy,
      falseRejectionRate,
      recoverySuccessRate,
      recruiterConsistency,
      explainabilityCoverage,
      biasRisk,
      validationPassRate,
    });

    const ruleHealthScore = Math.round(60 + progress * 25);
    const atsHealthScore = computeATSHealthScore({
      ruleHealthScore,
      anomalyHealth: Math.round(70 + progress * 20 + rand(-3, 3)),
      validationCoverage: Math.round(60 + progress * 30 + rand(-3, 3)),
      alertResolutionRate: Math.round(55 + progress * 35 + rand(-4, 4)),
    });

    const falseRejectionCount = Math.round(380 - progress * 180 + rand(-15, 15));
    const { totalCost } = computeFinancialImpact(falseRejectionCount);

    monthlySnapshots.push({
      snapshotDate: d,
      governanceScore, atsHealthScore,
      ruleAccuracy, falseRejectionRate, recoverySuccessRate,
      recruiterConsistency, explainabilityCoverage, biasRisk, validationPassRate,
      estimatedRevenueLost: totalCost,
      falseRejectionCount,
    });
  }
  await db.insert(governanceSnapshotsTable).values(monthlySnapshots);
  log(`  → ${monthlySnapshots.length} governance snapshots`);

  log("\n✅ Seed complete. ClearFunnel demo data is ready.");
}

main().catch((e) => {
  process.stderr.write(`[seed] ERROR: ${e.message}\n`);
  process.exit(1);
});

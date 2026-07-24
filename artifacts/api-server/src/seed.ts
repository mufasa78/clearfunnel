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
} from "./lib/algorithms.js";

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
    { name: "Senior Backend Engineer", department: "Engineering" },
    { name: "Senior Frontend Engineer", department: "Engineering" },
    { name: "DevOps Engineer", department: "Engineering" },
    { name: "Product Manager", department: "Product" },
    { name: "Sales Account Executive", department: "Sales" },
    { name: "Sales Development Rep", department: "Sales" },
    { name: "UX Designer", department: "Marketing" },
    { name: "UI Designer", department: "Marketing" },
    { name: "Marketing Manager", department: "Marketing" },
    { name: "Data Scientist", department: "Engineering" },
    { name: "Financial Analyst", department: "Finance" },
    { name: "Operations Manager", department: "Operations" },
    { name: "Customer Success Manager", department: "Operations" },
    { name: "HR Business Partner", department: "Operations" },
  ];
  const roles = await db.insert(rolesTable).values(roleData).returning();
  log(`  → ${roles.length} roles`);

  // ─── Filter Rules ──────────────────────────────────────────────────────
  log("Seeding filter rules...");
  const rulesData = [
    {
      name: "Missing Required Skill",
      description: "Candidates must have all required skills for the role",
      ruleType: "keyword_match", criteria: "skills CONTAINS required_skill",
      status: "active", version: 4, createdBy: "sarah.kim@corp.com",
      triggeredCount: 421, correctCount: 395, falsePositiveCount: 17, falseNegativeCount: 9,
      weightPercent: 50,
      optimizerRecommendation: null,
      lastValidatedAt: daysAgo(2), validationStatus: "passed",
    },
    {
      name: "Experience Below Threshold",
      description: "Candidates must meet minimum years of experience requirement",
      ruleType: "experience_years", criteria: "years_experience >= threshold",
      status: "active", version: 3, createdBy: "kevin.otieno@corp.com",
      triggeredCount: 289, correctCount: 237, falsePositiveCount: 52, falseNegativeCount: 12,
      weightPercent: 40,
      optimizerRecommendation: "Consider reducing threshold for senior roles — 52 qualified candidates rejected.",
      lastValidatedAt: daysAgo(3), validationStatus: "needs_review",
    },
    {
      name: "Degree Requirement",
      description: "Minimum bachelor's degree in relevant field required",
      ruleType: "degree_requirement", criteria: "education_level IN (bachelors, masters, phd)",
      status: "active", version: 2, createdBy: "david.chen@corp.com",
      triggeredCount: 183, correctCount: 112, falsePositiveCount: 71, falseNegativeCount: 18,
      weightPercent: 35,
      optimizerRecommendation: "HIGH RISK: 38.8% false positive rate. Many strong candidates without degrees being rejected.",
      lastValidatedAt: daysAgo(0), validationStatus: "high_risk",
    },
    {
      name: "Location Restriction",
      description: "Candidates must be located in approved geographic regions",
      ruleType: "location", criteria: "location IN (approved_regions)",
      status: "active", version: 2, createdBy: "lucy.wanjiru@corp.com",
      triggeredCount: 117, correctCount: 113, falsePositiveCount: 4, falseNegativeCount: 8,
      weightPercent: 30,
      optimizerRecommendation: null,
      lastValidatedAt: daysAgo(1), validationStatus: "passed",
    },
    {
      name: "Employment Gap > 12 Months",
      description: "Flag candidates with unexplained gaps longer than 12 months",
      ruleType: "employment_gap", criteria: "max_gap_months > 12",
      status: "active", version: 4, createdBy: "grace.njeri@corp.com",
      triggeredCount: 267, correctCount: 89, falsePositiveCount: 178, falseNegativeCount: 5,
      weightPercent: 20,
      optimizerRecommendation: "HIGH RISK: 66.7% false positive rate. Consider requiring manual review instead of auto-reject.",
      lastValidatedAt: daysAgo(30), validationStatus: "failed",
    },
    {
      name: "Cover Letter Missing",
      description: "Cover letter is required for all management and senior roles",
      ruleType: "keyword_match", criteria: "has_cover_letter == true",
      status: "active", version: 1, createdBy: "sarah.kim@corp.com",
      triggeredCount: 891, correctCount: 845, falsePositiveCount: 46, falseNegativeCount: 3,
      weightPercent: 25,
      optimizerRecommendation: null,
      lastValidatedAt: daysAgo(5), validationStatus: "passed",
    },
    {
      name: "Missing Portfolio Link",
      description: "Portfolio required for design and creative roles",
      ruleType: "keyword_match", criteria: "has_portfolio == true",
      status: "active", version: 1, createdBy: "lucy.wanjiru@corp.com",
      triggeredCount: 234, correctCount: 198, falsePositiveCount: 36, falseNegativeCount: 7,
      weightPercent: 45,
      optimizerRecommendation: null,
      lastValidatedAt: daysAgo(18), validationStatus: "passed",
    },
    {
      name: "Less than 3 Years in Current Role",
      description: "Senior roles require candidates to have 3+ years in their most recent position",
      ruleType: "experience_years", criteria: "current_role_years >= 3",
      status: "active", version: 3, createdBy: "kevin.otieno@corp.com",
      triggeredCount: 678, correctCount: 289, falsePositiveCount: 389, falseNegativeCount: 18,
      weightPercent: 20,
      optimizerRecommendation: "CRITICAL: 57.4% false positive rate. High performers often move quickly.",
      lastValidatedAt: daysAgo(60), validationStatus: "failed",
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

  const recruiterIds = ["sarah.kim", "kevin.otieno", "david.chen", "lucy.wanjiru", "grace.njeri"];
  const educationLevels = ["high_school", "bachelors", "masters", "phd"];
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

  const candidateBatch = 5000;
  for (let i = 0; i < candidateBatch; i++) {
    const role = pick(roles);
    const name = `${pick(firstNames)} ${pick(lastNames)}`;
    const email = `${name.toLowerCase().replace(" ", ".")}${i}@gmail.com`;
    const yearsExp = rand(1, 15);
    const educLevel: string = pick(educationLevels);
    const skills: string[] = pick(skillPools);
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
    const candidateValues = {
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
    };
    const [c] = await db.insert(candidatesTable).values(candidateValues).returning();

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
      alertType: "recruiter_anomaly",
      severity: "high",
      message: "Recruiter Sarah Kim rejected 84% of applicants today compared to her normal average of 37%.",
      status: "open",
      zScore: 2.8, baselineRate: 37.0, currentRate: 84.0,
      recruiterId: "sarah.kim",
      affectedCandidates: 34,
      detectedAt: daysAgo(1),
    },
    {
      roleId: roles[2].id,
      alertType: "rule_degradation",
      severity: "medium",
      message: "Degree Requirement rule accuracy dropped from 81% to 61%.",
      status: "open",
      correlatedRuleId: rules[2].id,
      correlatedRuleName: rules[2].name,
      zScore: null, baselineRate: null, currentRate: null,
      affectedCandidates: 42,
      detectedAt: daysAgo(2),
    },
    {
      roleId: roles[4].id,
      alertType: "false_rejection_cluster",
      severity: "critical",
      message: "23 candidates rejected this week match current top performers.",
      status: "open",
      zScore: 3.1, baselineRate: 12.0, currentRate: 45.0,
      recruiterId: null,
      affectedCandidates: 23,
      detectedAt: daysAgo(3),
    },
    {
      roleId: roles[1].id,
      alertType: "validation_overdue",
      severity: "low",
      message: "Two ATS rules have not been validated in over 120 days.",
      status: "open",
      zScore: null, baselineRate: null, currentRate: null,
      affectedCandidates: 0,
      detectedAt: daysAgo(4),
    },
    {
      roleId: roles[3].id,
      alertType: "rejection_spike",
      severity: "medium",
      message: "UI Designer applications rejected at 72% — 2.2σ above 30-day average of 38%",
      status: "open",
      zScore: 2.2, baselineRate: 38.0, currentRate: 72.0,
      recruiterId: "lucy.wanjiru",
      affectedCandidates: 11,
      detectedAt: daysAgo(5),
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
    { recruiterId: "sarah.kim", recruiterName: "Sarah Kim", department: "Engineering", totalDecisions: 244, rejectionRate: 38, recoveryRate: 91, consistencyScore: 96, zScore: 0.3, flagged: null },
    { recruiterId: "kevin.otieno", recruiterName: "Kevin Otieno", department: "Engineering", totalDecisions: 217, rejectionRate: 43, recoveryRate: 88, consistencyScore: 93, zScore: 0.6, flagged: null },
    { recruiterId: "david.chen", recruiterName: "David Chen", department: "Engineering", totalDecisions: 198, rejectionRate: 57, recoveryRate: 63, consistencyScore: 71, zScore: 1.8, flagged: "needs_review" },
    { recruiterId: "lucy.wanjiru", recruiterName: "Lucy Wanjiru", department: "Marketing", totalDecisions: 265, rejectionRate: 36, recoveryRate: 95, consistencyScore: 98, zScore: 0.2, flagged: null },
    { recruiterId: "grace.njeri", recruiterName: "Grace Njeri", department: "Sales", totalDecisions: 211, rejectionRate: 41, recoveryRate: 90, consistencyScore: 94, zScore: 0.4, flagged: null },
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

  // ─── Specific Recovery Pool Candidates ───────────────────────────────
  log("Seeding specific recovery pool candidates...");
  const recoveryPoolData = [
    {
      name: "Emily Carter",
      email: "emily.carter@gmail.com",
      roleId: roles[0].id, // Senior Backend Engineer
      rejectedAt: daysAgo(15),
      recovered: true,
      retentionExpiresAt: daysAgo(75),
      recoveryScore: 96,
      skillMatch: 98,
      experienceMatch: 95,
      educationMatch: 45,
      rejectionConfidence: 88,
      yearsExperience: 12,
      educationLevel: "high_school",
      skills: ["Java", "Spring", "Kubernetes", "AWS", "Microservices"],
      department: "Engineering",
      recruiterRecommendation: "recover",
      similarityWarning: "94% similar to 3 top performers",
    },
    {
      name: "James Mwangi",
      email: "james.mwangi@gmail.com",
      roleId: roles[2].id, // DevOps Engineer
      rejectedAt: daysAgo(8),
      recovered: true,
      retentionExpiresAt: daysAgo(82),
      recoveryScore: 92,
      skillMatch: 97,
      experienceMatch: 48,
      educationMatch: 72,
      rejectionConfidence: 91,
      yearsExperience: 3,
      educationLevel: "bachelors",
      skills: ["Go", "Kubernetes", "AWS", "Terraform", "Docker", "CI/CD"],
      department: "Engineering",
      recruiterRecommendation: "recover",
      similarityWarning: "91% similar to 4 top performers",
    },
    {
      name: "Amina Hassan",
      email: "amina.hassan@gmail.com",
      roleId: roles[7].id, // UI Designer
      rejectedAt: daysAgo(22),
      recovered: true,
      retentionExpiresAt: daysAgo(68),
      recoveryScore: 90,
      skillMatch: 95,
      experienceMatch: 88,
      educationMatch: 82,
      rejectionConfidence: 75,
      yearsExperience: 6,
      educationLevel: "masters",
      skills: ["Figma", "Sketch", "React", "CSS", "Design Systems"],
      department: "Marketing",
      recruiterRecommendation: "recover",
      similarityWarning: "89% similar to 2 top performers",
    },
  ];

  for (const rc of recoveryPoolData) {
    const [c] = await db.insert(candidatesTable).values(rc).returning();
    
    const [d] = await db.insert(decisionsTable).values({
      candidateId: c.id,
      roleId: c.roleId,
      rejectionSummary: "Degree Requirement; Experience Below Threshold",
      recoverable: true,
      recovered: true,
      rejectedAt: c.rejectedAt,
      confidenceScore: 88,
      evidenceCount: 2,
      recruiterId: "sarah.kim",
      evidenceStrength: "high",
    }).returning();

    await db.insert(decisionRulesTable).values([
      { decisionId: d.id, ruleId: rules[2].id, ruleName: rules[2].name, ruleDescription: rules[2].description },
      { decisionId: d.id, ruleId: rules[1].id, ruleName: rules[1].name, ruleDescription: rules[1].description },
    ]);
  }
  log(`  → ${recoveryPoolData.length} recovery pool candidates`);

  // ─── Specific Decision Log Entries ─────────────────────────────────────
  log("Seeding decision log entries...");
  const decisionLogData = [
    {
      name: "Michael Brown",
      email: "michael.brown@gmail.com",
      roleId: roles[0].id,
      rejectedAt: daysAgo(5),
      recovered: false,
      retentionExpiresAt: daysAgo(85),
      recoveryScore: 45,
      skillMatch: 72,
      experienceMatch: 88,
      educationMatch: 92,
      rejectionConfidence: 98,
      yearsExperience: 8,
      educationLevel: "masters",
      skills: ["Java", "Spring", "SQL", "Docker"],
      department: "Engineering",
      recruiterRecommendation: "reject",
      similarityWarning: null,
    },
    {
      name: "Faith Wambui",
      email: "faith.wambui@gmail.com",
      roleId: roles[7].id,
      rejectedAt: daysAgo(12),
      recovered: true,
      retentionExpiresAt: daysAgo(78),
      recoveryScore: 91,
      skillMatch: 94,
      experienceMatch: 89,
      educationMatch: 85,
      rejectionConfidence: 91,
      yearsExperience: 5,
      educationLevel: "bachelors",
      skills: ["Figma", "Sketch", "Adobe XD", "Prototyping"],
      department: "Marketing",
      recruiterRecommendation: "recover",
      similarityWarning: "92% similar to 3 top performers",
    },
    {
      name: "Daniel Kimani",
      email: "daniel.kimani@gmail.com",
      roleId: roles[1].id,
      rejectedAt: daysAgo(3),
      recovered: false,
      retentionExpiresAt: daysAgo(87),
      recoveryScore: 68,
      skillMatch: 78,
      experienceMatch: 72,
      educationMatch: 88,
      rejectionConfidence: 72,
      yearsExperience: 6,
      educationLevel: "masters",
      skills: ["Product Management", "Agile", "Jira", "Analytics"],
      department: "Product",
      recruiterRecommendation: "manual_review",
      similarityWarning: null,
    },
  ];

  for (const dl of decisionLogData) {
    const [c] = await db.insert(candidatesTable).values(dl).returning();
    
    const [d] = await db.insert(decisionsTable).values({
      candidateId: c.id,
      roleId: c.roleId,
      rejectionSummary: c.name === "Michael Brown" ? "Missing Required Skill (Kubernetes)" : "Conflicting ATS rules detected",
      recoverable: c.recovered || c.recruiterRecommendation === "manual_review",
      recovered: c.recovered,
      rejectedAt: c.rejectedAt,
      confidenceScore: c.rejectionConfidence,
      evidenceCount: 2,
      recruiterId: "kevin.otieno",
      evidenceStrength: (c.rejectionConfidence ?? 0) > 85 ? "high" : "medium",
    }).returning();

    if (c.name === "Michael Brown") {
      await db.insert(decisionRulesTable).values([
        { decisionId: d.id, ruleId: rules[0].id, ruleName: rules[0].name, ruleDescription: rules[0].description },
      ]);
    } else {
      await db.insert(decisionRulesTable).values([
        { decisionId: d.id, ruleId: rules[0].id, ruleName: rules[0].name, ruleDescription: rules[0].description },
        { decisionId: d.id, ruleId: rules[1].id, ruleName: rules[1].name, ruleDescription: rules[1].description },
      ]);
    }
  }
  log(`  → ${decisionLogData.length} decision log entries`);

  log("\n✅ Seed complete. ClearFunnel demo data is ready.");
  log("\n📊 Dashboard Metrics Summary:");
  log("   Total Applications: 5,000+");
  log("   Total Candidates: 5,000+");
  log("   Active Jobs: 14");
  log("   Recruiters: 5");
  log("   Auto-Rejected: ~2,300");
  log("   Manual-Rejected: ~500");
  log("   Interviewed: ~1,200");
  log("   Offers Sent: ~150");
  log("   Hired: ~80");
  log("   Recovery Pool: 87+");
  log("   Validation Pass Rate: 91.6%");
  log("   Governance Score: 88");
  log("   ATS Health Score: 94");
  log("   Open Alerts: 5");
}

main().catch((e) => {
  process.stderr.write(`[seed] ERROR: ${e.message}\n`);
  process.exit(1);
});

/**
 * ClearFunnel Intelligence Algorithms
 *
 * Every function here solves a real hiring governance problem.
 * No arbitrary AI — pure deterministic formulas on real data.
 */

// ─── Candidate Recovery Score ──────────────────────────────────────────────
// Purpose: Find candidates who were rejected but actually deserve another look.
// Score = (skillMatch × 0.35) + (experienceMatch × 0.30) + (educationMatch × 0.20)
//         + (100 - rejectionConfidence) × 0.15
// Range: 0–100. >75 = Recommend Recovery, 50–75 = Manual Review, <50 = Low Priority
export function computeRecoveryScore(
  skillMatch: number,
  experienceMatch: number,
  educationMatch: number,
  rejectionConfidence: number,
): number {
  const score =
    skillMatch * 0.35 +
    experienceMatch * 0.30 +
    educationMatch * 0.20 +
    (100 - rejectionConfidence) * 0.15;
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function recoveryRecommendation(score: number): "recover" | "review" | "reject" {
  if (score >= 75) return "recover";
  if (score >= 50) return "review";
  return "reject";
}

// ─── Rule Accuracy Score ───────────────────────────────────────────────────
// Purpose: Measure how accurately a rule identifies true rejections.
// Accuracy = correctCount / triggeredCount × 100
// FP Rate  = falsePositiveCount / triggeredCount × 100
// FN Rate  = falseNegativeCount / triggeredCount × 100
export function computeRuleAccuracy(
  triggeredCount: number,
  correctCount: number,
  falsePositiveCount: number,
  falseNegativeCount: number,
): { accuracy: number; fpRate: number; fnRate: number } {
  if (triggeredCount === 0) return { accuracy: 100, fpRate: 0, fnRate: 0 };
  const accuracy = Math.round((correctCount / triggeredCount) * 100 * 10) / 10;
  const fpRate = Math.round((falsePositiveCount / triggeredCount) * 100 * 10) / 10;
  const fnRate = Math.round((falseNegativeCount / triggeredCount) * 100 * 10) / 10;
  return { accuracy, fpRate, fnRate };
}

// ─── Decision Confidence Score ─────────────────────────────────────────────
// Purpose: How confident are we that this rejection was correct?
// Confidence = (Σ ruleWeights / totalPossibleWeight) × 0.70
//            + (average rule accuracy)               × 0.20
//            + (evidenceCount / maxEvidence)         × 0.10
// Range: 0–100. >85 = Strong, 65–85 = Moderate, <65 = Weak
export function computeDecisionConfidence(
  triggeredRuleWeights: number[],   // weight_percent for each triggered rule
  triggeredRuleAccuracies: number[], // accuracy of each triggered rule
  maxPossibleWeight: number = 100,
): number {
  if (triggeredRuleWeights.length === 0) return 40;

  const weightSum = triggeredRuleWeights.reduce((a, b) => a + b, 0);
  const avgAccuracy =
    triggeredRuleAccuracies.reduce((a, b) => a + b, 0) /
    triggeredRuleAccuracies.length;
  const evidenceFactor = Math.min(triggeredRuleWeights.length / 4, 1); // saturates at 4 rules

  const confidence =
    (weightSum / maxPossibleWeight) * 70 +
    (avgAccuracy / 100) * 20 +
    evidenceFactor * 10;

  return Math.min(100, Math.max(0, Math.round(confidence)));
}

export function evidenceStrength(confidence: number): "strong" | "moderate" | "weak" {
  if (confidence >= 85) return "strong";
  if (confidence >= 65) return "moderate";
  return "weak";
}

// ─── Governance Score ──────────────────────────────────────────────────────
// The signature metric. 0–100, like a credit score for your hiring process.
// Weights: ruleAccuracy 20%, falseRejectionRate 20%, recoverySuccessRate 15%,
//          recruiterConsistency 15%, explainabilityCoverage 10%,
//          biasRisk 10%, validationPassRate 10%
export function computeGovernanceScore(params: {
  ruleAccuracy: number;          // 0–100
  falseRejectionRate: number;    // 0–100 (lower = better)
  recoverySuccessRate: number;   // 0–100
  recruiterConsistency: number;  // 0–100
  explainabilityCoverage: number;// 0–100
  biasRisk: number;              // 0–100 (lower = better)
  validationPassRate: number;    // 0–100
}): number {
  const score =
    params.ruleAccuracy            * 0.20 +
    (100 - params.falseRejectionRate) * 0.20 +
    params.recoverySuccessRate     * 0.15 +
    params.recruiterConsistency    * 0.15 +
    params.explainabilityCoverage  * 0.10 +
    (100 - params.biasRisk)        * 0.10 +
    params.validationPassRate      * 0.10;
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function governanceLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: "Excellent", color: "green" };
  if (score >= 75) return { label: "Good", color: "blue" };
  if (score >= 60) return { label: "Needs Improvement", color: "yellow" };
  return { label: "At Risk", color: "red" };
}

// ─── ATS Health Score ──────────────────────────────────────────────────────
// Measures the operational health of your ATS rule engine.
// healthScore = ruleHealth×0.30 + anomalyHealth×0.25 + validationCoverage×0.25 + alertResolution×0.20
export function computeATSHealthScore(params: {
  ruleHealthScore: number;     // % of rules with accuracy > 80%
  anomalyHealth: number;       // 100 - (openAlerts / totalDecisions × 1000) capped at 100
  validationCoverage: number;  // % of rules with recent validation
  alertResolutionRate: number; // % of alerts resolved within 48h
}): number {
  const score =
    params.ruleHealthScore    * 0.30 +
    params.anomalyHealth      * 0.25 +
    params.validationCoverage * 0.25 +
    params.alertResolutionRate * 0.20;
  return Math.min(100, Math.max(0, Math.round(score)));
}

// ─── Z-Score Anomaly Detection ─────────────────────────────────────────────
// Flags rejection rates that deviate significantly from the historical mean.
// z = (currentRate - mean) / stdDev
// |z| > 2: High alert, |z| > 3: Critical alert
export function computeZScore(currentRate: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  return Math.round(((currentRate - mean) / stdDev) * 100) / 100;
}

export function zScoreSeverity(zScore: number): "low" | "medium" | "high" | "critical" {
  const abs = Math.abs(zScore);
  if (abs >= 3) return "critical";
  if (abs >= 2.5) return "high";
  if (abs >= 2) return "medium";
  return "low";
}

// ─── Recruiter Consistency Score ───────────────────────────────────────────
// Measures how consistently a recruiter applies rules compared to their team.
// consistencyScore = 100 - (|recruiterRate - teamMean| / teamMean × 100) capped at 0
export function computeRecruiterConsistency(
  recruiterRejectionRate: number,
  teamMeanRate: number,
  teamStdDev: number,
): { consistencyScore: number; zScore: number } {
  const zScore = computeZScore(recruiterRejectionRate, teamMeanRate, teamStdDev);
  const deviation = Math.abs(zScore);
  const consistencyScore = Math.max(0, Math.round(100 - deviation * 20));
  return { consistencyScore, zScore };
}

// ─── Validation Confidence ─────────────────────────────────────────────────
// confidence = passRate × historicalAccuracy × evidenceCompleteness
// Where evidenceCompleteness = benchmarkCount / targetBenchmarkCount (min 10)
export function computeValidationConfidence(
  passCount: number,
  benchmarkCount: number,
  historicalAccuracy: number, // 0–1
  targetBenchmarkCount = 10,
): number {
  if (benchmarkCount === 0) return 0;
  const passRate = passCount / benchmarkCount;
  const evidenceCompleteness = Math.min(1, benchmarkCount / targetBenchmarkCount);
  return Math.round(passRate * historicalAccuracy * evidenceCompleteness * 100);
}

// ─── Bias Risk Score ───────────────────────────────────────────────────────
// Measures disparity in rejection rates across candidate groups.
// biasRisk = max(pairwise rejection rate differences) × sensitivityMultiplier
// Uses location, education level, and experience as demographic proxies.
export function computeBiasRisk(rejectionRates: number[]): number {
  if (rejectionRates.length < 2) return 0;
  let maxDiff = 0;
  for (let i = 0; i < rejectionRates.length; i++) {
    for (let j = i + 1; j < rejectionRates.length; j++) {
      maxDiff = Math.max(maxDiff, Math.abs(rejectionRates[i] - rejectionRates[j]));
    }
  }
  // Normalise: a 30pp gap = 100 risk
  return Math.min(100, Math.round((maxDiff / 30) * 100));
}

// ─── Cosine Similarity ────────────────────────────────────────────────────
// Candidate similarity engine: find candidates similar to top performers.
// Used to flag potentially wrongful rejections.
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (magA === 0 || magB === 0) return 0;
  return Math.round((dot / (magA * magB)) * 100);
}

// ─── Financial Impact ──────────────────────────────────────────────────────
// Estimate cost of false rejections to the organisation.
// Assumes: avg bad hire cost $15,000, avg role salary $95,000, replacement cost 1.5×
// Revenue at risk per false rejection = avg salary × 0.3 (conservative talent loss cost)
export function computeFinancialImpact(falseRejectionCount: number, avgSalary = 95000): {
  talentLossCost: number;
  recruiterReworkCost: number;
  totalCost: number;
} {
  const talentLossCost = Math.round(falseRejectionCount * avgSalary * 0.30);
  const recruiterReworkCost = Math.round(falseRejectionCount * 2500); // ~2.5h rework per false rejection
  return {
    talentLossCost,
    recruiterReworkCost,
    totalCost: talentLossCost + recruiterReworkCost,
  };
}

// ─── Standard Deviation ───────────────────────────────────────────────────
export function stdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

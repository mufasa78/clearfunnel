import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Plug, GitBranch, Database, AlertCircle, RefreshCw,
  CheckCircle2, ArrowRight, Clock, Shield, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const steps = [
  {
    icon: Plug,
    num: "01",
    title: "Connect your ATS via Webhook",
    desc: "ClearFunnel integrates silently. Point your ATS webhooks to our endpoint — we start mapping and intercepting decision logic immediately. No engineering sprint, no disruption to active funnels, and no replacement of your existing stack.",
    detail: "Compatible with Greenhouse, Lever, Workday, iCIMS, SmartRecruiters, and any webhook-capable ATS. Average setup time: under 15 minutes.",
    color: "#2563EB",
    bg: "rgba(37,99,235,0.08)",
  },
  {
    icon: GitBranch,
    num: "02",
    title: "Build and version your rule registry",
    desc: "Treat hiring logic like production code. Import your existing ATS rules or write new ones in ClearFunnel's registry. Every rule gets an owner, a description, a version history, and a validation status.",
    detail: "The registry is the source of truth for all your automated hiring logic. You can see at a glance who owns what, when it was last validated, and what its current rejection rate is.",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
  },
  {
    icon: Shield,
    num: "03",
    title: "Validate rules before they go live",
    desc: "Every new or modified rule must pass the Validation Harness before deployment. Upload a benchmark resume set and ClearFunnel automatically tests the rule against it. A rule that rejects 'should-pass' candidates cannot go live without a logged manual override.",
    detail: "Validation results are returned in under 5 minutes — fast enough that no recruiter routes around it. Every validation run is logged, including who approved overrides and why.",
    color: "#06B6D4",
    bg: "rgba(6,182,212,0.08)",
  },
  {
    icon: AlertCircle,
    num: "04",
    title: "Monitor for anomalies in real time",
    desc: "ClearFunnel continuously tracks rejection rates by role, rule, and time window. If a rule's rejection rate deviates more than 2 standard deviations from its 30-day baseline, we flag it on your dashboard and send an alert — before your pipeline empties.",
    detail: "Alerts include which rule is correlated with the shift, the affected role, the magnitude of the anomaly, and a direct link to investigate. No more finding out months later.",
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)",
  },
  {
    icon: RefreshCw,
    num: "05",
    title: "Recover wrongly-rejected candidates",
    desc: "When a bad rule fires, you don't lose the candidates permanently. ClearFunnel's Recovery Pool holds every auto-rejected candidate for 90 days (Growth) or 1 year (Enterprise). Override a decision in two clicks — with recruiter ID, timestamp, and reason logged automatically.",
    detail: "Override an ATS decision and the candidate is re-queued for manual review. Every override is part of the immutable audit log, giving you a complete paper trail for compliance.",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
  },
];

const integrations = [
  "Greenhouse", "Lever", "Workday", "iCIMS", "SmartRecruiters", "Ashby", "BambooHR", "Jobvite"
];

const commitments = [
  { icon: Clock, title: "< 5 minutes", desc: "Average rule validation turnaround time" },
  { icon: Shield, title: "100%", desc: "Decision traceability — every rejection logged" },
  { icon: Zap, title: "15 minutes", desc: "Average ATS connection and setup time" },
  { icon: RefreshCw, title: "90 days", desc: "Candidate recovery window on Growth plan" },
];

export default function HowItWorks() {
  return (
    <div className="w-full">
      {/* ─── Hero ─────────────────────────────────────── */}
      <section
        className="py-20 md:py-28 px-4 md:px-6 text-center relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 30% 0%, rgba(37,99,235,0.1) 0%, transparent 55%), " +
            "radial-gradient(ellipse at 70% 0%, rgba(124,58,237,0.08) 0%, transparent 55%), #fff",
        }}
      >
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">How It Works</p>
          <h1
            className="text-5xl md:text-6xl font-black tracking-tight leading-[1.04] mb-5"
            style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
          >
            The invisible safety net for your hiring funnel
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            ClearFunnel sits alongside your existing ATS — validating rules, logging every rejection, surfacing anomalies, and making sure no great candidate is permanently lost to a bad filter.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Button
              className="rounded-full h-12 px-7 font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              asChild
            >
              <Link href="/app/dashboard">
                Start Free Trial <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="rounded-full h-12 px-7 font-medium"
              asChild
            >
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ─── Performance Commitments ─────────────────── */}
      <section className="py-14 bg-slate-50 border-y border-border px-4 md:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {commitments.map((c, i) => (
            <motion.div
              key={c.title}
              className="text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="size-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto mb-3">
                <c.icon className="size-5" />
              </div>
              <div
                className="text-2xl font-black mb-1"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {c.title}
              </div>
              <div className="text-xs text-muted-foreground font-medium">{c.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Image + Intro ────────────────────────────── */}
      <section className="py-20 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=900&auto=format&fit=crop&q=80"
              alt="HR Operations team reviewing ATS filtering rules and hiring decisions"
              className="rounded-2xl shadow-xl object-cover aspect-[4/3] w-full"
              loading="lazy"
            />
          </motion.div>
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">The approach</p>
            <h2
              className="text-3xl md:text-4xl font-black tracking-tight leading-tight"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
            >
              Governance that HR teams can actually own
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Most ATS governance tools are built for engineers. ClearFunnel is built for HR Ops Leads, Recruiters, and People Systems Admins — the people who are actually accountable for hiring quality, but have historically had zero visibility into filter logic.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We give them the visibility, control, and governance they need to ensure their ATS works <em>for</em> them — not against them. No engineering ticket required.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                "Self-serve visibility into every auto-rejection",
                "Dashboard built for non-technical users",
                "Alerts delivered in plain language, not rule IDs",
                "Override and recover without engineering help",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                  <CheckCircle2 className="size-4 text-blue-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ─── 5 Steps Timeline ─────────────────────────── */}
      <section className="py-24 md:py-32 bg-slate-50 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">The 5-Step Process</p>
            <h2
              className="text-4xl md:text-5xl font-black tracking-tight"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
            >
              From connection to governance
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical connector */}
            <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-amber-200 hidden md:block" />

            <div className="space-y-10">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  className="flex flex-col md:flex-row gap-6 md:gap-10 items-start relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: 0.05 }}
                >
                  {/* Step icon */}
                  <div
                    className="size-16 rounded-2xl flex items-center justify-center shrink-0 relative z-10 shadow-md"
                    style={{ backgroundColor: step.bg, color: step.color, border: `1.5px solid ${step.color}30` }}
                  >
                    <step.icon className="size-7" strokeWidth={1.8} />
                  </div>

                  {/* Content card */}
                  <div className="bg-white rounded-2xl border border-border/70 p-6 flex-1 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3
                        className="text-xl font-bold"
                        style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
                      >
                        {step.title}
                      </h3>
                      <span
                        className="text-xs font-black tabular-nums shrink-0 mt-0.5"
                        style={{ color: step.color, fontFamily: "'Satoshi', sans-serif" }}
                      >
                        Step {step.num}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{step.desc}</p>
                    <div
                      className="text-xs rounded-lg px-3 py-2.5 leading-relaxed"
                      style={{ backgroundColor: step.bg, color: step.color }}
                    >
                      ℹ️ {step.detail}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── ATS Integrations ─────────────────────────── */}
      <section className="py-20 md:py-24 bg-white px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Integrations</p>
            <h2
              className="text-3xl md:text-4xl font-black tracking-tight mb-5"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
            >
              Works with your ATS — whatever it is
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              ClearFunnel connects via webhooks to any ATS platform. We have pre-built connectors for the most common systems, and a documented integration pattern for adding others in under a day.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {integrations.map((name, i) => (
              <motion.div
                key={name}
                className="rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground bg-white shadow-sm hover:border-blue-300 hover:text-blue-700 transition-colors"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                {name}
              </motion.div>
            ))}
            <motion.div
              className="rounded-full border border-dashed border-muted-foreground/30 px-5 py-2 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              + your ATS →
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Image Section ────────────────────────────── */}
      <section className="py-20 bg-slate-50 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop&q=80",
                alt: "Recruiter reviewing candidate pipeline on laptop",
                caption: "HR teams see every automated decision in plain language.",
              },
              {
                img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&auto=format&fit=crop&q=80",
                alt: "People systems admin configuring ATS rules on a dashboard",
                caption: "People Systems Admins validate rules before they go live.",
              },
              {
                img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
                alt: "HR leader reviewing hiring governance data",
                caption: "HR Leaders get the accountability data they need — without engineering.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.alt}
                className="rounded-2xl overflow-hidden shadow-md group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.alt}
                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="bg-white p-4 border-t border-border/60">
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────── */}
      <section
        className="py-24 md:py-32 px-4 md:px-6 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0B1426 0%, #1E3A8A 50%, #4C1D95 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
          backgroundSize: "28px 28px"
        }} />
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <motion.h2
            className="text-4xl md:text-5xl font-black text-white tracking-tight"
            style={{ fontFamily: "'Satoshi', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to secure your hiring funnel?
          </motion.h2>
          <p className="text-lg text-white/60">
            Setup takes less than 15 minutes. Connect your ATS and start logging every automated decision today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="rounded-full h-13 px-8 font-semibold bg-white text-blue-900 hover:bg-white/90 shadow-xl"
              asChild
            >
              <Link href="/app/dashboard">Enter Dashboard</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-13 px-8 font-medium border-white/25 text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

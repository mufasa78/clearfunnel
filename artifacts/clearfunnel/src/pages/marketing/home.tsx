import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ShieldCheck, Activity, RefreshCw, ArrowRight,
  CheckCircle2, AlertTriangle, TrendingUp, Users,
  Plug, GitBranch, Lock, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─── Animation helpers ────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// ─── Static data ──────────────────────────────────────
const stats = [
  { value: "24,842+", label: "Applications governed",    sub: "+4.1% vs last month" },
  { value: "3,078",   label: "Auto-routed for review",   sub: "12.4% of total" },
  { value: "152",     label: "Candidates recovered",     sub: "+30 this week" },
  { value: "48",      label: "Rules monitored",          sub: "All active" },
];

const features = [
  { icon: ShieldCheck, title: "Validation Harness",       desc: "Test new ATS rules against benchmark resumes before they touch your live pipeline. A bad rule cannot deploy without a logged override.", color: "#2563EB", bg: "rgba(37,99,235,0.08)" },
  { icon: Activity,   title: "Real-Time Anomaly Alerts",  desc: "ClearFunnel flags any role where rejection rate deviates >2σ from its 30-day baseline and names the correlated rule.", color: "#7C3AED", bg: "rgba(124,58,237,0.08)" },
  { icon: RefreshCw,  title: "90-Day Recovery Pool",      desc: "Every auto-rejected candidate is held for 90 days. Override a bad rule and pull impacted candidates back into review — fully logged.", color: "#06B6D4", bg: "rgba(6,182,212,0.08)" },
  { icon: Lock,       title: "Immutable Decision Log",    desc: "Every rejection is recorded with rule version, candidate ID, and timestamp. Nothing is silent. Every decision is traceable.", color: "#10B981", bg: "rgba(16,185,129,0.08)" },
  { icon: GitBranch,  title: "Rule Registry & Versioning", desc: "Treat hiring logic like code. Every rule has an owner, a version history, and a last-validated date — no more 'who changed that?'.", color: "#F59E0B", bg: "rgba(245,158,11,0.08)" },
  { icon: Plug,       title: "Works With Your ATS",       desc: "Integrates via webhooks with Greenhouse, Lever, Workday, and more. No ripping and replacing — sits silently alongside your existing stack.", color: "#EF4444", bg: "rgba(239,68,68,0.08)" },
];

const steps = [
  { num: "01", title: "Connect your ATS in minutes",       desc: "Point your ATS webhooks to ClearFunnel. We start mapping decision logic immediately — no disruption, no engineering sprint." },
  { num: "02", title: "Validate rules before going live",  desc: "Every new or modified rule runs through your benchmark resume set. A rule that blocks qualified candidates cannot reach production without a logged override." },
  { num: "03", title: "Monitor, alert, and recover",       desc: "Live anomaly detection surfaces rejection spikes immediately. Recover impacted candidates from the 90-day pool in two clicks." },
];

const testimonials = [
  { quote: "We found a rule silently rejecting senior engineers for over a year. ClearFunnel caught it in the first week. I don't know how we operated without this.", name: "Anika Osei",  role: "Head of People Operations", company: "Fintech startup, Accra",        initials: "AO" },
  { quote: "The validation harness alone is worth the price. We push a new screening rule and know in five minutes whether it breaks anything — before it touches a real candidate.", name: "Marcus Chen", role: "VP of Talent Acquisition",  company: "SaaS company, Singapore",    initials: "MC" },
];

export default function Home() {
  const [activeRejection, setActiveRejection] = useState(0);
  const rejections = [
    { name: "Sarah Jenkins", role: "Senior Engineer, 12 yrs exp",  rule: "Missing degree requirement",    time: "10:42:03" },
    { name: "Marcus Diallo", role: "Product Manager, ex-Google",   rule: "Years of experience < 5",       time: "10:42:07" },
    { name: "Priya Mehta",   role: "Designer, Figma certified",    rule: "Keyword missing: 'Adobe XD'",   time: "10:42:11" },
  ];
  useEffect(() => {
    const t = setInterval(() => setActiveRejection(p => (p + 1) % rejections.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col w-full">

      {/* ════════════════════════════════════════════════
          HERO — split column with hero image
          ════════════════════════════════════════════════ */}
      <section
        className="relative px-4 md:px-6 pt-14 pb-20 md:pt-20 md:pb-28 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 15% 60%, rgba(37,99,235,0.3) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 85% 15%, rgba(124,58,237,0.22) 0%, transparent 50%), " +
            "#0B1426",
        }}
        aria-label="Hero section"
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Two-column layout */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT — text */}
            <div className="flex flex-col gap-6 text-center md:text-left">
              <motion.div variants={fadeUp} initial="hidden" animate="show">
                <Badge
                  variant="outline"
                  className="rounded-full px-4 py-1.5 border-blue-500/30 text-blue-300 bg-blue-500/10 text-xs font-semibold backdrop-blur-sm"
                >
                  The ATS Decision Governance Layer
                </Badge>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-[60px] font-black tracking-[-0.03em] leading-[1.04] text-white"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
                variants={fadeUp} initial="hidden" animate="show"
                transition={{ delay: 0.08 }}
              >
                See every decision.{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Trust every hire.
                </span>
              </motion.h1>

              <motion.p
                className="text-lg text-white/60 leading-relaxed font-medium max-w-lg mx-auto md:mx-0"
                variants={fadeUp} initial="hidden" animate="show"
                transition={{ delay: 0.16 }}
              >
                Your ATS auto-rejects thousands of candidates every month. ClearFunnel makes every one of those decisions visible, testable, and recoverable — without replacing your existing stack.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3"
                variants={fadeUp} initial="hidden" animate="show"
                transition={{ delay: 0.22 }}
              >
                <Button
                  size="lg"
                  className="rounded-full h-13 px-8 text-base font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/40 transition-all hover:scale-[1.02]"
                  asChild
                >
                  <Link href="/app/dashboard">
                    Start 14-Day Free Trial <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button
                  size="lg" variant="outline"
                  className="rounded-full h-13 px-8 text-base font-medium border-white/20 text-white/80 hover:bg-white/10 hover:text-white bg-transparent backdrop-blur-sm"
                  asChild
                >
                  <Link href="/how-it-works">See how it works</Link>
                </Button>
              </motion.div>

              <motion.p
                className="text-xs text-white/30"
                variants={fadeUp} initial="hidden" animate="show"
                transition={{ delay: 0.28 }}
              >
                No credit card required · Setup in under 15 minutes · Cancel anytime
              </motion.p>

              {/* Social proof logos row */}
              <motion.div
                className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-center md:justify-start pt-2"
                variants={fadeUp} initial="hidden" animate="show"
                transition={{ delay: 0.34 }}
              >
                <span className="text-[11px] text-white/25 uppercase tracking-widest">Trusted by HR teams at</span>
                {["Greenhouse", "Lever", "Workday"].map(n => (
                  <span key={n} className="text-[11px] font-semibold text-white/35">{n} users</span>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — hero image with floating UI cards */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            >
              {/* Main image */}
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10">
                <img
                  src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=900&auto=format&fit=crop&q=80"
                  alt="HR operations team reviewing ATS hiring decisions using ClearFunnel"
                  className="w-full aspect-[4/3] object-cover"
                  loading="eager"
                />
                {/* Overlay tint for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating: Live alert card — top right */}
              <motion.div
                className="absolute -top-3 -right-3 md:-top-5 md:-right-5 bg-white rounded-xl px-3.5 py-2.5 shadow-xl border border-border/80 w-52"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Live Alert</span>
                </div>
                <p className="text-xs font-bold text-foreground leading-tight">Rejection spike detected</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Senior Engineer · +2.3σ above baseline</p>
              </motion.div>

              {/* Floating: Recovery stat — bottom left */}
              <motion.div
                className="absolute -bottom-3 -left-3 md:-bottom-5 md:-left-5 bg-white rounded-xl px-3.5 py-2.5 shadow-xl border border-border/80"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="size-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-green-700" style={{ fontFamily: "'Satoshi', sans-serif" }}>152 recovered</p>
                    <p className="text-[10px] text-muted-foreground">candidates · this month</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating: Rule validated — mid right */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 -right-3 md:-right-5 bg-white rounded-xl px-3 py-2 shadow-lg border border-border/80"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-blue-600 shrink-0" />
                  <span className="text-[10px] font-bold text-foreground whitespace-nowrap">Rule validated ✓</span>
                </div>
                <p className="text-[9px] text-muted-foreground mt-0.5">Experience &gt; 5yr · passed</p>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats row — full width below grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-10 border-t border-white/10 mt-14"
            variants={stagger} initial="hidden" animate="show"
          >
            {stats.map(stat => (
              <motion.div key={stat.label} variants={fadeUp} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-white mb-0.5" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                  {stat.value}
                </div>
                <div className="text-xs text-white/50 font-medium">{stat.label}</div>
                {stat.sub && <div className="text-[10px] text-blue-400/70 mt-0.5">{stat.sub}</div>}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          PROBLEM
          ════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white px-4 md:px-6" aria-label="The problem">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              className="space-y-7"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">The Problem</p>
                <h2
                  className="text-4xl md:text-5xl font-black tracking-tight leading-tight"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
                >
                  Your ATS makes 3,000+ decisions a month.{" "}
                  <span className="text-red-500">You see none of them.</span>
                </h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Hiring teams set up ATS filter rules once, then forget them. These rules run silently, auto-rejecting hundreds of qualified candidates weekly — with no visibility into why, which rule, or how many were lost.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: AlertTriangle, text: "Untested criteria filtering out senior talent daily",            color: "text-red-500 bg-red-50" },
                  { icon: Lock,         text: "No audit trail — you can't prove why a decision was made",        color: "text-orange-500 bg-orange-50" },
                  { icon: TrendingUp,   text: "Zero funnel anomaly visibility until damage is done",             color: "text-yellow-600 bg-yellow-50" },
                  { icon: Users,        text: "No recovery path — rejected candidates are lost permanently",     color: "text-purple-500 bg-purple-50" },
                ].map(({ icon: Icon, text, color }) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className={`mt-0.5 size-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                      <Icon className="size-4" />
                    </span>
                    <span className="text-sm font-medium leading-relaxed pt-1.5">{text}</span>
                  </li>
                ))}
              </ul>

              {/* Nav CTA */}
              <div className="flex gap-3 pt-2">
                <Button className="rounded-full font-semibold bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <Link href="/how-it-works">See how ClearFunnel solves this <ArrowRight className="ml-2 size-4" /></Link>
                </Button>
              </div>
            </motion.div>

            {/* Live rejection feed */}
            <motion.div
              className="rounded-2xl overflow-hidden border border-border shadow-2xl shadow-slate-200/60"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="bg-slate-900 px-4 py-3 flex items-center gap-2 border-b border-white/10">
                <div className="size-3 rounded-full bg-red-500/80" />
                <div className="size-3 rounded-full bg-yellow-400/80" />
                <div className="size-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-white/30 text-xs font-mono">ATS Auto-Reject Feed — LIVE</span>
                <span className="ml-auto flex items-center gap-1.5 text-[10px] text-red-400 font-mono">
                  <span className="size-1.5 rounded-full bg-red-400 animate-pulse" /> LIVE
                </span>
              </div>
              <div className="bg-[#0B1120] p-5 space-y-3 font-mono text-sm">
                <div className="text-slate-500 text-xs mb-3">
                  Role: <span className="text-slate-300">Senior Software Engineer — #4421</span>
                </div>
                {rejections.map((r, i) => (
                  <motion.div
                    key={r.name}
                    className={`rounded-lg p-3.5 border transition-all duration-500 ${
                      i === activeRejection ? "border-red-500/40 bg-red-500/10" : "border-white/5 bg-white/[0.02]"
                    }`}
                    animate={{ opacity: i === activeRejection ? 1 : 0.45 }}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-white text-xs font-semibold block">{r.name}</span>
                        <span className="text-slate-400 text-[10px]">{r.role}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-red-400 text-[10px] font-bold uppercase block">REJECTED</span>
                        <span className="text-slate-500 text-[10px]">{r.time}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-500 border-t border-white/5 pt-2">
                      Rule: <span className="text-yellow-400">{r.rule}</span>
                    </div>
                  </motion.div>
                ))}
                <div className="pt-2 text-center text-[10px] text-slate-600">
                  152 more rejections in the last 24 hours →
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FEATURES
          ════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-slate-50 px-4 md:px-6" aria-label="Features">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">How ClearFunnel Helps</p>
            <h2
              className="text-4xl md:text-5xl font-black tracking-tight leading-tight"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
            >
              Regain full control of your hiring funnel
            </h2>
            <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
              Every feature is built around one principle: no automated hiring decision should be invisible or unrecoverable.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={stagger} initial="hidden" whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {features.map(feat => (
              <motion.div
                key={feat.title}
                variants={fadeUp}
                className="bg-white rounded-2xl p-7 border border-border/60 hover:border-border hover:shadow-md transition-all duration-200 group"
              >
                <div
                  className="size-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: feat.bg, color: feat.color }}
                >
                  <feat.icon className="size-6" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold mb-2.5" style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}>
                  {feat.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          HOW IT WORKS (abbreviated)
          ════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white px-4 md:px-6" aria-label="How it works">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="text-center max-w-xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Simple Integration</p>
            <h2
              className="text-4xl md:text-5xl font-black tracking-tight"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
            >
              Up and running in 15 minutes
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="relative"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div
                  className="text-5xl font-black mb-4 leading-none"
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}>
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-4 z-10 text-border">
                    <ChevronRight className="size-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Button variant="outline" className="rounded-full font-semibold" asChild>
              <Link href="/how-it-works">
                See the full setup guide <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          DASHBOARD PREVIEW
          ════════════════════════════════════════════════ */}
      <section
        className="py-24 md:py-32 px-4 md:px-6 relative overflow-hidden"
        style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(124,58,237,0.15) 0%, transparent 60%), #0B1426" }}
        aria-label="Dashboard preview"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="space-y-7"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">The Dashboard</p>
                <h2
                  className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-white"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  A command center, not a spreadsheet
                </h2>
              </div>
              <p className="text-lg text-white/55 leading-relaxed">
                ClearFunnel's dashboard gives HR Ops teams the live data they need to make confident decisions — without engineering help every time something looks off.
              </p>
              <ul className="space-y-4">
                {["Live rejection rate tracking by role and rule", "Anomaly alerts surfaced in under 60 seconds", "One-click candidate recovery from the pool", "Complete rule version history and audit log"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-white/70 text-sm">
                    <CheckCircle2 className="size-4 text-blue-400 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <Button className="rounded-full h-12 px-7 font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50" asChild>
                <Link href="/app/dashboard">Enter Dashboard <ArrowRight className="ml-2 size-4" /></Link>
              </Button>
            </motion.div>

            {/* Dashboard mockup */}
            <motion.div
              className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="bg-[#0a0f1a] border-b border-white/10 px-4 py-2.5 flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-red-500/70" />
                <div className="size-2.5 rounded-full bg-yellow-500/70" />
                <div className="size-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-white/20 text-xs font-mono">ClearFunnel · Dashboard</span>
              </div>
              <div className="bg-[#080d16] p-5 font-mono text-xs text-white/60 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Rejection Rate", val: "12.4%",  trend: "−0.4% vs 30d",    up: false },
                    { label: "Auto Rejected",  val: "3,078",  trend: "+12.4% of total",  up: false },
                    { label: "Recovered",      val: "152",    trend: "+30 this week",     up: true  },
                    { label: "Rules Active",   val: "48",     trend: "All passing",       up: true  },
                  ].map(m => (
                    <div key={m.label} className="bg-white/[0.04] rounded-xl p-3 border border-white/5">
                      <div className="text-white/40 text-[10px] mb-1">{m.label}</div>
                      <div className="text-white text-lg font-bold">{m.val}</div>
                      <div className={`text-[10px] mt-0.5 ${m.up ? "text-green-400" : "text-blue-400"}`}>{m.trend}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                  <div className="text-white/40 text-[10px] mb-3">Rejection Rate Over Time</div>
                  <div className="flex items-end gap-1 h-12">
                    {[40,35,55,45,60,50,42,38,52,48,62,44,38,41,45,50,42,55,48,43].map((h,i) => (
                      <div key={i} className="flex-1 rounded-sm" style={{ height:`${h}%`, background:`linear-gradient(180deg,#2563EB${i===12?"ff":"80"},#7C3AED${i===12?"ff":"60"})` }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SOCIAL PROOF — image grid + testimonials
          ════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-slate-50 px-4 md:px-6" aria-label="Social proof">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image grid */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80"
                alt="HR professional reviewing candidate data"
                className="rounded-2xl object-cover aspect-[4/5] w-full shadow-lg"
                loading="lazy"
              />
              <div className="space-y-3 flex flex-col">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80"
                  alt="Hiring team collaborating in a modern office"
                  className="rounded-2xl object-cover aspect-square w-full shadow-lg flex-1"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&auto=format&fit=crop&q=80"
                  alt="Diverse team working on hiring decisions"
                  className="rounded-2xl object-cover aspect-square w-full shadow-lg flex-1"
                  loading="lazy"
                />
              </div>
            </motion.div>

            {/* Stats + testimonials */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Proven Results</p>
                <h2
                  className="text-4xl font-black tracking-tight leading-tight"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
                >
                  Results that speak for themselves
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { val: "< 5 min", label: "Rule validation turnaround" },
                  { val: "90 days", label: "Candidate recovery window" },
                  { val: "100%",    label: "Decision traceability" },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl p-4 border border-border/60 shadow-sm text-center">
                    <div
                      className="text-2xl font-black mb-1"
                      style={{ fontFamily: "'Satoshi', sans-serif", background: "linear-gradient(135deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                    >
                      {s.val}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-medium leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-5">
                {testimonials.map(t => (
                  <div key={t.name} className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm">
                    <p className="text-sm text-muted-foreground leading-relaxed italic mb-4">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div
                        className="size-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)" }}
                      >
                        {t.initials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: "#0F1B3D" }}>{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.role} · {t.company}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          PAGE NAVIGATION STRIP
          ════════════════════════════════════════════════ */}
      <section className="py-12 bg-white border-y border-border px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5 text-center">Explore ClearFunnel</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "How It Works",  sub: "See the 5-step governance process",       href: "/how-it-works", icon: ShieldCheck },
              { label: "Pricing",       sub: "Simple plans for every hiring team",       href: "/pricing",      icon: TrendingUp  },
              { label: "About Us",      sub: "Why we built ClearFunnel",                 href: "/about",        icon: Users       },
            ].map(item => (
              <Link key={item.href} href={item.href}>
                <div className="group flex items-center gap-4 p-4 rounded-xl border border-border hover:border-blue-300 hover:bg-blue-50/40 transition-all cursor-pointer">
                  <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-100 transition-colors">
                    <item.icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground group-hover:text-blue-700 transition-colors" style={{ fontFamily: "'Satoshi', sans-serif" }}>{item.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.sub}</p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground/40 ml-auto shrink-0 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FINAL CTA
          ════════════════════════════════════════════════ */}
      <section
        className="py-24 md:py-32 px-4 md:px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1E3A8A 0%,#4C1D95 50%,#0B1426 100%)" }}
        aria-label="Call to action"
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px,rgba(255,255,255,0.4) 1px,transparent 0)", backgroundSize: "30px 30px" }} />
        <div className="relative z-10 mx-auto max-w-3xl text-center space-y-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Ready to make every hiring decision accountable?
            </h2>
            <p className="text-lg text-white/60 mt-5 leading-relaxed">
              Setup takes under 15 minutes. Connect your ATS and start logging every automated decision today.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Button
              size="lg"
              className="rounded-full h-14 px-9 text-base font-semibold bg-white text-[#1E3A8A] hover:bg-white/90 shadow-xl transition-all hover:scale-[1.02]"
              asChild
            >
              <Link href="/app/dashboard">Start Free Trial — No card needed</Link>
            </Button>
            <Button
              size="lg" variant="outline"
              className="rounded-full h-14 px-9 text-base font-medium border-white/25 text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <Link href="/about">Contact Sales</Link>
            </Button>
          </motion.div>
          <p className="text-xs text-white/30">"See every decision. Trust every hire." — ClearFunnel</p>
        </div>
      </section>
    </div>
  );
}

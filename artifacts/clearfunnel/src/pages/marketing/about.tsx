import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Eye, Shield, Users, TrendingUp, Heart, Linkedin, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const values = [
  {
    icon: Eye,
    title: "Transparency",
    desc: "Every rejection has a reason. We make that reason visible, legible, and auditable — not buried in a rule ID no one can decode.",
    color: "#2563EB",
    bg: "rgba(37,99,235,0.08)",
  },
  {
    icon: Shield,
    title: "Accountability",
    desc: "You're in control. ClearFunnel gives you the data to prove it. Every automated decision is your decision — we just make sure you can see and own it.",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
  },
  {
    icon: Users,
    title: "People First",
    desc: "We care about people, not just processes. The best candidates deserve to be seen. ClearFunnel makes sure they are — even when automation would have filtered them out.",
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)",
  },
  {
    icon: TrendingUp,
    title: "Continuous Improvement",
    desc: "We own our outcomes and follow through. We build systems that get smarter over time, surfacing insights that make every hire better than the last.",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
  },
  {
    icon: Heart,
    title: "Human-Centered",
    desc: "We don't just monitor data — we protect opportunities. Hiring is one of the most consequential acts an organization performs. It should be held to a higher standard.",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
  },
];

const whatWeAre = [
  "An audit trail for every automated hiring decision",
  "A testing environment for new ATS filtering rules",
  "A safety net for overriding bad automated decisions",
  "A monitoring system that surfaces anomalies automatically",
  "A recovery system that ensures no great candidate is permanently lost",
];

const whatWeAreNot = [
  "An ATS — we work alongside your existing system",
  "An AI resume screener — we govern your rules, not replace human judgment",
  "A bias-detection algorithm — we surface what your rules actually do",
  "A compliance checkbox — we build operational discipline, not theater",
];

export default function About() {
  return (
    <div className="w-full">
      {/* ─── Hero ─────────────────────────────────────── */}
      <section
        className="py-20 md:py-28 px-4 md:px-6 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 20% 60%, rgba(37,99,235,0.18) 0%, transparent 55%), " +
            "radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.12) 0%, transparent 55%), #0B1426",
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="space-y-6"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400">About ClearFunnel</p>
            <h1
              className="text-5xl md:text-7xl font-black tracking-tight leading-[1.03] text-white"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Hiring rules need{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                adult supervision.
              </span>
            </h1>
            <p className="text-xl text-white/55 leading-relaxed max-w-2xl">
              Applicant Tracking Systems made it easy to reject candidates at scale. They forgot to make it safe, visible, or recoverable. ClearFunnel fixes that.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Mission / Vision ─────────────────────────── */}
      <section className="py-20 md:py-24 bg-white px-4 md:px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Our Mission</p>
              <h2
                className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-4"
                style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
              >
                Make every automated hiring decision accountable, explainable, and fair.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We help HR teams validate, monitor, and improve their ATS filtering logic — so the best candidates never get filtered out silently again.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-border/60 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-purple-600">Our Vision</p>
              <p className="text-xl font-bold" style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}>
                A world where the best talent is never missed because of a broken filter.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                In a decade, running untested auto-rejection rules on human beings will be viewed as recruiting malpractice. We're building the infrastructure to make sure every candidate is judged fairly, and every system is held accountable.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=80"
              alt="Diverse hiring team collaborating on fair, accountable recruitment practices"
              className="rounded-2xl shadow-xl object-cover aspect-[4/3] w-full"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* ─── The Origin Story ─────────────────────────── */}
      <section className="py-20 md:py-28 bg-slate-50 px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">The Origin</p>
            <h2
              className="text-4xl md:text-5xl font-black tracking-tight"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
            >
              The silent pipeline leak
            </h2>
          </motion.div>

          <motion.div
            className="prose prose-slate max-w-none text-muted-foreground leading-loose"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg mb-6">
              Two years ago, we were scaling an engineering team at a high-growth startup. We struggled to find good senior talent. The pipeline felt dry. After three months of frustrating sourcing, we finally did something we should have done on day one: we manually reviewed the ATS logs.
            </p>
            <p className="mb-6">
              What we found was damning. A legacy rule — <em>"Must have 3 years of React"</em> — had been auto-rejecting Principal Engineers who wrote "10 years of frontend, currently using React" on their resumes. The rule had been unchecked for over a year. We had silently rejected hundreds of qualified candidates. The worst part? There was no way to get them back.
            </p>
            <p className="mb-6">
              No one owned the rule. No one was monitoring its output. No one had ever validated it against what a real qualified candidate's resume actually looked like. It just ran, invisibly, in the background — filtering out exactly the people we were desperate to hire.
            </p>
            <p>
              That experience is why ClearFunnel exists. It shouldn't take a three-month talent drought and a manual log audit to discover a broken rule. There should be a governance layer that catches it automatically, before the damage is done.
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl border-l-4 border-blue-600 bg-blue-50 p-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-blue-900 font-semibold italic text-lg leading-relaxed">
              "We don't just monitor data — we protect opportunities. Every automated system needs observability. Hiring is one of the most consequential acts an organization performs. It should be held to a higher standard."
            </p>
            <p className="text-blue-700 text-sm mt-3 font-medium">— Stanley Njoroge, Founder & CEO</p>
          </motion.div>
        </div>
      </section>

      {/* ─── What We Are / Aren't ─────────────────────── */}
      <section className="py-20 md:py-28 bg-white px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-4xl md:text-5xl font-black tracking-tight"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
            >
              ClearFunnel, defined clearly
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="bg-blue-50 rounded-2xl p-8 border border-blue-100"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3
                className="text-xl font-black mb-5 text-blue-900"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                ClearFunnel IS
              </h3>
              <ul className="space-y-3">
                {whatWeAre.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-blue-800">
                    <span className="text-blue-600 font-bold mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="bg-slate-50 rounded-2xl p-8 border border-slate-200"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3
                className="text-xl font-black mb-5 text-slate-700"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                ClearFunnel is NOT
              </h3>
              <ul className="space-y-3">
                {whatWeAreNot.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="text-slate-400 font-bold mt-0.5">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Brand Values ─────────────────────────────── */}
      <section className="py-20 md:py-28 bg-slate-50 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">What We Stand For</p>
            <h2
              className="text-4xl md:text-5xl font-black tracking-tight"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
            >
              Our values
            </h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-xl mx-auto">
              Our tone is the voice behind our brand. Clear. Confident. Human. Accountable.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                className="bg-white rounded-2xl p-7 border border-border/60 hover:shadow-md transition-shadow"
              >
                <div
                  className="size-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: v.bg, color: v.color }}
                >
                  <v.icon className="size-5" strokeWidth={2} />
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
                >
                  {v.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Founder ──────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">The Team</p>
            <h2
              className="text-4xl font-black tracking-tight"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
            >
              Who's building this
            </h2>
          </motion.div>

          <motion.div
            className="bg-slate-50 rounded-3xl border border-border/60 p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Avatar */}
            <div className="shrink-0">
              <div
                className="size-28 rounded-2xl flex items-center justify-center text-white text-4xl font-black shadow-lg"
                style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", fontFamily: "'Satoshi', sans-serif" }}
              >
                SN
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3
                  className="text-2xl font-black mb-0.5"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
                >
                  Stanley Njoroge
                </h3>
                <p className="text-blue-600 font-semibold text-sm">Founder & CEO · Nairobi, Kenya</p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Stanley has spent his career at the intersection of people operations and technology. After experiencing firsthand how broken ATS filter logic can silently destroy a talent pipeline, he built ClearFunnel to give HR teams the observability and control they deserve — without needing an engineering degree to use it.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                His background spans talent acquisition, product, and systems design — a combination that shapes ClearFunnel's core philosophy: governance that HR teams can actually own, operate, and trust.
              </p>
              <div className="flex items-center gap-4 pt-1">
                <a
                  href="mailto:stanley@clearfunnel.com"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <Mail className="size-3.5" /> stanley@clearfunnel.com
                </a>
                <a
                  href="https://linkedin.com/in/stanleyn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-blue-600 transition-colors"
                  aria-label="Stanley on LinkedIn"
                >
                  <Linkedin className="size-4" />
                </a>
                <a
                  href="https://twitter.com/stanleyn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-blue-600 transition-colors"
                  aria-label="Stanley on X / Twitter"
                >
                  <Twitter className="size-4" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Careers note */}
          <motion.div
            className="mt-8 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            We're a small, focused team and we're building carefully. Interested in joining?{" "}
            <a href="mailto:stanley@clearfunnel.com" className="text-blue-600 font-semibold hover:underline">
              Reach out directly →
            </a>
          </motion.div>
        </div>
      </section>

      {/* ─── Workplace Images ─────────────────────────── */}
      <section className="pb-20 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            <motion.img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80"
              alt="Professional reviewing hiring data with clarity and focus"
              className="rounded-2xl object-cover aspect-square shadow-md col-span-1"
              loading="lazy"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            />
            <motion.img
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&auto=format&fit=crop&q=80"
              alt="Modern, inclusive workplace team working on hiring governance"
              className="rounded-2xl object-cover aspect-square shadow-md col-span-2"
              loading="lazy"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            />
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────── */}
      <section
        className="py-24 md:py-32 px-4 md:px-6 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0B1426 0%, #1E3A8A 60%, #4C1D95 100%)" }}
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
            Join us in making hiring fair for everyone.
          </motion.h2>
          <p className="text-lg text-white/60">
            Connect your ATS, start the free trial, and see what your rules have been doing to your pipeline.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="rounded-full h-13 px-8 font-semibold bg-white text-blue-900 hover:bg-white/90 shadow-xl"
              asChild
            >
              <Link href="/app/dashboard">
                Start Free Trial <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-13 px-8 font-medium border-white/25 text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <a href="mailto:stanley@clearfunnel.com">Talk to Stanley →</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

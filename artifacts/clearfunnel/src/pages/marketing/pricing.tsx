import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const faqs = [
  {
    q: "How does ClearFunnel integrate with my existing ATS?",
    a: "ClearFunnel connects via webhooks. You point your ATS (Greenhouse, Lever, Workday, or any webhook-capable platform) to a ClearFunnel endpoint. We start intercepting and logging decisions immediately — no engineering sprint, no downtime, and no replacement of your existing workflow.",
  },
  {
    q: "What is the Validation Harness?",
    a: "The Validation Harness is a testing environment for your ATS filter rules. Before a rule goes live, you upload or define a benchmark set of 'should-pass' resumes. ClearFunnel tests the rule against them and blocks deployment if any pass candidates get rejected — unless you provide a logged override.",
  },
  {
    q: "What happens to candidates during the 90-day recovery window?",
    a: "Any candidate auto-rejected by your ATS is held in ClearFunnel's Recovery Pool for 90 days (Growth) or 1 year (Enterprise). If you identify a bad rule that caused false rejections, you can manually override the decision and re-queue those candidates for review — with a full log entry including recruiter ID and reason.",
  },
  {
    q: "Can I trial ClearFunnel without a credit card?",
    a: "Yes. The Pilot tier is available at no cost for your first department or use case. You can connect your ATS, validate up to 50 rules, and see 30 days of decision history — all with no credit card required.",
  },
  {
    q: "Is my candidate data secure?",
    a: "ClearFunnel stores the minimum data required to log and audit decisions: candidate identifiers from your ATS, the rule that triggered each decision, and timestamps. We do not store resume content. Data is encrypted at rest and in transit. We comply with GDPR and are SOC 2 Type II certified.",
  },
  {
    q: "Do you support SSO and role-based access control?",
    a: "SSO (SAML 2.0, OIDC) and advanced RBAC are available on the Enterprise plan. The Growth plan includes basic team management — you can invite multiple HR Ops and Recruiter users with differentiated permission levels.",
  },
];

const tiers = [
  {
    name: "Pilot",
    monthlyPrice: null,
    annualPrice: null,
    priceLabel: "Free to start",
    desc: "Perfect for validating the concept with one department — no credit card required.",
    badge: null,
    features: [
      "Up to 50 active ATS rules",
      "30-day decision log history",
      "7-day candidate recovery window",
      "Manual rule validation",
      "Basic anomaly alerts (daily digest)",
      "Community support",
    ],
    button: "Start for Free",
    href: "/app/dashboard",
    primary: false,
  },
  {
    name: "Growth",
    monthlyPrice: 299,
    annualPrice: 239,
    priceLabel: "",
    desc: "For scaling companies that need total visibility and governance over their entire funnel.",
    badge: "Most popular",
    features: [
      "Unlimited ATS rules",
      "1-year decision log history",
      "90-day candidate recovery pool",
      "Automated rule validation",
      "Real-time anomaly detection",
      "Override & recovery workflows",
      "Team seats (up to 10 users)",
      "Priority email support",
    ],
    button: "Start 14-Day Free Trial",
    href: "/app/dashboard",
    primary: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    annualPrice: null,
    priceLabel: "Custom",
    desc: "For large talent organizations requiring custom SLAs, indefinite audit logs, and dedicated support.",
    badge: null,
    features: [
      "Unlimited everything",
      "Indefinite audit log retention",
      "1-year recovery pool",
      "Custom rule scripting",
      "Webhook + API integrations",
      "SSO (SAML 2.0 / OIDC)",
      "Advanced RBAC",
      "Dedicated success manager",
      "Custom SLA guarantees",
    ],
    button: "Contact Sales",
    href: "/about",
    primary: false,
  },
];

const comparison = [
  { feature: "ATS rule registry", p: "50 rules", g: "Unlimited", e: "Unlimited" },
  { feature: "Decision log history", p: "30 days", g: "1 year", e: "Indefinite" },
  { feature: "Candidate recovery window", p: "7 days", g: "90 days", e: "1 year" },
  { feature: "Validation harness", p: "Manual only", g: "Automated", e: "Custom scripting" },
  { feature: "Anomaly alerts", p: "Daily digest", g: "Real-time", e: "Real-time + webhooks" },
  { feature: "Override & recovery", p: "—", g: "✓", e: "✓" },
  { feature: "API access", p: "—", g: "Read-only", e: "Full read/write" },
  { feature: "Team seats", p: "3 users", g: "10 users", e: "Unlimited" },
  { feature: "SSO / SAML", p: "—", g: "—", e: "✓" },
  { feature: "Dedicated CSM", p: "—", g: "—", e: "✓" },
  { feature: "SLA guarantee", p: "—", g: "99.9% uptime", e: "Custom SLA" },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* ─── Hero ─────────────────────────────────────── */}
      <section
        className="py-20 md:py-28 px-4 md:px-6 text-center relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.12) 0%, transparent 65%), #fff",
        }}
      >
        <motion.div
          className="max-w-3xl mx-auto"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">Pricing</p>
          <h1
            className="text-5xl md:text-7xl font-black tracking-tight mb-5 leading-[1.02]"
            style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
          >
            Simple, transparent pricing.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Stop losing talent to bad rules. Pay a fraction of one bad hire's recruiting cost to guarantee every rejection is correct.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => setAnnual(false)}
              className={`text-sm font-semibold transition-colors ${!annual ? "text-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-blue-600" : "bg-slate-200"}`}
              aria-label="Toggle annual billing"
            >
              <span
                className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${annual ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`text-sm font-semibold transition-colors ${annual ? "text-foreground" : "text-muted-foreground"}`}
            >
              Annual
              <span className="ml-1.5 text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 rounded-full px-1.5 py-0.5">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* ─── Pricing Cards ────────────────────────────── */}
      <section className="pb-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 items-stretch">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-2xl flex flex-col relative ${
                tier.primary
                  ? "ring-2 ring-blue-600 shadow-2xl shadow-blue-100"
                  : "border border-border shadow-sm"
              } bg-white`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}
                  >
                    {tier.badge}
                  </span>
                </div>
              )}
              <div className="p-7 flex-1 flex flex-col">
                <h3
                  className="text-xl font-bold mb-1"
                  style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
                >
                  {tier.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 min-h-[40px]">{tier.desc}</p>

                <div className="mb-8">
                  {tier.monthlyPrice !== null ? (
                    <div className="flex items-end gap-1">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={annual ? "annual" : "monthly"}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="text-4xl font-black"
                          style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
                        >
                          ${annual ? tier.annualPrice : tier.monthlyPrice}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-muted-foreground mb-1">/mo</span>
                    </div>
                  ) : (
                    <span
                      className="text-4xl font-black"
                      style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
                    >
                      {tier.priceLabel}
                    </span>
                  )}
                  {annual && tier.monthlyPrice && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                      Billed annually — save ${(tier.monthlyPrice - (tier.annualPrice ?? 0)) * 12}/yr
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-foreground">
                      <Check className="size-4 text-blue-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full rounded-xl h-12 font-semibold ${
                    tier.primary
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  <Link href={tier.href}>
                    {tier.button} <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Feature Comparison Table ─────────────────── */}
      <section className="py-20 md:py-28 bg-slate-50 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-3xl md:text-4xl font-black tracking-tight mb-3"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
            >
              Compare features
            </h2>
            <p className="text-muted-foreground">
              A full breakdown of what's included in every plan.
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-slate-50">
                    <th className="p-4 text-left font-semibold text-foreground w-2/5">Feature</th>
                    <th className="p-4 text-center font-semibold text-foreground">Pilot</th>
                    <th className="p-4 text-center font-bold text-blue-600">Growth</th>
                    <th className="p-4 text-center font-semibold text-foreground">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={`border-b border-border/60 hover:bg-slate-50/80 transition-colors ${
                        i % 2 === 0 ? "" : "bg-slate-50/40"
                      }`}
                    >
                      <td className="p-4 font-medium text-foreground">{row.feature}</td>
                      <td className="p-4 text-center text-muted-foreground">{row.p}</td>
                      <td className="p-4 text-center font-semibold text-foreground">{row.g}</td>
                      <td className="p-4 text-center text-muted-foreground">{row.e}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-4 md:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">FAQ</p>
            <h2
              className="text-3xl md:text-4xl font-black tracking-tight"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
            >
              Common questions answered
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="border border-border rounded-xl overflow-hidden bg-white"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold text-foreground hover:bg-slate-50/60 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="flex items-center gap-2.5 text-sm md:text-base">
                    <HelpCircle className="size-4 text-blue-500 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border/60">
                        <div className="pt-3">{faq.a}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ────────────────────────────────── */}
      <section
        className="py-20 md:py-28 px-4 md:px-6 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #4C1D95 100%)" }}
      >
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <motion.h2
            className="text-4xl md:text-5xl font-black text-white tracking-tight"
            style={{ fontFamily: "'Satoshi', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Still unsure? Talk to us.
          </motion.h2>
          <p className="text-lg text-white/60">
            Every pilot starts with a 30-minute call where we walk through your current ATS setup and show you exactly where ClearFunnel fits.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="rounded-full h-13 px-8 font-semibold bg-white text-blue-900 hover:bg-white/90 shadow-xl"
              asChild
            >
              <Link href="/app/dashboard">Start Free — No Card Needed</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-13 px-8 font-medium border-white/25 text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <a href="mailto:stanley@clearfunnel.com">Book a Demo Call</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

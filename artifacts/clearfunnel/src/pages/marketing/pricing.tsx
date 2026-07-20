import { motion } from "framer-motion";
import { Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Pricing() {
  const tiers = [
    {
      name: "Pilot",
      price: "Custom",
      desc: "Perfect for testing the waters with a single department or division.",
      features: [
        "Up to 50 active ATS rules",
        "30-day decision log history",
        "Basic validation harness",
        "Email support",
      ],
      button: "Contact Sales",
      href: "/about",
      primary: false
    },
    {
      name: "Growth",
      price: "$299",
      period: "/mo",
      desc: "For scaling companies that need total visibility over their hiring funnel.",
      features: [
        "Unlimited ATS rules",
        "90-day recovery pool window",
        "Advanced anomaly detection",
        "Automated rule validation",
        "Priority support",
      ],
      button: "Start Free Trial",
      href: "/app/dashboard",
      primary: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For massive talent organizations requiring custom SLAs and SLA governance.",
      features: [
        "Unlimited everything",
        "Indefinite audit logs",
        "Custom rule scripting",
        "Dedicated success manager",
        "SSO & advanced RBAC",
      ],
      button: "Contact Sales",
      href: "/about",
      primary: false
    }
  ];

  return (
    <div className="w-full pb-32">
      {/* Header */}
      <section className="pt-20 pb-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6">Simple, transparent pricing.</h1>
          <p className="text-xl text-muted-foreground">
            Stop losing talent to bad rules. Pay a fraction of the recruiting cost to guarantee every rejection is correct.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 mb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-center">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-3xl p-8 border ${
                tier.primary 
                  ? "bg-foreground text-background border-foreground shadow-2xl scale-100 md:scale-105 z-10" 
                  : "bg-white border-border shadow-sm"
              }`}
            >
              <h3 className={`font-heading text-xl font-bold mb-2 ${tier.primary ? "text-white" : ""}`}>{tier.name}</h3>
              <p className={`text-sm mb-6 min-h-[40px] ${tier.primary ? "text-white/70" : "text-muted-foreground"}`}>{tier.desc}</p>
              <div className="mb-8">
                <span className={`text-4xl font-bold tracking-tight ${tier.primary ? "text-white" : ""}`}>{tier.price}</span>
                {tier.period && <span className={tier.primary ? "text-white/70" : "text-muted-foreground"}>{tier.period}</span>}
              </div>
              
              <ul className="space-y-4 mb-8">
                {tier.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check className={`size-5 shrink-0 ${tier.primary ? "text-primary" : "text-primary"}`} />
                    <span className={`text-sm ${tier.primary ? "text-white/90" : "text-foreground"}`}>{feat}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                asChild 
                className="w-full rounded-full h-12"
                variant={tier.primary ? "default" : "outline"}
              >
                <Link href={tier.href}>{tier.button}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold mb-4">Compare Features</h2>
            <p className="text-muted-foreground">Detailed breakdown of what's included in every plan.</p>
          </div>
          
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-background/50">
                    <th className="p-4 font-heading font-semibold w-1/3">Core Features</th>
                    <th className="p-4 font-heading font-semibold text-center w-2/9">Pilot</th>
                    <th className="p-4 font-heading font-semibold text-center w-2/9 text-primary">Growth</th>
                    <th className="p-4 font-heading font-semibold text-center w-2/9">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {[
                    { name: "Rule Registry", p: "50 Rules", g: "Unlimited", e: "Unlimited" },
                    { name: "Decision Log History", p: "30 Days", g: "1 Year", e: "Indefinite" },
                    { name: "Recovery Pool", p: "7 Days", g: "90 Days", e: "1 Year" },
                    { name: "Validation Harness", p: "Manual", g: "Automated", e: "Custom Scripting" },
                    { name: "Anomaly Alerts", p: "Daily digest", g: "Real-time", e: "Real-time + Webhooks" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-background/50 transition-colors">
                      <td className="p-4 font-medium text-foreground">{row.name}</td>
                      <td className="p-4 text-center text-muted-foreground">{row.p}</td>
                      <td className="p-4 text-center font-medium text-foreground">{row.g}</td>
                      <td className="p-4 text-center text-muted-foreground">{row.e}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

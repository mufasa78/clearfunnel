import { motion } from "framer-motion";
import { Link } from "wouter";
import { Plug, GitCompare, Database, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  const steps = [
    {
      icon: Plug,
      title: "1. Connect your ATS via Webhook",
      desc: "ClearFunnel integrates silently. Point your ATS webhooks to us, and we start mapping the decision logic immediately without disrupting your active funnels."
    },
    {
      icon: GitCompare,
      title: "2. Define and Validate Rules",
      desc: "Treat hiring logic like code. Write rejection criteria in ClearFunnel, then test them against a benchmark set of resumes to ensure they don't block qualified talent."
    },
    {
      icon: Database,
      title: "3. Immutable Decision Logging",
      desc: "Every time your ATS automatically rejects a candidate, we log it. We record the candidate, the rule version that triggered, and the exact timestamp. No more black boxes."
    },
    {
      icon: AlertCircle,
      title: "4. Surface Anomalies Automatically",
      desc: "If a rule suddenly starts rejecting 80% of applicants instead of the usual 15%, ClearFunnel throws a critical alert on your dashboard so you can fix it before the pipeline empties."
    },
    {
      icon: RefreshCw,
      title: "5. Recover Wrong Decisions",
      desc: "When a bad rule fires, you don't lose the candidates. Access the Recovery Pool to override the ATS rejection and manually pull candidates back into the interview process."
    }
  ];

  return (
    <div className="w-full pb-32">
      {/* Header */}
      <section className="pt-20 pb-24 px-6 text-center bg-white border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">How ClearFunnel Works</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            The invisible safety net that catches great candidates before they fall through the cracks of your ATS rules.
          </p>
        </motion.div>
      </section>

      {/* Steps Timeline */}
      <section className="py-24 px-6 max-w-4xl mx-auto relative">
        {/* Vertical Line */}
        <div className="absolute left-[39px] md:left-1/2 top-24 bottom-24 w-0.5 bg-border/80 -translate-x-1/2" />

        <div className="space-y-24">
          {steps.map((step, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col md:flex-row items-start gap-8 md:gap-16 relative z-10 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Text Content */}
                <div className={`flex-1 md:w-1/2 ${isEven ? "md:text-right" : "md:text-left"} pl-20 md:pl-0 pt-2 md:pt-0`}>
                  <h3 className="font-heading text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{step.desc}</p>
                </div>

                {/* Center Icon */}
                <div className="absolute md:relative left-0 md:left-auto top-0 md:top-auto size-20 rounded-full bg-white border-4 border-background shadow-xl flex items-center justify-center shrink-0 z-20">
                  <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <step.icon className="size-6" />
                  </div>
                </div>

                {/* Empty Space for Grid Alignment */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-foreground text-center px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-4xl font-bold text-white mb-6">Ready to secure your hiring funnel?</h2>
          <p className="text-white/70 text-lg mb-8">
            Setup takes less than 15 minutes. Connect your ATS and start logging decisions today.
          </p>
          <Button size="lg" className="rounded-full px-8 h-14 text-base" asChild>
            <Link href="/app/dashboard">Enter Dashboard</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Database, GitBranch, LayoutDashboard, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        {/* Background Noise & Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
        
        <div className="mx-auto max-w-5xl flex flex-col items-center text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="rounded-full px-4 py-1.5 border-primary/30 text-primary bg-primary/5 text-sm font-medium mb-4">
              The ATS Governance Layer
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-foreground max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Don't let rogue rules <br className="hidden md:block" />
            <span className="text-muted-foreground relative">
              silently reject
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 Q50,0 100,5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span> talent.
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Hiring managers trust ATS auto-rejection rules they never validated. ClearFunnel sits between HR and the ATS, making every automated decision visible, testable, and recoverable.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-lg shadow-primary/25" asChild>
              <Link href="/app/dashboard">Start 14-Day Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base bg-white" asChild>
              <Link href="/how-it-works">See how it works</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-24 bg-white relative">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-4xl md:text-5xl font-bold leading-tight">
                No one owns the rules. <br/>
                <span className="text-destructive/80">No one monitors for drift.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                When you set up an ATS rule to filter out candidates without a degree, it might also drop someone with 15 years of senior experience. 
                These silent rejections happen thousands of times a month. You don't know they're happening, and when you find out, you can't recover the lost pipeline.
              </p>
              <ul className="space-y-4 pt-2">
                {[
                  "Untested criteria filtering out top talent",
                  "No audit trail for why specific decisions were made",
                  "Zero visibility into funnel anomalies until it's too late"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground font-medium">
                    <div className="mt-1 rounded-full bg-destructive/10 p-1">
                      <div className="size-1.5 rounded-full bg-destructive" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-background border border-border p-8 rounded-3xl shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-destructive/5 rounded-full blur-3xl" />
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground">ATS Audit Log</div>
                <Badge variant="outline" className="bg-white">Alert</Badge>
              </div>
              <div className="space-y-4 relative z-10">
                {[
                  { name: "Sarah Jenkins", role: "Senior Engineer", reason: "Missing degree requirement" },
                  { name: "Marcus Chen", role: "Product Manager", reason: "Years of exp < 5" },
                  { name: "Elena Rodriguez", role: "Designer", reason: "Keyword missing: Figma" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white rounded-xl border border-border/60 shadow-sm">
                    <div>
                      <div className="font-semibold text-foreground">{item.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-destructive font-medium uppercase">Rejected</div>
                      <div className="text-[10px] text-muted-foreground mt-1 max-w-[120px] truncate">{item.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-foreground text-background">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">Regain control of the funnel.</h2>
            <p className="text-white/70 text-lg">ClearFunnel maps your ATS rules into a testable, auditable registry. Treat hiring logic like production code.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Validation Harness",
                desc: "Test new ATS rules against a standardized benchmark of resumes before deploying them to production."
              },
              {
                icon: Database,
                title: "Immutable Decision Log",
                desc: "Every automated rejection is logged with the exact rule version that triggered it. Nothing is silent."
              },
              {
                icon: Fingerprint,
                title: "Recovery Pool",
                desc: "Maintain a 90-day retention window of rejected candidates. Override bad ATS decisions instantly."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors"
              >
                <div className="size-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <feature.icon className="size-6" />
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Terminal Teaser */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="bg-[#0a0f18] rounded-2xl overflow-hidden border border-[#1f2937] shadow-2xl shadow-black/20"
            >
              <div className="h-10 bg-[#111827] border-b border-[#1f2937] flex items-center px-4 gap-2">
                <div className="size-3 rounded-full bg-[#ef4444]" />
                <div className="size-3 rounded-full bg-[#eab308]" />
                <div className="size-3 rounded-full bg-[#22c55e]" />
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed">
                <div className="text-[#9ca3af] mb-4"># Terminal View: Dashboard Live Feed</div>
                <div className="text-[#34d399] flex gap-2"><span>$</span> clearfunnel observe --live</div>
                <div className="text-[#9ca3af] mt-2">[10:42:01] System healthy. Listening for webhooks...</div>
                <div className="text-[#eab308] mt-2">[10:42:05] WARNING: Anomaly detected.</div>
                <div className="text-[#9ca3af] mt-1 pl-4">Rule "SENIOR_DEV_REQ" rejection rate spiked 42%.</div>
                <div className="text-[#3b82f6] mt-4 flex gap-2"><span>$</span> clearfunnel recover --pool=90d</div>
                <div className="text-[#9ca3af] mt-2">Loading recovery pool... 12 candidates found.</div>
                <div className="text-[#9ca3af] mt-1">Ready for manual override.</div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-heading text-4xl font-bold mb-6">Designed like a cockpit, not a brochure.</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                The core app uses a high-contrast terminal aesthetic built for speed and density. You aren't here to browse; you're here to command the infrastructure.
              </p>
              <Button size="lg" className="rounded-full group" asChild>
                <Link href="/app/dashboard">
                  Enter the Dashboard 
                  <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

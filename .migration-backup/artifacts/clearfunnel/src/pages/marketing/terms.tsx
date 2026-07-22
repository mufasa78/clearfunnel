import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, FileText, Scale, AlertTriangle, CreditCard, Ban, Mail } from "lucide-react";

function Section({ title, icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          {React.createElement(icon, { className: "size-4" })}
        </div>
        <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Satoshi', sans-serif" }}>
          {title}
        </h2>
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function Terms() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-16 md:py-20 px-4 md:px-6 text-center border-b border-border bg-white">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="size-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-5">
            <Scale className="size-7" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Legal</p>
          <h1
            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
            style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
          >
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            These terms govern your use of ClearFunnel. We've written them to be readable. If something is unclear, please ask us before agreeing.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Last updated: <strong>July 1, 2026</strong> · Effective immediately
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-14 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/about" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 transition-colors mb-10 group">
              <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to About
            </Link>

            <Section title="Acceptance of Terms" icon={FileText}>
              <p>By accessing or using ClearFunnel (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you are using the Service on behalf of a company or organization, you represent that you have the authority to bind that entity to these Terms.</p>
              <p>These Terms constitute a binding agreement between you (or your organization) and ClearFunnel Inc. ("ClearFunnel", "we", "us"). If you do not agree, please do not use the Service.</p>
            </Section>

            <Section title="The Service" icon={FileText}>
              <p>ClearFunnel provides a hiring governance platform that connects to Applicant Tracking Systems (ATS) via webhooks, logs automated rejection decisions, validates filter rules, detects anomalies, and enables manual recovery of wrongly-rejected candidates.</p>
              <p>We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice (minimum 30 days for paid subscribers, except in cases of legal or security necessity). We will provide at least 30 days' notice of any material changes to the Service that adversely affect paid subscribers.</p>
            </Section>

            <Section title="Your Account" icon={FileText}>
              <p>You are responsible for maintaining the security of your account credentials. You must not share your account with others. You are responsible for all activity that occurs under your account.</p>
              <p>You must notify us immediately at <a href="mailto:security@clearfunnel.com" className="text-blue-600 hover:underline">security@clearfunnel.com</a> if you suspect unauthorized access to your account.</p>
              <p>You must be at least 18 years old to use the Service. The Service is intended for use by HR professionals and organizations, not individual consumers.</p>
            </Section>

            <Section title="Acceptable Use" icon={Ban}>
              <p>You agree not to: (1) use the Service for any unlawful purpose or in violation of any applicable employment laws; (2) use the Service to discriminate against candidates on the basis of protected characteristics; (3) attempt to reverse engineer, decompile, or create derivative works of the Service; (4) resell, sublicense, or otherwise commercialize access to the Service; (5) overload our infrastructure or conduct denial-of-service attacks; (6) use the Service to process data for any purpose other than your own hiring operations.</p>
              <p>ClearFunnel is designed to <em>improve</em> the fairness and accountability of automated hiring decisions. You agree not to use it as a tool to automate decisions in ways that violate fair employment laws in your jurisdiction.</p>
            </Section>

            <Section title="Payment & Subscriptions" icon={CreditCard}>
              <p>Paid subscriptions are billed monthly or annually as selected at signup. All prices are in USD unless otherwise stated. Prices are exclusive of any applicable taxes, which will be added at checkout.</p>
              <p>Annual subscriptions are non-refundable after the first 14 days. Monthly subscriptions can be cancelled at any time; cancellation takes effect at the end of the current billing period. The Pilot tier is free with no credit card required.</p>
              <p>We reserve the right to change pricing with 60 days' advance notice to existing subscribers. If you do not accept the new pricing, you may cancel your subscription before the change takes effect.</p>
            </Section>

            <Section title="Data & Intellectual Property" icon={FileText}>
              <p>You retain ownership of all data you bring to the Service, including your ATS configuration, rule definitions, and decision logs. We claim no ownership over your data.</p>
              <p>You grant us a limited, non-exclusive license to process and store your data solely for the purpose of providing the Service to you.</p>
              <p>ClearFunnel and its associated marks, logos, and software are the intellectual property of ClearFunnel Inc. We grant you a limited, non-transferable license to use the Service during your subscription term.</p>
            </Section>

            <Section title="Warranties & Limitation of Liability" icon={AlertTriangle}>
              <p>The Service is provided "as is" without warranty of any kind. We do not warrant that the Service will be error-free, uninterrupted, or that any specific result will be achieved. However, we do commit to our stated SLA uptime targets for paid subscribers.</p>
              <p>To the maximum extent permitted by law, ClearFunnel's total liability for any claims arising from your use of the Service shall not exceed the greater of (a) the fees paid by you in the 12 months preceding the claim or (b) $500 USD.</p>
              <p>We are not liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, even if advised of the possibility of such damages.</p>
            </Section>

            <Section title="Governing Law" icon={Scale}>
              <p>These Terms are governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law principles. Any disputes shall be resolved by the courts of Nairobi, Kenya, or by binding arbitration if both parties agree.</p>
              <p>For users in the European Economic Area, nothing in these Terms limits any statutory rights you may have under applicable consumer or data protection law.</p>
            </Section>

            <Section title="Contact" icon={Mail}>
              <p>Legal notices: <a href="mailto:legal@clearfunnel.com" className="text-blue-600 hover:underline">legal@clearfunnel.com</a></p>
              <p>General enquiries: <a href="mailto:stanley@clearfunnel.com" className="text-blue-600 hover:underline">stanley@clearfunnel.com</a></p>
              <p className="text-xs pt-4 border-t border-border">
                We reserve the right to update these Terms. We will provide 30 days' notice of material changes to paid subscribers. Your continued use of the Service after the effective date constitutes acceptance.
              </p>
            </Section>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

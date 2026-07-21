import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Shield, Eye, Lock, Users, FileText, Mail } from "lucide-react";

const section = (title: string, icon: React.ElementType, children: React.ReactNode) => (
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

import React from "react";

export default function Privacy() {
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
            <Shield className="size-7" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Legal</p>
          <h1
            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
            style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
          >
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We believe privacy is a right, not a checkbox. This policy tells you exactly what data we collect, why we collect it, and how you can control it.
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
            {/* Navigation back */}
            <Link href="/about" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 transition-colors mb-10 group">
              <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to About
            </Link>

            {section("Who We Are", Users, (
              <>
                <p>ClearFunnel Inc. ("ClearFunnel", "we", "our", or "us") is incorporated in Kenya with operations globally. We provide a hiring governance platform for HR Operations teams. Our registered address is Nairobi, Kenya. You can contact our Privacy Officer at <a href="mailto:privacy@clearfunnel.com" className="text-blue-600 hover:underline">privacy@clearfunnel.com</a>.</p>
                <p>This Privacy Policy applies to all users of our website (clearfunnel.com) and our web application (/app). By using our services, you agree to the practices described in this document.</p>
              </>
            ))}

            {section("What Data We Collect", Eye, (
              <>
                <p><strong className="text-foreground">Account data:</strong> When you sign up, we collect your name, email address, company name, and a hashed password. We do not store plaintext passwords.</p>
                <p><strong className="text-foreground">ATS integration data:</strong> When you connect your ATS, we receive webhook payloads containing: candidate identifiers (ATS-assigned IDs, not personal resumes), role identifiers, the filtering rule that triggered a decision, and the decision timestamp. We deliberately do not store resume content, CV text, or personal candidate information beyond what is strictly necessary to log the decision.</p>
                <p><strong className="text-foreground">Usage data:</strong> We collect standard server logs (IP address, browser type, pages visited, timestamps) to maintain security and improve the product. We use Plausible Analytics — a privacy-respecting analytics tool that does not use cookies and does not track individuals.</p>
                <p><strong className="text-foreground">Payment data:</strong> Payment processing is handled by Stripe. We never see or store full card numbers. Stripe's privacy policy applies to payment processing.</p>
              </>
            ))}

            {section("How We Use Your Data", FileText, (
              <>
                <p>We use collected data to: (1) provide the ClearFunnel service, including storing and displaying your ATS decision logs; (2) send transactional emails (account setup, anomaly alerts, billing receipts); (3) improve the product based on aggregated, anonymized usage patterns; (4) comply with legal obligations.</p>
                <p>We do <strong className="text-foreground">not</strong> sell your data to third parties. We do not use your hiring data to train AI or machine learning models. We do not share candidate data with any other employer or entity.</p>
                <p>We process data under the legal basis of contract performance (providing the service you signed up for) and legitimate interests (security, fraud prevention, product improvement).</p>
              </>
            ))}

            {section("Data Storage & Security", Lock, (
              <>
                <p>All data is stored on servers located in EU data centers (Frankfurt, Germany) operated by our cloud provider. Data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are SOC 2 Type II certified.</p>
                <p>Access to production data is restricted to a small number of authorized engineers and is logged and audited. We conduct quarterly security reviews and annual third-party penetration tests.</p>
                <p>In the event of a data breach affecting your personal data, we will notify you within 72 hours of becoming aware of the breach, as required by GDPR.</p>
              </>
            ))}

            {section("Your Rights", Shield, (
              <>
                <p>You have the right to: access all personal data we hold about you; request correction of inaccurate data; request deletion of your account and all associated data; export your data in a machine-readable format; object to processing of your data; withdraw consent at any time where consent is the legal basis.</p>
                <p>To exercise any of these rights, email <a href="mailto:privacy@clearfunnel.com" className="text-blue-600 hover:underline">privacy@clearfunnel.com</a>. We will respond within 30 days. We will never charge you for exercising these rights.</p>
                <p>If you are in the EEA or UK, you have the right to lodge a complaint with your local supervisory authority. We are registered with the Office of the Data Protection Commissioner in Kenya.</p>
              </>
            ))}

            {section("Cookies", Eye, (
              <>
                <p>Our marketing website (clearfunnel.com) uses no tracking cookies. We use Plausible Analytics, which is cookieless. The web application (/app) uses a single session cookie, strictly necessary for authentication — it expires when you close your browser or log out.</p>
                <p>We do not use advertising cookies, retargeting pixels, or third-party tracking scripts.</p>
              </>
            ))}

            {section("Contact", Mail, (
              <>
                <p>Privacy Officer: <a href="mailto:privacy@clearfunnel.com" className="text-blue-600 hover:underline">privacy@clearfunnel.com</a></p>
                <p>General enquiries: <a href="mailto:stanley@clearfunnel.com" className="text-blue-600 hover:underline">stanley@clearfunnel.com</a></p>
                <p>Mailing address: ClearFunnel Inc., Nairobi, Kenya</p>
                <p className="text-xs pt-4 border-t border-border">
                  We may update this Privacy Policy from time to time. We will notify registered users of material changes by email at least 30 days in advance. Continued use of the service after the effective date constitutes acceptance of the revised policy.
                </p>
              </>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

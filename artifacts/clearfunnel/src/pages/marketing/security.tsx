import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Shield, Lock, Server, Eye, Wifi, AlertTriangle, CheckCircle2, Mail } from "lucide-react";

const certifications = [
  { name: "SOC 2 Type II", desc: "Annual third-party audit of security controls" },
  { name: "GDPR Compliant", desc: "EU & EEA data processing compliance" },
  { name: "TLS 1.3", desc: "All data in transit is encrypted end-to-end" },
  { name: "AES-256", desc: "All data at rest is encrypted at rest" },
  { name: "OWASP Top 10", desc: "Tested against all major web vulnerabilities" },
  { name: "Penetration Tested", desc: "Annual third-party penetration testing" },
];

function SecuritySection({ icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row gap-5 py-8 border-b border-border last:border-0">
      <div className="shrink-0">
        <div className="size-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          {React.createElement(icon, { className: "size-5" })}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2 text-foreground" style={{ fontFamily: "'Satoshi', sans-serif" }}>
          {title}
        </h3>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
      </div>
    </div>
  );
}

export default function Security() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section
        className="py-16 md:py-24 px-4 md:px-6 text-center relative overflow-hidden border-b border-border"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.08) 0%, transparent 65%), #fff",
        }}
      >
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="size-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-5">
            <Lock className="size-7" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Security</p>
          <h1
            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
            style={{ fontFamily: "'Satoshi', sans-serif", color: "#0F1B3D" }}
          >
            Security at ClearFunnel
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We govern hiring decisions for sensitive talent pipelines. Security isn't an afterthought — it's the foundation of everything we build.
          </p>
        </motion.div>
      </section>

      {/* Certifications */}
      <section className="py-14 bg-slate-50 border-b border-border px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-6 text-center">Certifications & Standards</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {certifications.map((cert) => (
              <motion.div
                key={cert.name}
                className="bg-white rounded-xl border border-border p-5 text-center"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <CheckCircle2 className="size-5 text-blue-600 mx-auto mb-2" />
                <div className="font-bold text-sm text-foreground mb-1" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                  {cert.name}
                </div>
                <div className="text-[11px] text-muted-foreground leading-snug">{cert.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
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

            <SecuritySection icon={Server} title="Infrastructure Security">
              <p>ClearFunnel runs on cloud infrastructure in EU-based data centers (Frankfurt, Germany). All production systems are isolated within private networks. No production server is accessible from the public internet directly — all traffic is routed through our load balancer and WAF (Web Application Firewall).</p>
              <p>We use infrastructure-as-code for all environment provisioning, ensuring every server is created from a known, audited baseline. Ad-hoc manual changes to production infrastructure are prohibited.</p>
              <p>Database servers run on dedicated instances with automated daily backups encrypted at rest. Backups are tested monthly to verify restoration integrity.</p>
            </SecuritySection>

            <SecuritySection icon={Lock} title="Data Encryption">
              <p>All data in transit is encrypted using TLS 1.3. We enforce HTTPS everywhere and include HSTS headers with a 1-year max-age. We score A+ on the Mozilla Observatory.</p>
              <p>All data at rest is encrypted using AES-256. This includes your ATS decision logs, rule configurations, account data, and all database backups. Encryption keys are managed by our cloud provider's Key Management Service (KMS) with automatic rotation.</p>
            </SecuritySection>

            <SecuritySection icon={Eye} title="Access Controls">
              <p>Access to production data is restricted to a small number of explicitly authorized engineers (currently 2 people). Every access event is logged with user, timestamp, and action. Logs are immutable and stored in a separate account that production systems cannot modify.</p>
              <p>We enforce multi-factor authentication (MFA) for all internal systems. Engineers access production via temporary, time-limited credentials — no long-lived static credentials are used anywhere.</p>
              <p>All code changes require peer review before deployment. Deployments are gated on automated security scans (SAST/SCA) as part of CI/CD.</p>
            </SecuritySection>

            <SecuritySection icon={Wifi} title="Webhook & Integration Security">
              <p>ATS webhooks are verified using HMAC-SHA256 signatures. We reject any payload that does not match the expected signature. Webhook endpoints are rate-limited and monitored for anomalies.</p>
              <p>We store only the minimum data required to log a hiring decision: ATS-assigned candidate identifiers, role identifiers, the rule that fired, and the timestamp. We do not store resume content, CV text, email addresses, or phone numbers from ATS payloads.</p>
            </SecuritySection>

            <SecuritySection icon={Shield} title="Vulnerability Management">
              <p>We conduct annual third-party penetration testing against our production environment. Results are triaged and critical/high findings are remediated within 48 hours of report receipt.</p>
              <p>We run automated dependency vulnerability scanning (SCA) on every pull request and are subscribed to CVE advisories for all major dependencies. We target patching within 7 days for critical vulnerabilities.</p>
              <p>We participate in responsible disclosure. If you discover a security issue, please email <a href="mailto:security@clearfunnel.com" className="text-blue-600 hover:underline">security@clearfunnel.com</a>. We will acknowledge within 24 hours and keep you informed throughout the remediation process. We do not take legal action against good-faith security researchers.</p>
            </SecuritySection>

            <SecuritySection icon={AlertTriangle} title="Incident Response">
              <p>We maintain a documented incident response plan, tested annually via tabletop exercises. In the event of a data breach affecting personal data, we will: (1) contain the incident within 24 hours; (2) notify affected customers within 48 hours; (3) notify relevant supervisory authorities within 72 hours as required by GDPR.</p>
              <p>Post-incident, we publish a post-mortem to affected customers and implement structural controls to prevent recurrence.</p>
            </SecuritySection>

            {/* Contact */}
            <div className="mt-10 p-6 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="size-4 text-blue-600" />
                <h3 className="font-bold text-foreground text-base" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                  Security contact
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                To report a vulnerability or ask a security question:
              </p>
              <a
                href="mailto:security@clearfunnel.com"
                className="text-blue-600 font-semibold text-sm hover:underline"
              >
                security@clearfunnel.com
              </a>
              <p className="text-xs text-muted-foreground mt-2">We respond to all security emails within 24 hours.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

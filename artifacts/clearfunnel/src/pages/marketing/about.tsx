import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="w-full pb-32">
      {/* Header */}
      <section className="pt-20 pb-16 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">We believe hiring rules need adult supervision.</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Applicant Tracking Systems made it easy to reject candidates at scale. They forgot to make it safe.
          </p>
        </motion.div>
      </section>

      {/* Story */}
      <section className="px-6 py-12 max-w-3xl mx-auto space-y-12 text-lg text-foreground/80 leading-relaxed">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl font-bold text-foreground mb-6">The Silent Pipeline Leak</h2>
          <p className="mb-6">
            Two years ago, we were scaling an engineering team at a high-growth startup. We struggled to find good senior talent. The pipeline felt dry. After three months, we manually reviewed the ATS logs and found out a legacy "Must have 3 years of React" rule was auto-rejecting Principal Engineers who wrote "10 years of frontend, currently using React" on their resumes.
          </p>
          <p>
            The rule had been unchecked for a year. We had silently rejected hundreds of qualified candidates. The worst part? There was no way to get them back.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 bg-white border border-border rounded-3xl shadow-sm"
        >
          <h2 className="font-heading text-3xl font-bold text-foreground mb-6">What ClearFunnel Is</h2>
          <p className="mb-4">ClearFunnel is a governance layer. It treats hiring rules with the same rigor software engineers treat production code.</p>
          <ul className="space-y-4 list-disc pl-6 marker:text-primary">
            <li>It <strong>is</strong> an audit trail for every automated decision.</li>
            <li>It <strong>is</strong> a testing environment for new filtering rules.</li>
            <li>It <strong>is</strong> a safety net for overriding bad ATS decisions.</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl font-bold text-foreground mb-6">What ClearFunnel Isn't</h2>
          <p className="mb-4">We are not an ATS. We are not an AI screening tool. We don't read resumes and make decisions for you.</p>
          <p>
            There are enough AI tools trying to automate hiring. We are the tool that ensures your existing automation is actually doing what you told it to do.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-border pt-12"
        >
          <h2 className="font-heading text-3xl font-bold text-foreground mb-6">The Vision</h2>
          <p>
            Every automated system needs observability. In a decade, running untested auto-rejection rules on human beings will be viewed as recruiting malpractice. We are building the infrastructure to make sure every candidate is judged fairly, and every system is held accountable.
          </p>
        </motion.div>
      </section>
    </div>
  );
}

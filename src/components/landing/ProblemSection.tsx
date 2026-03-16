import { motion } from "framer-motion";
import { ShoppingCart, BarChart3, Mail, MessageCircle, ArrowRight } from "lucide-react";

const signals = [
  "Products customers view",
  "Carts customers abandon",
  "Repeat purchase patterns",
  "Engagement with emails and campaigns",
];

const tools = [
  { icon: ShoppingCart, name: "Your Website", desc: "Tracks purchases" },
  { icon: BarChart3, name: "GA4", desc: "Tracks behavior" },
  { icon: Mail, name: "Email tools", desc: "Tracks engagement" },
  { icon: MessageCircle, name: "WhatsApp", desc: "Tracks messaging" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const ProblemSection = () => (
  <section id="problem" className="relative py-24 md:py-32 bg-surface section-glow">
    <div className="absolute inset-0 dot-pattern pointer-events-none" />
    <div className="relative container mx-auto px-6 max-w-5xl">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16"
      >
        <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-5xl font-bold text-foreground leading-tight">
          Your Business Already Has the Data.
          <br />
          <span className="text-muted-foreground">Most Tools Just Don't Use It Well.</span>
        </motion.h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid md:grid-cols-2 gap-12 items-start"
      >
        <div>
          <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground mb-6">
            Every day your store collects valuable signals:
          </motion.p>
          <ul className="space-y-3">
            {signals.map((s, i) => (
              <motion.li key={s} variants={fadeUp} custom={i + 2} className="flex items-center gap-3 text-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                {s}
              </motion.li>
            ))}
          </ul>
          <motion.p variants={fadeUp} custom={7} className="mt-8 text-muted-foreground">
            But this data lives across multiple tools. No single platform tells you which customers to contact, when they're most likely to respond, what message will resonate, or which channel performs best.
          </motion.p>
        </div>

        <motion.div variants={fadeUp} custom={3} className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="space-y-4">
            {tools.map((t, i) => (
              <div key={t.name} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <t.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
                {i < tools.length - 1 && <ArrowRight className="ml-auto w-4 h-4 text-border" />}
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">→ scattered insights</p>
            <p className="text-sm text-muted-foreground">→ manual campaign decisions</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <p className="font-display text-xl md:text-2xl font-semibold text-foreground">
          The opportunity is not more data.
          <br />
          <span className="text-gradient">It's turning existing data into smarter decisions.</span>
        </p>
      </motion.div>
    </div>
  </section>
);

export default ProblemSection;

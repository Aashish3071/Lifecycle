import { motion } from "framer-motion";
import { X, ListChecks, BarChart3, Workflow } from "lucide-react";

const noLongerNeeded = [
  { label: "Manually build segments", desc: "No more guessing who to target—automation handles it.", icon: ListChecks },
  { label: "Analyze multiple dashboards", desc: "One unified view replaces scattered reports.", icon: BarChart3 },
  { label: "Design complicated workflows", desc: "Pre-built lifecycle flows launch in minutes.", icon: Workflow },
];

const SimplicitySection = () => (
  <section className="py-24 md:py-32 bg-hero">
    <div className="container mx-auto px-6 max-w-4xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display text-3xl md:text-5xl font-bold text-hero-foreground">
          Marketing That <span className="text-gradient">Runs Itself</span>
        </h2>
        <p className="mt-4 text-hero-muted max-w-lg mx-auto">
          Businesses no longer need to manually manage complex marketing setups.
        </p>
      </motion.div>

      <div className="mt-12 grid sm:grid-cols-3 gap-5">
        {noLongerNeeded.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group relative bg-hero-foreground/[0.04] border border-hero-foreground/10 rounded-xl p-6 text-left hover:bg-hero-foreground/[0.08] hover:border-accent/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_hsl(var(--accent)/0.25)] transition-all duration-300 cursor-default"
          >
            <div className="w-10 h-10 rounded-lg bg-hero-foreground/[0.06] flex items-center justify-center mb-4 group-hover:bg-accent/15 transition-colors">
              <item.icon className="w-5 h-5 text-hero-muted/60 group-hover:text-accent transition-colors" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <X className="w-3.5 h-3.5 text-destructive/70" />
              <span className="font-display font-semibold text-hero-foreground text-sm line-through decoration-hero-muted/30">{item.label}</span>
            </div>
            <p className="text-xs text-hero-muted leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-hero-muted text-sm max-w-md mx-auto"
      >
        The platform continuously identifies opportunities and executes lifecycle marketing automatically.
      </motion.p>
    </div>
  </section>
);

export default SimplicitySection;

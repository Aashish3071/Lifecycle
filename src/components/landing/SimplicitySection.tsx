import { motion } from "framer-motion";
import { X, ListChecks, BarChart3, Workflow } from "lucide-react";

const noLongerNeeded = [
  {
    label: "Manually build segments",
    desc: "No more guessing who to target—automation handles it.",
    icon: ListChecks,
    gradient: "from-rose-500/20 to-orange-500/20",
    iconColor: "text-rose-400",
    borderAccent: "hover:border-rose-400/30",
    shadowAccent: "hover:shadow-[0_8px_30px_-12px_rgba(244,63,94,0.3)]",
  },
  {
    label: "Analyze multiple dashboards",
    desc: "One unified view replaces scattered reports.",
    icon: BarChart3,
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
    borderAccent: "hover:border-blue-400/30",
    shadowAccent: "hover:shadow-[0_8px_30px_-12px_rgba(59,130,246,0.3)]",
  },
  {
    label: "Design complicated workflows",
    desc: "Pre-built lifecycle flows launch in minutes.",
    icon: Workflow,
    gradient: "from-violet-500/20 to-fuchsia-500/20",
    iconColor: "text-violet-400",
    borderAccent: "hover:border-violet-400/30",
    shadowAccent: "hover:shadow-[0_8px_30px_-12px_rgba(139,92,246,0.3)]",
  },
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

      <div className="mt-12 grid sm:grid-cols-3 gap-6">
        {noLongerNeeded.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`group relative overflow-hidden bg-hero-foreground/[0.03] border border-hero-foreground/10 rounded-2xl p-6 text-left hover:-translate-y-1 ${item.borderAccent} ${item.shadowAccent} transition-all duration-300 cursor-default`}
          >
            {/* Subtle gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 border border-hero-foreground/5`}>
                <item.icon className={`w-5.5 h-5.5 ${item.iconColor}`} />
              </div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-5 h-5 rounded-full bg-destructive/15 flex items-center justify-center flex-shrink-0">
                  <X className="w-3 h-3 text-destructive" />
                </div>
                <span className="font-display font-semibold text-hero-foreground text-sm line-through decoration-hero-muted/40 decoration-2">{item.label}</span>
              </div>
              <p className="text-xs text-hero-muted leading-relaxed pl-[30px]">{item.desc}</p>
            </div>
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

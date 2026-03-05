import { motion } from "framer-motion";
import { AlertCircle, TrendingUp, UserCheck } from "lucide-react";

const cards = [
  {
    icon: AlertCircle,
    insight: "37 customers abandoned carts today.",
    action: "Send reminder email within 1 hour.",
    reason: "High purchase intent detected.",
  },
  {
    icon: TrendingUp,
    insight: "21 customers are likely to reorder this week.",
    action: "Send reorder reminder with product suggestions.",
    reason: "Purchase cycle pattern detected.",
  },
  {
    icon: UserCheck,
    insight: "12 high-value customers have not purchased in 60 days.",
    action: "Trigger win-back campaign with incentive.",
    reason: "Churn risk identified.",
  },
];

const InsightsSection = () => (
  <section className="py-24 md:py-32 bg-background">
    <div className="container mx-auto px-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
          Clear Marketing Actions, <span className="text-gradient">Not Just Reports</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <motion.div
            key={c.insight}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            className="bg-card rounded-xl border border-border p-6 flex flex-col"
          >
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <c.icon className="w-4 h-4 text-accent" />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Insight</span>
                <p className="text-sm font-medium text-foreground mt-0.5">{c.insight}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">Recommended action</span>
                <p className="text-sm text-foreground mt-0.5">{c.action}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Reason</span>
                <p className="text-xs text-muted-foreground mt-0.5">{c.reason}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-center text-muted-foreground text-sm"
      >
        The system highlights the opportunities that matter most.
      </motion.p>
    </div>
  </section>
);

export default InsightsSection;

import { motion } from "framer-motion";
import { Users, Clock, MessageSquare, Zap } from "lucide-react";

const capabilities = [
  { icon: Users, text: "Which customers should be contacted" },
  { icon: Clock, text: "When they are most likely to respond" },
  { icon: MessageSquare, text: "What message will be most relevant" },
  { icon: Zap, text: "Which channel performs best" },
];

const SolutionSection = () => (
  <section className="relative py-24 md:py-32 bg-background section-glow">
    <div className="absolute inset-0 grid-pattern pointer-events-none opacity-50" />
    <div className="relative container mx-auto px-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
          Your Customer Data, <span className="text-gradient">Working For You</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Our platform analyzes customer behavior and suggests the most effective marketing actions for you to take.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6">
        {capabilities.map((c, i) => (
          <motion.div
            key={c.text}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group flex items-start gap-4 bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:-translate-y-0.5 hover:border-accent/30 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
              <c.icon className="w-5 h-5 text-accent" />
            </div>
            <p className="text-foreground font-medium">{c.text}</p>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center text-muted-foreground max-w-2xl mx-auto"
      >
        Instead of manually analyzing reports or building segments, businesses get clear marketing actions based on real customer behavior.
      </motion.p>
    </div>
  </section>
);

export default SolutionSection;

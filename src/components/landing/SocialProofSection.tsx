import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "We went from spending hours on campaign setup to having everything run automatically. Our repeat purchase rate increased by 34%.",
    name: "Sarah M.",
    role: "Founder, Bloom & Root",
  },
  {
    quote: "Finally, a tool that tells us exactly what to do with our customer data instead of just showing us charts.",
    name: "James K.",
    role: "Marketing Lead, Urban Craft Co.",
  },
  {
    quote: "The abandoned cart recovery alone paid for itself in the first week. We recovered 22% of lost carts.",
    name: "Priya D.",
    role: "CEO, The Spice House",
  },
];

const stats = [
  { value: "3x", label: "Avg. revenue from lifecycle emails" },
  { value: "34%", label: "Increase in repeat purchases" },
  { value: "< 5 min", label: "Setup time to first automation" },
];

const SocialProofSection = () => (
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
          Trusted by <span className="text-gradient">Growing Brands</span>
        </h2>
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
          Ecommerce businesses are already making smarter marketing decisions.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-3 gap-6 mb-16"
      >
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-3xl md:text-4xl font-bold text-gradient">{s.value}</p>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Testimonials */}
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-card rounded-xl border border-border p-6 flex flex-col"
          >
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-foreground leading-relaxed flex-1">"{t.quote}"</p>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-semibold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProofSection;

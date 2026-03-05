import { motion } from "framer-motion";
import { ShoppingCart, Eye, RotateCcw, Package, UserX } from "lucide-react";

const automations = [
  { icon: ShoppingCart, title: "Abandoned Cart Recovery", desc: "Remind customers who left items in their cart." },
  { icon: Eye, title: "Browse Abandonment", desc: "Reconnect with customers who showed interest in a product." },
  { icon: RotateCcw, title: "Reorder Reminder", desc: "Reach customers when they are likely to purchase again." },
  { icon: Package, title: "Post-Purchase Cross Sell", desc: "Recommend relevant products after an order." },
  { icon: UserX, title: "Dormant Customer Win-Back", desc: "Reconnect with customers who haven't purchased recently." },
];

const AutomationsSection = () => (
  <section id="automations" className="py-24 md:py-32 bg-surface">
    <div className="container mx-auto px-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
          The Automations That Drive
          <br />
          <span className="text-gradient">Ecommerce Revenue</span>
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          A small set of lifecycle flows generate the majority of marketing revenue.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {automations.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="group bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-accent/30 transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <a.icon className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">{a.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center text-sm text-muted-foreground"
      >
        These lifecycle automations often generate the majority of ecommerce email revenue.
      </motion.p>
    </div>
  </section>
);

export default AutomationsSection;

import { motion } from "framer-motion";
import { BarChart3, Mail, MessageCircle, Globe } from "lucide-react";

const integrations = [
  { icon: Globe, name: "Your Website" },
  { icon: BarChart3, name: "Google Analytics (GA4)" },
  { icon: Mail, name: "Email" },
  { icon: MessageCircle, name: "WhatsApp" },
];

const IntegrationsSection = () => (
  <section id="integrations" className="py-24 md:py-32 bg-surface">
    <div className="container mx-auto px-6 max-w-4xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
          Works With The Tools <span className="text-gradient">You Already Use</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8"
      >
        {integrations.map((int) => (
          <div key={int.name} className="flex flex-col items-center gap-3 group">
            <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center group-hover:shadow-lg group-hover:border-accent/30 group-hover:-translate-y-1 transition-all duration-300">
              <int.icon className="w-8 h-8 text-muted-foreground group-hover:text-accent transition-colors" />
            </div>
            <span className="text-sm font-medium text-foreground">{int.name}</span>
          </div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-muted-foreground max-w-md mx-auto"
      >
        Import customer data and events from your website, analytics, email, and messaging tools. Your unified view starts working immediately.
      </motion.p>
    </div>
  </section>
);

export default IntegrationsSection;

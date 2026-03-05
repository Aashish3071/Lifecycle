import { motion } from "framer-motion";
import { X } from "lucide-react";

const noLongerNeeded = [
  "Manually build segments",
  "Analyze multiple dashboards",
  "Design complicated workflows",
];

const SimplicitySection = () => (
  <section className="py-24 md:py-32 bg-hero">
    <div className="container mx-auto px-6 max-w-3xl text-center">
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-12 inline-flex flex-col gap-4"
      >
        {noLongerNeeded.map((item) => (
          <div key={item} className="flex items-center gap-3 text-hero-muted/80">
            <div className="w-7 h-7 rounded-full bg-hero-foreground/5 flex items-center justify-center">
              <X className="w-3.5 h-3.5 text-hero-muted/50" />
            </div>
            <span className="text-left">{item}</span>
          </div>
        ))}
      </motion.div>

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

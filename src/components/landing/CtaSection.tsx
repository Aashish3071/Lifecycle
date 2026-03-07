import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

interface CtaSectionProps {
  onRequestAccess: () => void;
}

const CtaSection = ({ onRequestAccess }: CtaSectionProps) => (
  <section className="py-24 md:py-32 bg-hero relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
    <div className="relative container mx-auto px-6 max-w-3xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display text-3xl md:text-5xl font-bold text-hero-foreground">
          Start Making Smarter
          <br />
          <span className="text-gradient">Marketing Decisions</span>
        </h2>
        <p className="mt-4 text-hero-muted max-w-lg mx-auto">
          Turn your existing customer data into automated lifecycle marketing.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Button variant="hero" size="lg" className="text-base px-8" onClick={onRequestAccess}>
          Request a Demo <ArrowRight className="ml-1" />
        </Button>
        <Button variant="hero-outline" size="lg" className="text-base px-8" onClick={() => scrollTo("workflow")}>
          See How It Works
        </Button>
      </motion.div>
    </div>
  </section>
);

export default CtaSection;

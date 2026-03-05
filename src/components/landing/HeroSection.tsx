import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

interface HeroSectionProps {
  onRequestAccess: () => void;
}

const HeroSection = ({ onRequestAccess }: HeroSectionProps) => (
  <section className="relative min-h-screen flex items-center justify-center bg-hero overflow-hidden">
    <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
    <div className="absolute inset-0 bg-gradient-to-b from-hero/60 via-hero/30 to-hero" />
    <div className="relative z-10 container mx-auto px-6 pt-24 pb-20 text-center max-w-3xl">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="font-display text-5xl md:text-7xl font-bold text-hero-foreground leading-[1.1] tracking-tight"
      >
        Stop Guessing
        <br />
        Your Marketing
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="mt-6 text-xl md:text-2xl text-hero-muted font-body leading-relaxed"
      >
        Turn your customer data into smarter marketing decisions.
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-4 text-base md:text-lg text-hero-muted/70 font-body max-w-xl mx-auto leading-relaxed"
      >
        Your store already collects valuable customer data. Our platform turns that data into clear marketing actions—so you know exactly who to contact, when to reach them, and what message to send.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Button variant="hero" size="lg" className="text-base px-8" onClick={() => scrollTo("workflow")}>
          See How It Works <ArrowRight className="ml-1" />
        </Button>
        <Button variant="hero-outline" size="lg" className="text-base px-8" onClick={onRequestAccess}>
          Request Early Access
        </Button>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;

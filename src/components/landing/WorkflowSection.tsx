import { motion } from "framer-motion";
import { Database, Eye, Layers, Target, Pen, Send, ArrowDown } from "lucide-react";

const steps = [
  { icon: Database, title: "Customer Data", desc: "We collect signals from your store and marketing tools." },
  { icon: Eye, title: "Behavior Detection", desc: "Customer actions such as product views, purchases, and engagement are analyzed." },
  { icon: Layers, title: "Lifecycle Stage Assignment", desc: "Customers are grouped into meaningful lifecycle stages." },
  { icon: Target, title: "Recommended Marketing Action", desc: "The system identifies the most valuable action to take." },
  { icon: Pen, title: "Personalized Message Generation", desc: "Messages are tailored based on customer context." },
  { icon: Send, title: "Automated Delivery", desc: "Emails are sent automatically at the right moment." },
];

const WorkflowSection = () => (
  <section id="workflow" className="py-24 md:py-32 bg-hero">
    <div className="container mx-auto px-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <h2 className="font-display text-3xl md:text-5xl font-bold text-hero-foreground">
          From Customer Data to <span className="text-gradient">Marketing Action</span>
        </h2>
      </motion.div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-hero-foreground/10" />

        <div className="space-y-0">
          {steps.map((step, i) => (
            <div key={step.title}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative flex items-start gap-6 pl-0"
              >
                <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-xl bg-hero-foreground/5 border border-hero-foreground/10 flex items-center justify-center shrink-0">
                  <step.icon className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                </div>
                <div className="pt-1 pb-2">
                  <h3 className="font-display font-semibold text-hero-foreground text-lg">{step.title}</h3>
                  <p className="text-hero-muted text-sm mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
              {i < steps.length - 1 && (
                <div className="flex justify-start pl-[18px] md:pl-[26px] py-3">
                  <ArrowDown className="w-4 h-4 text-accent/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WorkflowSection;

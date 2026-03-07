import { motion } from "framer-motion";
import { Database, Eye, Layers, Target, Pen, Send, ArrowDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const steps = [
  {
    icon: Database,
    title: "Customer Data",
    desc: "We collect signals from your store and marketing tools.",
    detail: "Automatically syncs purchase history, browsing behavior, email engagement, and more from Shopify, GA4, and your email provider—no manual imports needed.",
  },
  {
    icon: Eye,
    title: "Behavior Detection",
    desc: "Customer actions such as product views, purchases, and engagement are analyzed.",
    detail: "Our engine tracks 30+ behavioral signals in real-time, including page views, add-to-cart events, purchase frequency, email opens, and time-on-site patterns.",
  },
  {
    icon: Layers,
    title: "Lifecycle Stage Assignment",
    desc: "Customers are grouped into meaningful lifecycle stages.",
    detail: "Customers are automatically classified into stages like New, Active, At-Risk, Dormant, and VIP based on recency, frequency, and monetary value.",
  },
  {
    icon: Target,
    title: "Recommended Marketing Action",
    desc: "The system identifies the most valuable action to take.",
    detail: "The decision engine evaluates each customer's stage, recent behavior, and predicted lifetime value to surface the single highest-impact action.",
  },
  {
    icon: Pen,
    title: "Personalized Message Generation",
    desc: "Messages are tailored based on customer context.",
    detail: "Dynamic content blocks are assembled using the customer's name, viewed products, purchase history, and preferred communication style.",
  },
  {
    icon: Send,
    title: "Automated Delivery",
    desc: "Emails are sent automatically at the right moment.",
    detail: "Send-time optimization ensures messages arrive when each customer is most likely to engage, based on their historical open and click patterns.",
  },
];

const WorkflowSection = () => (
  <TooltipProvider delayDuration={200}>
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-xl bg-hero-foreground/5 border border-hero-foreground/10 flex items-center justify-center shrink-0 cursor-help hover:bg-hero-foreground/10 hover:border-accent/40 transition-all duration-300">
                        <step.icon className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs text-sm leading-relaxed">
                      {step.detail}
                    </TooltipContent>
                  </Tooltip>
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
  </TooltipProvider>
);

export default WorkflowSection;

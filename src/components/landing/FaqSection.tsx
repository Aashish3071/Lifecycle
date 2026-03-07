import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does Lifecycle connect to my store?",
    a: "Lifecycle integrates directly with Shopify, Google Analytics, and popular email providers. Setup takes minutes—just authorize your accounts and your customer data starts flowing automatically.",
  },
  {
    q: "Do I need technical skills to use the platform?",
    a: "Not at all. Lifecycle is designed for marketers and business owners. There's no code to write, no complex workflows to build. The platform handles segmentation, timing, and messaging automatically.",
  },
  {
    q: "What kind of results can I expect?",
    a: "Businesses using lifecycle marketing typically see 15–30% increases in repeat purchase rates and significant improvements in email engagement. Results vary based on your store size and existing marketing maturity.",
  },
  {
    q: "How is this different from Klaviyo or Mailchimp?",
    a: "Traditional email platforms require you to manually build segments, design workflows, and decide timing. Lifecycle automates the decision-making process—it tells you who to contact, when, and with what message.",
  },
  {
    q: "Is my customer data secure?",
    a: "Absolutely. We use enterprise-grade encryption, are SOC 2 compliant, and never sell or share your data. Your customer information stays private and protected at all times.",
  },
  {
    q: "Can I try Lifecycle before committing?",
    a: "Yes. Request a demo and we'll walk you through the platform with your actual store data so you can see exactly how it works for your business.",
  },
];

const FaqSection = () => (
  <section id="faq" className="py-24 md:py-32 bg-surface">
    <div className="container mx-auto px-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
          Frequently Asked <span className="text-gradient">Questions</span>
        </h2>
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
          Everything you need to know about the platform.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default FaqSection;

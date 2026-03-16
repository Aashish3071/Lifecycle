import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  Link2,
  
  Mail,
  MessageCircle,
  BarChart3,
  ShoppingCart,
  Users,
  Palette,
  ArrowRight,
} from "lucide-react";

interface Step {
  id: string;
  title: string;
  time: string;
  description: string;
  action: string;
  icon: typeof Link2;
}

const categories = [
  {
    id: "setup",
    label: "Set up your account",
    steps: [
      { id: "connect", title: "Connect your data sources", time: "About 5 minutes", description: "Connect your website, GA4, email, and WhatsApp to sync customer data, events, and behavior automatically.", action: "Connect", icon: Link2 },
      { id: "tracking", title: "Turn on website tracking", time: "About 3 minutes", description: "Install our lightweight tracking snippet to capture visitor behavior and build customer profiles.", action: "Enable tracking", icon: BarChart3 },
      { id: "branding", title: "Add your branding", time: "About 2 minutes", description: "Upload your logo, set brand colors, and configure email sender details.", action: "Customize", icon: Palette },
    ],
  },
  {
    id: "audience",
    label: "Grow your audience",
    steps: [
      { id: "import", title: "Import existing contacts", time: "About 5 minutes", description: "Upload a CSV or connect your CRM to bring in your existing customer list.", action: "Import", icon: Users },
      { id: "whatsapp", title: "Connect WhatsApp Business", time: "About 5 minutes", description: "Link your WhatsApp Business account to send personalized messages and reach customers on their preferred channel.", action: "Connect WhatsApp", icon: MessageCircle },
    ],
  },
  {
    id: "recover",
    label: "Recover lost sales",
    steps: [
      { id: "cart", title: "Set up abandoned cart flow", time: "About 10 minutes", description: "Automatically remind customers about items left in their cart with a timed email sequence.", action: "Create flow", icon: ShoppingCart },
    ],
  },
  {
    id: "engage",
    label: "Engage your audience",
    steps: [
      { id: "welcome", title: "Create a welcome email flow", time: "About 15 minutes", description: "Automatically send a welcome message to new subscribers with your best content or offers.", action: "Create flow", icon: Mail },
    ],
  },
];

const quickCards = [
  { title: "Connect your platform", time: "About 5 minutes", description: "Connect your Shopify, WooCommerce, or custom platform to sync customer data and events.", action: "Connect platform", icon: Link2 },
  { title: "Import your contacts", time: "About 5 minutes", description: "Upload a CSV or connect your CRM to bring in your existing customer list.", action: "Import contacts", icon: Users },
  { title: "Create a welcome flow", time: "About 15 minutes", description: "Create a flow that automatically sends a welcome message to new subscribers of your brand.", action: "Create flow", icon: Mail },
];

const Onboarding = () => {
  const { completeOnboarding, dismissOnboarding } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("setup");
  const [completedSteps, setCompletedSteps] = useState<string[]>(["branding"]);
  const [expandedStep, setExpandedStep] = useState<string | null>("connect");

  const totalSteps = categories.reduce((acc, c) => acc + c.steps.length, 0);
  const completedCount = completedSteps.length;

  const handleComplete = (stepId: string) => {
    setCompletedSteps((prev) => (prev.includes(stepId) ? prev : [...prev, stepId]));
  };

  const handleSkip = () => {
    dismissOnboarding();
    navigate("/dashboard");
  };

  const handleFinish = () => {
    completeOnboarding();
    navigate("/dashboard");
  };

  const activeGroup = categories.find((c) => c.id === activeCategory)!;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between h-14 px-6">
          <span className="font-display text-lg font-bold text-foreground tracking-tight">
            Lifecycle<span className="text-accent">.</span>
          </span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              Skip for now
            </Button>
            <Button variant="default" size="sm" onClick={handleFinish}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">
            Get started with Lifecycle
          </h1>
          <p className="text-muted-foreground text-sm">
            Use this personalized guide to set up your account and start growing.
          </p>
        </div>

        {/* Quick action cards */}
        <div className="mb-10">
          <p className="text-sm font-medium text-foreground mb-1">
            First, connect your data and start collecting subscribers{" "}
            <span className="text-accent font-semibold">● Recommended</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {quickCards.map((card) => (
              <div
                key={card.title}
                className="rounded-lg border border-border bg-card p-5 flex flex-col justify-between hover:border-accent/40 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm text-foreground mb-3">{card.title}</p>
                  <div className="h-28 rounded-md bg-muted flex items-center justify-center mb-4">
                    <card.icon className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{card.time}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
                </div>
                <Button
                  className="mt-4 w-full"
                  variant="default"
                  size="sm"
                  onClick={() => handleComplete(card.title)}
                >
                  {card.action}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Setup guide */}
        <div className="border-t border-border pt-8">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-base font-display font-semibold text-foreground">
              Your complete setup guide
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {completedCount}/{totalSteps} completed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
            {/* Category sidebar */}
            <div className="flex flex-col gap-1">
              {categories.map((cat) => {
                const catCompleted = cat.steps.every((s) => completedSteps.includes(s.id));
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setExpandedStep(cat.steps[0]?.id ?? null);
                    }}
                    className={`text-left text-sm px-3 py-2 rounded-md flex items-center gap-2 transition-colors ${
                      activeCategory === cat.id
                        ? "bg-accent/10 text-accent font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {catCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                    )}
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Steps detail */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">{activeGroup.label}</h3>
              <div className="flex flex-col gap-1">
                {activeGroup.steps.map((step, idx) => {
                  const done = completedSteps.includes(step.id);
                  const isExpanded = expandedStep === step.id;
                  return (
                    <div key={step.id} className="border-l-2 border-border pl-5 pb-4 relative">
                      {/* Dot */}
                      <div className="absolute -left-[9px] top-0">
                        {done ? (
                          <CheckCircle2 className="w-4 h-4 text-accent bg-background rounded-full" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 bg-background flex items-center justify-center">
                            <span className="text-[9px] font-bold text-muted-foreground">
                              {String.fromCharCode(65 + idx)}
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                        className="flex items-center gap-2 w-full text-left"
                      >
                        <div>
                          <p className={`text-sm font-medium ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                            {step.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{step.time}</p>
                        </div>
                        {!done && (
                          <ChevronDown
                            className={`w-4 h-4 text-muted-foreground ml-auto transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          />
                        )}
                      </button>

                      {isExpanded && !done && (
                        <div className="mt-3 animate-flow-down">
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            {step.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button size="sm" onClick={() => handleComplete(step.id)}>
                              {step.action}
                            </Button>
                            <button
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => setExpandedStep(null)}
                            >
                              Skip for now
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

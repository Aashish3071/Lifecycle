import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Zap,
  ShoppingCart,
  Eye,
  RefreshCw,
  UserPlus,
  UserX,
  Mail,
  MessageCircle,
  ChevronRight,
  Plus,
  Save,
  Play,
  Settings,
  Smartphone,
  Monitor,
  Info,
} from "lucide-react";

const triggers = [
  { id: "abandoned-cart", label: "Abandoned Cart", desc: "User left items in their cart without checking out.", icon: ShoppingCart, recommended: true },
  { id: "product-viewed", label: "Product Viewed", desc: "User browsed a product detail page but didn't buy.", icon: Eye, recommended: false },
  { id: "consumption-end", label: "Consumption End", desc: "Replenishment trigger based on average usage.", icon: RefreshCw, recommended: false },
  { id: "new-signup", label: "New Signup", desc: "User just created an account.", icon: UserPlus, recommended: false },
  { id: "dormant-user", label: "Dormant User", desc: "No activity for 30+ days.", icon: UserX, recommended: true },
];

const actions = [
  { id: "email", label: "Send Email", desc: "Personalized marketing or transactional email.", icon: Mail },
  { id: "whatsapp", label: "Send WhatsApp Message", desc: "High engagement direct message to user phone.", icon: MessageCircle },
];

const recommendedFlows = [
  { trigger: "abandoned-cart", action: "email", name: "Abandoned Cart Recovery", reason: "856 users abandoned carts this week" },
  { trigger: "product-viewed", action: "email", name: "Browse Abandonment", reason: "1,420 users browsed but didn't buy" },
  { trigger: "consumption-end", action: "whatsapp", name: "Reorder Reminder", reason: "320 users due for reorder" },
  { trigger: "abandoned-cart", action: "email", name: "Post-Purchase Cross Sell", reason: "490 recent buyers to cross-sell" },
  { trigger: "dormant-user", action: "whatsapp", name: "Dormant Customer Win-Back", reason: "1,240 dormant users identified" },
];

const CampaignBuilder = () => {
  const navigate = useNavigate();
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  const [mode, setMode] = useState<"choose" | "build">("choose");

  const currentStep = !selectedTrigger ? 1 : !selectedAction ? 2 : 3;

  const applyRecommended = (flow: typeof recommendedFlows[0]) => {
    setSelectedTrigger(flow.trigger);
    setSelectedAction(flow.action);
    setMode("build");
  };

  if (mode === "choose") {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/automations")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Create Automation</h1>
            <p className="text-sm text-muted-foreground">Start from a recommendation or build from scratch</p>
          </div>
        </div>

        {/* Recommended flows */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" /> Recommended for You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendedFlows.map((flow) => (
              <Card
                key={flow.name}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer border-accent/20 hover:border-accent/40"
                onClick={() => applyRecommended(flow)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <h3 className="font-semibold text-sm text-foreground">{flow.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{flow.reason}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {triggers.find((t) => t.id === flow.trigger)?.label}
                  </Badge>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs">
                    {actions.find((a) => a.id === flow.action)?.label}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Manual */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Or Build Manually</h2>
          <Card
            className="p-6 flex items-center justify-center gap-3 cursor-pointer hover:shadow-md transition-shadow border-dashed border-2"
            onClick={() => setMode("build")}
          >
            <Plus className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium text-muted-foreground">Start from Scratch</span>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-0">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setMode("choose")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <p className="text-xs text-muted-foreground">Automations / New Flow</p>
            <h1 className="text-lg font-display font-bold text-foreground">Build Automation</h1>
            <p className="text-xs text-muted-foreground">Design your customer journey flow.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" className="gap-1.5">
            <Play className="w-3.5 h-3.5" /> Publish
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Save className="w-3.5 h-3.5" /> Save Draft
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left steps sidebar */}
        <div className="lg:col-span-2 space-y-4">
          {[
            { step: 1, label: "Select Trigger" },
            { step: 2, label: "Select Action" },
            { step: 3, label: "Configure" },
          ].map(({ step, label }) => (
            <div key={step} className={`pl-3 border-l-2 ${currentStep >= step ? "border-accent" : "border-border"}`}>
              <p className={`text-xs font-semibold uppercase tracking-wider ${currentStep === step ? "text-accent" : "text-muted-foreground"}`}>
                Step {step}
              </p>
              <p className={`text-sm font-medium ${currentStep === step ? "text-foreground" : "text-muted-foreground"}`}>
                {label}
              </p>
            </div>
          ))}

          {/* Help */}
          <Card className="p-3 mt-6 bg-muted/50 hidden lg:block">
            <div className="flex items-center gap-1.5 mb-1">
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-xs font-semibold text-foreground">Help Center</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Triggers are events that start your automation flow. You can only have one trigger per campaign.
            </p>
          </Card>
        </div>

        {/* Center builder */}
        <div className="lg:col-span-6 space-y-8">
          {/* Step 1: Triggers */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <h2 className="text-base font-semibold text-foreground">1. Choose a Trigger</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {triggers.slice(0, 3).map((t) => (
                <Card
                  key={t.id}
                  onClick={() => setSelectedTrigger(t.id)}
                  className={`p-4 cursor-pointer transition-all relative ${
                    selectedTrigger === t.id
                      ? "ring-2 ring-primary shadow-md"
                      : "hover:shadow-sm"
                  }`}
                >
                  {t.recommended && (
                    <Badge className="absolute -top-2 -right-2 text-[10px] bg-accent text-accent-foreground">
                      Recommended
                    </Badge>
                  )}
                  <t.icon className="w-6 h-6 text-primary mb-2" />
                  <h3 className="text-sm font-semibold text-foreground">{t.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t.desc}</p>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              {triggers.slice(3).map((t) => (
                <Card
                  key={t.id}
                  onClick={() => setSelectedTrigger(t.id)}
                  className={`p-4 cursor-pointer transition-all relative ${
                    selectedTrigger === t.id
                      ? "ring-2 ring-primary shadow-md"
                      : "hover:shadow-sm"
                  }`}
                >
                  {t.recommended && (
                    <Badge className="absolute -top-2 -right-2 text-[10px] bg-accent text-accent-foreground">
                      Recommended
                    </Badge>
                  )}
                  <t.icon className="w-6 h-6 text-primary mb-2" />
                  <h3 className="text-sm font-semibold text-foreground">{t.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Connector line */}
          {selectedTrigger && (
            <div className="flex justify-center">
              <div className="w-px h-10 bg-border" />
            </div>
          )}

          {/* Step 2: Actions */}
          {selectedTrigger && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Play className="w-4 h-4 text-primary-foreground" />
                </div>
                <h2 className="text-base font-semibold text-foreground">2. Select Action</h2>
              </div>
              <div className="space-y-3">
                {actions.map((a) => (
                  <Card
                    key={a.id}
                    onClick={() => setSelectedAction(a.id)}
                    className={`p-4 cursor-pointer transition-all flex items-center justify-between ${
                      selectedAction === a.id
                        ? "ring-2 ring-primary shadow-md"
                        : "hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <a.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{a.label}</h3>
                        <p className="text-xs text-muted-foreground">{a.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Expand area */}
          {selectedAction && (
            <>
              <div className="flex justify-center">
                <div className="w-px h-10 bg-border" />
              </div>
              <Card className="p-8 border-dashed border-2 flex flex-col items-center justify-center text-center">
                <Plus className="w-6 h-6 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Drag components here to expand your flow</p>
                <button className="text-xs text-primary underline mt-1">Browse components library ↗</button>
              </Card>
            </>
          )}
        </div>

        {/* Right preview */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Message Preview</span>
            </div>
            <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`p-1.5 rounded text-xs flex items-center gap-1 ${previewMode === "mobile" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`p-1.5 rounded text-xs flex items-center gap-1 ${previewMode === "desktop" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center">
            <div className={`bg-foreground rounded-[2rem] p-3 shadow-2xl ${previewMode === "mobile" ? "w-[260px]" : "w-full max-w-[380px]"}`}>
              <div className="bg-card rounded-[1.5rem] overflow-hidden">
                {/* Status bar */}
                <div className="bg-muted px-4 py-2 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground font-medium">9:41</span>
                  <div className="w-16 h-4 bg-foreground/20 rounded-full" />
                  <span className="text-[10px] text-muted-foreground">●●●</span>
                </div>

                {/* Notification preview */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Your Shop</p>
                      <p className="text-[10px] text-muted-foreground">Just now</p>
                    </div>
                  </div>

                  <div className="bg-accent/10 rounded-lg p-3">
                    <div className="w-full h-28 bg-accent/20 rounded-md mb-3 flex items-center justify-center">
                      <ShoppingCart className="w-8 h-8 text-accent/40" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">Did you forget something?</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      The items in your cart are missing you! Use code <strong className="text-foreground">COMEBACK10</strong> for 10% off your order.
                    </p>
                    <Button size="sm" className="w-full mt-3 text-xs">
                      Complete Purchase
                    </Button>
                  </div>

                  <p className="text-[10px] text-primary underline text-center cursor-pointer">
                    Click to edit message content
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated Reach</span>
              <span className="font-semibold text-foreground">14.2k users</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avg. Open Rate</span>
              <span className="font-semibold text-accent">~24.5%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Est. Conversions</span>
              <span className="font-semibold text-foreground">~3,480</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilder;

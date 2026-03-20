import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, MOCK_USER_ID } from "@/lib/supabase";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Building2,
  Globe,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";

const steps = [
  { id: 1, title: "About You", icon: User, description: "Tell us who you are" },
  { id: 2, title: "Your Business", icon: Building2, description: "Help us understand your company" },
  { id: 3, title: "Your Website", icon: Globe, description: "Technical details about your store" },
  { id: 4, title: "Your Scale", icon: BarChart3, description: "Help us personalize your experience" },
];

const teamSizeOptions = [
  { value: "solo", label: "Just me (Solo)" },
  { value: "2-5", label: "2-5 people" },
  { value: "6-15", label: "6-15 people" },
  { value: "16-50", label: "16-50 people" },
  { value: "50+", label: "50+ people" },
];

const platformOptions = [
  { value: "shopify", label: "Shopify" },
  { value: "woocommerce", label: "WooCommerce" },
  { value: "magento", label: "Magento" },
  { value: "bigcommerce", label: "BigCommerce" },
  { value: "wix", label: "Wix" },
  { value: "squarespace", label: "Squarespace" },
  { value: "prestashop", label: "PrestaShop" },
  { value: "opencart", label: "OpenCart" },
  { value: "ecwid", label: "Ecwid" },
  { value: "custom", label: "Custom / Other" },
];

const industryOptions = [
  { value: "fashion", label: "Fashion & Apparel" },
  { value: "beauty", label: "Beauty & Personal Care" },
  { value: "food_beverage", label: "Food & Beverage" },
  { value: "electronics", label: "Electronics & Gadgets" },
  { value: "home_living", label: "Home & Living" },
  { value: "health_wellness", label: "Health & Wellness" },
  { value: "jewelry", label: "Jewelry & Accessories" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "books", label: "Books & Stationery" },
  { value: "other", label: "Other" },
];

const visitorOptions = [
  { value: "<1k", label: "Less than 1,000" },
  { value: "1k-10k", label: "1,000 - 10,000" },
  { value: "10k-50k", label: "10,000 - 50,000" },
  { value: "50k-100k", label: "50,000 - 100,000" },
  { value: "100k+", label: "100,000+" },
];

interface FormData {
  fullName: string;
  workEmail: string;
  companyName: string;
  companyWebsite: string;
  teamSize: string;
  websitePlatform: string;
  industry: string;
  monthlyVisitors: string;
}

const UserSetup = () => {
  const navigate = useNavigate();
  const { completeSetup } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    fullName: "",
    workEmail: "",
    companyName: "",
    companyWebsite: "",
    teamSize: "",
    websitePlatform: "",
    industry: "",
    monthlyVisitors: "",
  });

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return form.fullName.trim().length > 0 && form.workEmail.trim().length > 0;
      case 2:
        return form.companyName.trim().length > 0;
      case 3:
        return form.websitePlatform.length > 0;
      case 4:
        return true; // optional fields
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder");

      if (!isPlaceholder) {
        const { error } = await (supabase as any).from("user_profiles").upsert(
          {
            user_id: MOCK_USER_ID,
            full_name: form.fullName,
            work_email: form.workEmail,
            company_name: form.companyName,
            company_website: form.companyWebsite,
            team_size: form.teamSize,
            website_platform: form.websitePlatform,
            industry: form.industry,
            monthly_visitors: form.monthlyVisitors,
          },
          { onConflict: "user_id" }
        );

        if (error) throw error;
      } else {
        // Mock a slight network delay then succeed without doing a failing fetch call.
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      completeSetup();
      toast.success("Profile saved! Let's set up your account.");
      navigate("/onboarding");
    } catch (err: any) {
      toast.error("Failed to save profile", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between h-14 px-6">
          <span className="font-display text-lg font-bold text-foreground tracking-tight">
            Lifecycle<span className="text-accent">.</span>
          </span>
          <span className="text-xs text-muted-foreground">
            Step {currentStep} of {steps.length}
          </span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl space-y-8">
          {/* Progress bar */}
          <div className="flex gap-2">
            {steps.map((s) => (
              <div key={s.id} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`h-1.5 w-full rounded-full transition-colors ${
                    s.id <= currentStep ? "bg-accent" : "bg-muted"
                  }`}
                />
                <div className="flex items-center gap-1.5">
                  {s.id < currentStep ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                  ) : (
                    <s.icon className={`w-3.5 h-3.5 ${s.id === currentStep ? "text-accent" : "text-muted-foreground"}`} />
                  )}
                  <span className={`text-[10px] font-medium ${s.id === currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                    {s.title}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Step content */}
          <Card className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-display font-bold text-foreground">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {steps[currentStep - 1].description}
              </p>
            </div>

            {/* Step 1: About You */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="e.g. Aashish Sharma"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="workEmail">Work Email *</Label>
                  <Input
                    id="workEmail"
                    type="email"
                    placeholder="you@company.com"
                    value={form.workEmail}
                    onChange={(e) => update("workEmail", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Your Business */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g. Lifestyle Store"
                    value={form.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="companyWebsite">Company Website</Label>
                  <Input
                    id="companyWebsite"
                    placeholder="https://www.example.com"
                    value={form.companyWebsite}
                    onChange={(e) => update("companyWebsite", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Industry *</Label>
                  <Select value={form.industry} onValueChange={(v) => update("industry", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industryOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Your Website */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Website Platform *</Label>
                  <Select value={form.websitePlatform} onValueChange={(v) => update("websitePlatform", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platformOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Team Size</Label>
                  <Select value={form.teamSize} onValueChange={(v) => update("teamSize", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How many people on your team?" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamSizeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 4: Your Scale */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Monthly Website Visitors</Label>
                  <Select value={form.monthlyVisitors} onValueChange={(v) => update("monthlyVisitors", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Approximate monthly traffic" />
                    </SelectTrigger>
                    <SelectContent>
                      {visitorOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-lg bg-accent/5 border border-accent/20 p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">You're almost ready!</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        We'll use this information to personalize your dashboard, tailor recommendations, and optimize your marketing workflows.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
              {currentStep > 1 ? (
                <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="gap-1.5"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      Complete Setup <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserSetup;

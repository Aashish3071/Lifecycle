import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserX,
  UserCheck,
  UserPlus,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Mail,
  MessageCircle,
  ShoppingCart,
  Gift,
  Target,
} from "lucide-react";

const segments = [
  {
    id: "engaged",
    title: "Highly Engaged",
    count: 3420,
    percentage: "40%",
    icon: UserCheck,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
    trend: "+8%",
    trendDir: "up" as const,
    description: "Active in last 14 days — opened emails, clicked links, or made purchases.",
    topActions: [
      { label: "Send product recommendations", icon: Gift, channel: "Email" },
      { label: "Upsell with exclusive offer", icon: Target, channel: "WhatsApp" },
    ],
    metrics: [
      { label: "Avg. Order Value", value: "$82" },
      { label: "Email Open Rate", value: "54%" },
      { label: "Repeat Purchase Rate", value: "32%" },
    ],
  },
  {
    id: "at-risk",
    title: "At Risk",
    count: 1247,
    percentage: "15%",
    icon: UserX,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
    trend: "+12%",
    trendDir: "up" as const,
    description: "30-60 days inactive. Showing signs of disengagement but recoverable with timely action.",
    topActions: [
      { label: "Launch re-engagement email series", icon: Mail, channel: "Email" },
      { label: "Send personal WhatsApp check-in", icon: MessageCircle, channel: "WhatsApp" },
    ],
    metrics: [
      { label: "Days Since Last Activity", value: "42 avg" },
      { label: "Churn Probability", value: "38%" },
      { label: "Lifetime Value", value: "$245" },
    ],
  },
  {
    id: "dormant",
    title: "Dormant",
    count: 2180,
    percentage: "26%",
    icon: UserX,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    borderColor: "border-border",
    trend: "+3%",
    trendDir: "up" as const,
    description: "60+ days without any activity. Requires aggressive win-back strategy or sunsetting.",
    topActions: [
      { label: "Win-back campaign with discount", icon: ShoppingCart, channel: "Email" },
      { label: "Final attempt — exclusive offer", icon: Gift, channel: "Email + WhatsApp" },
    ],
    metrics: [
      { label: "Days Since Last Activity", value: "94 avg" },
      { label: "Churn Probability", value: "72%" },
      { label: "Lifetime Value", value: "$180" },
    ],
  },
  {
    id: "new",
    title: "New Customers",
    count: 1585,
    percentage: "19%",
    icon: UserPlus,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
    trend: "+15%",
    trendDir: "up" as const,
    description: "First purchase within the last 30 days. Critical window for building loyalty and habits.",
    topActions: [
      { label: "Start welcome email sequence", icon: Mail, channel: "Email" },
      { label: "Send post-purchase follow-up", icon: MessageCircle, channel: "WhatsApp" },
    ],
    metrics: [
      { label: "First Order AOV", value: "$64" },
      { label: "Welcome Email Opened", value: "68%" },
      { label: "2nd Purchase Rate", value: "12%" },
    ],
  },
];

const Audiences = () => (
  <div className="max-w-5xl mx-auto space-y-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Audiences</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customer segments with recommended next steps for each cohort.
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full w-fit">
        <Users className="w-3 h-3" />
        {segments.reduce((a, s) => a + s.count, 0).toLocaleString()} total customers
      </div>
    </div>

    {/* Segment overview bar */}
    <Card className="p-4">
      <div className="flex w-full h-3 rounded-full overflow-hidden gap-0.5">
        {segments.map((seg) => (
          <div
            key={seg.id}
            className={`${seg.bgColor} first:rounded-l-full last:rounded-r-full transition-all`}
            style={{ width: seg.percentage }}
            title={`${seg.title}: ${seg.percentage}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-4 mt-3">
        {segments.map((seg) => (
          <div key={seg.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`w-2 h-2 rounded-full ${seg.bgColor}`} />
            {seg.title} ({seg.percentage})
          </div>
        ))}
      </div>
    </Card>

    {/* Segment cards */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {segments.map((seg) => {
        const TrendIcon = seg.trendDir === "up" ? TrendingUp : TrendingDown;
        return (
          <Card key={seg.id} className={`p-0 overflow-hidden border ${seg.borderColor}`}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${seg.bgColor} flex items-center justify-center`}>
                  <seg.icon className={`w-5 h-5 ${seg.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{seg.title}</h3>
                  <p className="text-xs text-muted-foreground">{seg.count.toLocaleString()} customers</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <TrendIcon className={`w-3 h-3 ${seg.trendDir === "up" ? "text-accent" : "text-destructive"}`} />
                <span className={seg.trendDir === "up" ? "text-accent" : "text-destructive"}>{seg.trend}</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </div>

            {/* Description */}
            <div className="px-5 py-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{seg.description}</p>
            </div>

            {/* Metrics */}
            <div className="px-5 pb-3">
              <div className="grid grid-cols-3 gap-3">
                {seg.metrics.map((m) => (
                  <div key={m.label} className="text-center p-2 rounded-md bg-muted/50">
                    <p className="text-sm font-bold text-foreground font-display">{m.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended actions */}
            <div className="px-5 pb-4 space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Recommended Actions
              </p>
              {seg.topActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  className="w-full justify-between text-xs h-9"
                >
                  <span className="flex items-center gap-2">
                    <action.icon className="w-3.5 h-3.5" />
                    {action.label}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0">{action.channel}</Badge>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </Button>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  </div>
);

export default Audiences;

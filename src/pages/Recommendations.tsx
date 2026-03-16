import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  UserX,
  TrendingDown,
  MessageCircle,
  Mail,
  RefreshCw,
  Eye,
  ArrowRight,
  Zap,
  Filter,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  Send,
} from "lucide-react";

const recommendations = [
  {
    id: "rec-1",
    severity: "high" as const,
    icon: ShoppingCart,
    title: "324 abandoned checkouts need recovery emails",
    description:
      "Customers left items worth $18,420 in their carts over the past 7 days. A 3-step email recovery sequence typically recaptures 8-12% of this revenue.",
    metric: "324",
    metricLabel: "customers to reach",
    action: "Launch Recovery Sequence",
    channel: "email" as const,
    impact: "high" as const,
    timeframe: "Send within 24h for best results",
    customers: 324,
  },
  {
    id: "rec-2",
    severity: "high" as const,
    icon: UserX,
    title: "1,247 dormant customers at risk of permanent churn",
    description:
      "These customers haven't purchased or engaged in 60+ days. A personalized win-back campaign with a time-limited offer converts 5-8% of dormant users.",
    metric: "38%",
    metricLabel: "churn probability",
    action: "Launch Win-Back Campaign",
    channel: "email" as const,
    impact: "high" as const,
    timeframe: "Act within 7 days",
    customers: 1247,
  },
  {
    id: "rec-3",
    severity: "high" as const,
    icon: TrendingDown,
    title: "Email open rates dropped 12% — segment & refresh",
    description:
      "Your email engagement is declining. We recommend splitting your audience into engaged vs. cold segments and A/B testing subject lines.",
    metric: "-12%",
    metricLabel: "vs. last month",
    action: "Review Email Strategy",
    channel: "email" as const,
    impact: "medium" as const,
    timeframe: "Review this week",
    customers: 8430,
  },
  {
    id: "rec-4",
    severity: "medium" as const,
    icon: MessageCircle,
    title: "892 highly engaged WhatsApp users ready for upsell",
    description:
      "These users actively respond to WhatsApp messages (72% response rate). Send personalized product recommendations to drive additional purchases.",
    metric: "72%",
    metricLabel: "response rate",
    action: "Send Recommendations",
    channel: "whatsapp" as const,
    impact: "medium" as const,
    timeframe: "Best sent Mon-Wed",
    customers: 892,
  },
  {
    id: "rec-5",
    severity: "medium" as const,
    icon: RefreshCw,
    title: "456 customers due for repeat purchase reminders",
    description:
      "Based on average reorder cycles, these customers are likely to need a refill or repurchase. A gentle reminder increases reorder rates by 18%.",
    metric: "$12,300",
    metricLabel: "expected reorder value",
    action: "Send Reorder Reminders",
    channel: "email" as const,
    impact: "medium" as const,
    timeframe: "Optimal window: next 5 days",
    customers: 456,
  },
  {
    id: "rec-6",
    severity: "low" as const,
    icon: Eye,
    title: "1,890 browse-but-didn't-buy visitors this week",
    description:
      "Visitors who viewed products but didn't add to cart. A browse abandonment nudge via email or on-site popup can convert 3-5% of these visitors.",
    metric: "1,890",
    metricLabel: "visitors",
    action: "Activate Browse Nudge",
    channel: "email" as const,
    impact: "low" as const,
    timeframe: "Within 48h of browse",
    customers: 1890,
  },
  {
    id: "rec-7",
    severity: "low" as const,
    icon: Users,
    title: "234 new customers haven't received a welcome flow",
    description:
      "First-time buyers from the last 14 days haven't been onboarded with a welcome series. Welcome emails see 4x higher engagement than regular campaigns.",
    metric: "234",
    metricLabel: "new customers",
    action: "Start Welcome Flow",
    channel: "email" as const,
    impact: "medium" as const,
    timeframe: "Send immediately",
    customers: 234,
  },
];

const severityStyles = {
  high: "border-l-destructive bg-destructive/5",
  medium: "border-l-accent bg-accent/5",
  low: "border-l-primary bg-primary/5",
};

const severityBadge = {
  high: "destructive" as const,
  medium: "default" as const,
  low: "secondary" as const,
};

const channelIcon = {
  email: Mail,
  whatsapp: MessageCircle,
};

const Recommendations = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterChannel, setFilterChannel] = useState("all");

  const filtered = recommendations.filter((r) => {
    if (filterSeverity !== "all" && r.severity !== filterSeverity) return false;
    if (filterChannel !== "all" && r.channel !== filterChannel) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((r) => r.id)));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Recommendations
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Actionable insights based on your customer data — prioritized by impact.
        </p>
      </div>

      {/* Filters + Bulk Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-[130px] h-9 text-xs">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterChannel} onValueChange={setFilterChannel}>
            <SelectTrigger className="w-[130px] h-9 text-xs">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {selected.size} selected
            </span>
            <Button size="sm" variant="default" className="gap-1.5 text-xs">
              <Send className="w-3 h-3" />
              Execute Selected
            </Button>
            <Button size="sm" variant="outline" className="text-xs" onClick={() => setSelected(new Set())}>
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Select all */}
      <div className="flex items-center gap-2 px-1">
        <Checkbox
          checked={filtered.length > 0 && selected.size === filtered.length}
          onCheckedChange={selectAll}
        />
        <span className="text-xs text-muted-foreground">
          Select all ({filtered.length})
        </span>
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const ChannelIcon = channelIcon[item.channel];
          return (
            <Card
              key={item.id}
              className={`border-l-4 ${severityStyles[item.severity]} p-0 overflow-hidden transition-shadow ${
                selected.has(item.id) ? "ring-2 ring-accent/30" : ""
              }`}
            >
              <div className="flex items-start gap-4 px-4 py-4 sm:px-5">
                <div className="flex items-center gap-3 shrink-0 pt-0.5">
                  <Checkbox
                    checked={selected.has(item.id)}
                    onCheckedChange={() => toggleSelect(item.id)}
                  />
                  <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center border border-border">
                    <item.icon className="w-5 h-5 text-foreground" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <Badge
                      variant={severityBadge[item.severity]}
                      className="text-[10px] px-1.5 py-0 capitalize"
                    >
                      {item.severity}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      <ChannelIcon className="w-3 h-3" />
                      {item.channel}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <DollarSign className="w-3 h-3 text-accent" />
                      <span className="font-bold text-foreground">{item.metric}</span>
                      <span className="text-muted-foreground">{item.metricLabel}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{item.customers.toLocaleString()} customers</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{item.timeframe}</span>
                    </div>
                  </div>
                </div>

                <Button size="sm" variant="default" className="shrink-0 gap-1.5 hidden sm:flex">
                  {item.action}
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
              {/* Mobile action */}
              <div className="sm:hidden px-4 pb-4">
                <Button size="sm" variant="default" className="w-full gap-1.5">
                  {item.action}
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <Card className="p-12 flex flex-col items-center text-center">
            <CheckCircle2 className="w-10 h-10 text-accent/30 mb-3" />
            <p className="text-sm font-medium text-foreground">All clear!</p>
            <p className="text-xs text-muted-foreground mt-1">
              No recommendations match your current filters.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Recommendations;

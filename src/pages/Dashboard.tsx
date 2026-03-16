import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UserX,
  ShoppingCart,
  Mail,
  MessageCircle,
  TrendingDown,
  Target,
  ArrowRight,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Send,
  Users,
  CalendarClock,
  Repeat,
  Activity,
  Package,
  MousePointerClick,
} from "lucide-react";

/* ── 6 Core Customer Metrics ──────────────────────────────── */
const coreMetrics = [
  {
    label: "Avg. Recency",
    value: "18 days",
    sub: "Since last purchase",
    icon: CalendarClock,
    color: "text-primary",
    detail: "3,420 active in last 14 days",
  },
  {
    label: "Purchase Frequency",
    value: "1.4/mo",
    sub: "Orders per customer",
    icon: Repeat,
    color: "text-accent",
    detail: "32% are repeat buyers",
  },
  {
    label: "Avg. Order Interval",
    value: "26 days",
    sub: "Between purchases",
    icon: Clock,
    color: "text-primary",
    detail: "892 overdue for reorder",
  },
  {
    label: "Engagement Score",
    value: "64/100",
    sub: "Across all channels",
    icon: Activity,
    color: "text-accent",
    detail: "1,247 below threshold",
  },
  {
    label: "Product Interest",
    value: "3.2 categories",
    sub: "Avg. per customer",
    icon: Package,
    color: "text-primary",
    detail: "Top: Electronics, Apparel",
  },
  {
    label: "Cart Intent Score",
    value: "324 high",
    sub: "Above intent threshold",
    icon: MousePointerClick,
    color: "text-accent",
    detail: "Added to cart, didn't buy",
  },
];

/* ── Priority Actions (the core value) ─────────────────────── */
const priorityActions = [
  {
    id: 1,
    severity: "high" as const,
    icon: ShoppingCart,
    title: "324 high-intent customers haven't purchased",
    description:
      "These customers added items to cart or started checkout in the last 7 days but didn't complete. Consider sending a follow-up email.",
    metric: "324",
    metricLabel: "customers to reach",
    action: "View Customers",
    channel: "Email",
  },
  {
    id: 2,
    severity: "high" as const,
    icon: UserX,
    title: "1,247 customers showing low engagement",
    description:
      "Engagement score dropped below threshold. No email opens, clicks, or site visits in 60+ days. Consider a re-engagement campaign.",
    metric: "38%",
    metricLabel: "at risk of churning",
    action: "View Segment",
    channel: "Email + WhatsApp",
  },
  {
    id: 3,
    severity: "medium" as const,
    icon: CalendarClock,
    title: "892 customers overdue for reorder",
    description:
      "These customers have passed their average order interval. Their typical buying cycle suggests they may be ready for a reminder.",
    metric: "892",
    metricLabel: "past avg. interval",
    action: "View Customers",
    channel: "Email",
  },
  {
    id: 4,
    severity: "low" as const,
    icon: MessageCircle,
    title: "WhatsApp engagement outperforming Email",
    description:
      "892 customers respond better on WhatsApp (72% response rate vs 39% email open rate). Consider shifting outreach for this segment.",
    metric: "72%",
    metricLabel: "WhatsApp response rate",
    action: "View Analysis",
    channel: "WhatsApp",
  },
];

/* ── Engagement snapshot ───────────────────────────────────── */
const engagementChannels = [
  { channel: "Email", sent: 12480, engaged: 4890, rate: "39%", icon: Mail, trend: "up" as const },
  { channel: "WhatsApp", sent: 3240, engaged: 2330, rate: "72%", icon: MessageCircle, trend: "up" as const },
  { channel: "On-site", sent: 8910, engaged: 2140, rate: "24%", icon: Eye, trend: "down" as const },
];

/* ── Automated flows status ────────────────────────────────── */
const activeFlows = [
  { name: "Cart Abandonment Follow-up", status: "active" as const, reached: 324, sent: 324, convRate: "27%" },
  { name: "Post-Purchase Check-in", status: "active" as const, reached: 156, sent: 156, convRate: "27%" },
  { name: "Dormant Customer Re-engagement", status: "active" as const, reached: 210, sent: 210, convRate: "9%" },
  { name: "Reorder Reminder", status: "active" as const, reached: 892, sent: 892, convRate: "12%" },
  { name: "Browse Abandonment Nudge", status: "paused" as const, reached: 0, sent: 0, convRate: "0%" },
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

const Dashboard = () => (
  <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
          What Needs Your Attention
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          We analyzed your data — here's what to act on today.
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full w-fit">
        <Clock className="w-3 h-3" />
        Last analyzed 2h ago
      </div>
    </div>

    {/* ── 6 Core Metrics ──────────────────────────────────── */}
    <div>
      <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4 text-primary" />
        Customer Health Metrics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coreMetrics.map((m) => (
          <Card key={m.label} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {m.label}
              </span>
              <m.icon className={`w-4 h-4 ${m.color} opacity-60`} />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{m.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
            <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border">
              {m.detail}
            </p>
          </Card>
        ))}
      </div>
    </div>

    {/* ── Priority Actions ──────────────────────────────────── */}
    <div>
      <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-accent" />
        Recommended Actions
      </h2>
      <div className="space-y-3">
        {priorityActions.map((item) => (
          <Card
            key={item.id}
            className={`border-l-4 ${severityStyles[item.severity]} p-0 overflow-hidden`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-card flex items-center justify-center border border-border">
                  <item.icon className="w-5 h-5 text-foreground" />
                </div>
                <div className="flex-1 min-w-0 sm:hidden">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <Badge variant={severityBadge[item.severity]} className="text-[10px] px-1.5 py-0 capitalize">
                      {item.severity}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0 hidden sm:block">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <Badge variant={severityBadge[item.severity]} className="text-[10px] px-1.5 py-0 capitalize">
                    {item.severity}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {item.channel}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 sm:hidden">{item.description}</p>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-left sm:text-right">
                  <p className="text-lg font-display font-bold text-foreground">{item.metric}</p>
                  <p className="text-[10px] text-muted-foreground">{item.metricLabel}</p>
                </div>
                <Button size="sm" variant="default" className="shrink-0 gap-1.5 text-xs sm:text-sm">
                  <span className="hidden sm:inline">{item.action}</span>
                  <span className="sm:hidden">View</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>

    {/* Bottom grid */}
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Channel engagement */}
      <Card className="lg:col-span-2 p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Channel Engagement</h2>
          <p className="text-xs text-muted-foreground mt-0.5">How customers interact across channels</p>
        </div>
        <div className="divide-y divide-border">
          {engagementChannels.map((c) => (
            <div key={c.channel} className="px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <c.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{c.channel}</span>
                </div>
                <span className="text-lg font-display font-bold text-foreground">{c.rate}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className="bg-accent rounded-full h-1.5 transition-all"
                  style={{ width: c.rate }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
                <span>{c.sent.toLocaleString()} reached</span>
                <span>{c.engaged.toLocaleString()} engaged</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Active automation flows */}
      <Card className="lg:col-span-3 p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Active Automations</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Flows working in the background for you</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Flow</th>
                <th className="text-center px-5 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Reached</th>
                <th className="text-right px-5 py-3 font-medium">Conv. Rate</th>
              </tr>
            </thead>
            <tbody>
              {activeFlows.map((f) => (
                <tr key={f.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground">{f.name}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                      f.status === "active"
                        ? "bg-accent/10 text-accent"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {f.status === "active" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {f.status === "active" ? "Active" : "Paused"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Send className="w-3 h-3" /> {f.reached}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-accent font-semibold">{f.convRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  </div>
);

export default Dashboard;

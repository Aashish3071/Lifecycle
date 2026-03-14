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
} from "lucide-react";

/* ── Priority Actions (the core value) ─────────────────────── */
const priorityActions = [
  {
    id: 1,
    severity: "high" as const,
    icon: ShoppingCart,
    title: "324 abandoned checkouts",
    description: "Customers left items in cart in the last 7 days. Send a recovery email sequence to recapture revenue.",
    metric: "$18,420",
    metricLabel: "potential revenue",
    action: "Send Recovery Emails",
    channel: "Email",
  },
  {
    id: 2,
    severity: "high" as const,
    icon: UserX,
    title: "1,247 dormant customers",
    description: "Haven't purchased or engaged in 60+ days. Re-engage with a win-back offer before they churn.",
    metric: "38%",
    metricLabel: "at risk of churning",
    action: "Launch Win-Back Campaign",
    channel: "Email + WhatsApp",
  },
  {
    id: 3,
    severity: "medium" as const,
    icon: TrendingDown,
    title: "Email open rates dropping",
    description: "Open rates declined 12% this month. Consider segmenting your list and refreshing subject lines.",
    metric: "-12%",
    metricLabel: "vs last month",
    action: "Review Email Strategy",
    channel: "Email",
  },
  {
    id: 4,
    severity: "low" as const,
    icon: MessageCircle,
    title: "892 WhatsApp-engaged users",
    description: "These users actively respond to WhatsApp messages. Nudge them with a personalized product recommendation.",
    metric: "72%",
    metricLabel: "response rate",
    action: "Send Recommendations",
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
  { name: "Abandoned Cart Recovery", status: "active" as const, recovered: 89, sent: 324, revenue: "$4,210" },
  { name: "Post-Purchase Cross-sell", status: "active" as const, recovered: 42, sent: 156, revenue: "$2,890" },
  { name: "Dormant Customer Win-back", status: "paused" as const, recovered: 0, sent: 0, revenue: "$0" },
  { name: "Browse Abandonment Nudge", status: "active" as const, recovered: 63, sent: 892, revenue: "$1,740" },
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
  <div className="max-w-6xl mx-auto space-y-8">
    {/* Header */}
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          What Needs Your Attention
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          We analyzed your data — here's what to act on today.
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
        <Clock className="w-3 h-3" />
        Last analyzed 2h ago
      </div>
    </div>

    {/* Quick health summary */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Active Customers", value: "8,432", sub: "Last 30 days", icon: Users, color: "text-accent" },
        { label: "At-Risk Customers", value: "1,247", sub: "60+ days inactive", icon: AlertTriangle, color: "text-destructive" },
        { label: "Recovered Revenue", value: "$8,840", sub: "This month via flows", icon: Zap, color: "text-accent" },
        { label: "Engagement Score", value: "64/100", sub: "Across all channels", icon: Target, color: "text-primary" },
      ].map((s) => (
        <Card key={s.label} className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{s.label}</span>
            <s.icon className={`w-4 h-4 ${s.color} opacity-60`} />
          </div>
          <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
        </Card>
      ))}
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
            <div className="flex items-center gap-5 px-5 py-4">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-card flex items-center justify-center border border-border">
                <item.icon className="w-5 h-5 text-foreground" />
              </div>

              <div className="flex-1 min-w-0">
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

              <div className="shrink-0 text-right mr-4 hidden sm:block">
                <p className="text-lg font-display font-bold text-foreground">{item.metric}</p>
                <p className="text-[10px] text-muted-foreground">{item.metricLabel}</p>
              </div>

              <Button size="sm" variant="default" className="shrink-0 gap-1.5">
                {item.action}
                <ArrowRight className="w-3 h-3" />
              </Button>
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
          <p className="text-xs text-muted-foreground mt-0.5">How users interact across channels</p>
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
                <th className="text-right px-5 py-3 font-medium">Sent</th>
                <th className="text-right px-5 py-3 font-medium">Converted</th>
                <th className="text-right px-5 py-3 font-medium">Revenue</th>
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
                      <Send className="w-3 h-3" /> {f.sent}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-foreground font-medium">{f.recovered}</td>
                  <td className="px-5 py-3 text-right text-accent font-semibold">{f.revenue}</td>
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

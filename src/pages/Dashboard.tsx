import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ShoppingCart,
  UserX,
  Zap,
  ArrowRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Workflow,
  CalendarClock,
  Activity,
  Eye,
} from "lucide-react";

/* ── MVP Overview Metrics ─────────────────────────────────── */
const overviewMetrics = [
  {
    label: "Total Customers Tracked",
    value: "12,480",
    icon: Users,
    change: "+340 this week",
  },
  {
    label: "Need Attention",
    value: "2,463",
    icon: AlertTriangle,
    change: "Across all segments",
  },
  {
    label: "Active Automations",
    value: "4",
    icon: Workflow,
    change: "1 paused",
  },
  {
    label: "Avg. Engagement Rate",
    value: "42%",
    icon: Activity,
    change: "+3% vs last month",
  },
];

/* ── What Needs Attention (drives to Audiences + Recommendations) */
const attentionItems = [
  {
    id: 1,
    severity: "high" as const,
    icon: ShoppingCart,
    title: "324 customers abandoned checkout",
    description: "High-intent customers who added items to cart but didn't purchase in the last 7 days.",
    count: 324,
    action: "View in Audiences",
    link: "/dashboard/audiences",
  },
  {
    id: 2,
    severity: "high" as const,
    icon: UserX,
    title: "1,247 customers going dormant",
    description: "No engagement in 60+ days. Their engagement scores are dropping below threshold.",
    count: 1247,
    action: "View in Audiences",
    link: "/dashboard/audiences",
  },
  {
    id: 3,
    severity: "medium" as const,
    icon: CalendarClock,
    title: "892 customers overdue for reorder",
    description: "Past their average order interval — typically ready for a reminder.",
    count: 892,
    action: "See Recommendation",
    link: "/dashboard/recommendations",
  },
  {
    id: 4,
    severity: "low" as const,
    icon: Eye,
    title: "1,890 browsers didn't add to cart",
    description: "Viewed products but showed no purchase intent. A nudge could convert 3-5%.",
    count: 1890,
    action: "See Recommendation",
    link: "/dashboard/recommendations",
  },
];

/* ── Quick Flow Status ─────────────────────────────────────── */
const automationStatus = [
  { name: "Cart Recovery", status: "active" as const, reached: 324, engagement: "27%" },
  { name: "Reorder Reminder", status: "active" as const, reached: 892, engagement: "12%" },
  { name: "Dormant Win-Back", status: "active" as const, reached: 210, engagement: "9%" },
  { name: "Browse Abandonment", status: "paused" as const, reached: 0, engagement: "—" },
];

const severityStyles = {
  high: "border-l-destructive bg-destructive/5",
  medium: "border-l-accent bg-accent/5",
  low: "border-l-primary bg-primary/5",
};

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
            What Needs Your Attention
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Your customer data analyzed — here's what to act on today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full w-fit">
          <Clock className="w-3 h-3" />
          Last analyzed 2h ago
        </div>
      </div>

      {/* ── Overview Metrics ──────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewMetrics.map((m) => (
          <Card key={m.label} className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {m.label}
              </span>
              <m.icon className="w-4 h-4 text-muted-foreground opacity-50" />
            </div>
            <p className="text-xl sm:text-2xl font-display font-bold text-foreground">{m.value}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{m.change}</p>
          </Card>
        ))}
      </div>

      {/* ── What Needs Attention ──────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            What Needs Attention
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1"
            onClick={() => navigate("/dashboard/recommendations")}
          >
            View all recommendations <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
        <div className="space-y-3">
          {attentionItems.map((item) => (
            <Card
              key={item.id}
              className={`border-l-4 ${severityStyles[item.severity]} p-0 overflow-hidden`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-4 sm:px-5">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-card flex items-center justify-center border border-border">
                    <item.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="text-right">
                    <p className="text-lg font-display font-bold text-foreground">{item.count.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">customers</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 gap-1.5 text-xs"
                    onClick={() => navigate(item.link)}
                  >
                    {item.action} <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Automation Status (quick glance, links to Automations) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Workflow className="w-4 h-4 text-primary" />
            Active Automations
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1"
            onClick={() => navigate("/dashboard/automations")}
          >
            Manage automations <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left px-5 py-3 font-medium">Flow</th>
                  <th className="text-center px-5 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium">Reached</th>
                  <th className="text-right px-5 py-3 font-medium">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {automationStatus.map((f) => (
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
                    <td className="px-5 py-3 text-right text-muted-foreground">{f.reached}</td>
                    <td className="px-5 py-3 text-right text-accent font-semibold">{f.engagement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

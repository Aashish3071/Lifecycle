import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MessageCircle,
  Globe,
  TrendingUp,
  TrendingDown,
  Users,
  ArrowUpRight,
  Zap,
  BarChart3,
  Activity,
  Eye,
  MousePointerClick,
} from "lucide-react";

const channels = [
  {
    name: "Email",
    icon: Mail,
    color: "text-blue-600",
    bg: "bg-blue-500/10",
    metrics: {
      sent: 9086,
      openRate: 47.2,
      openTrend: +3.2,
      clickRate: 18.4,
      clickTrend: +1.8,
      unsubRate: 0.3,
    },
    topPerforming: "Welcome Series - Day 1",
    topMetric: "60% open rate",
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    metrics: {
      sent: 9539,
      openRate: 85.6,
      openTrend: +5.4,
      clickRate: 12.5,
      clickTrend: +2.1,
      unsubRate: 0.1,
    },
    topPerforming: "Cart Recovery Nudge",
    topMetric: "80% read rate",
  },
  {
    name: "On-site",
    icon: Globe,
    color: "text-violet-600",
    bg: "bg-violet-500/10",
    metrics: {
      sent: 24500,
      openRate: 12.8,
      openTrend: -1.2,
      clickRate: 3.4,
      clickTrend: +0.5,
      unsubRate: 0,
    },
    topPerforming: "Exit-intent Popup",
    topMetric: "18% conversion",
  },
];

const insights = [
  {
    severity: "high" as const,
    title: "WhatsApp outperforms Email by 2x on read rates",
    description: "Consider shifting cart recovery campaigns to WhatsApp for dormant users who haven't opened emails in 30+ days.",
    action: "Shift to WhatsApp",
    metric: "85.6% vs 47.2%",
  },
  {
    severity: "medium" as const,
    title: "Email click rates improving steadily",
    description: "Subject line A/B testing is driving +1.8% click rate improvement. Continue testing personalized subject lines.",
    action: "View A/B Results",
    metric: "+1.8% MoM",
  },
  {
    severity: "low" as const,
    title: "On-site engagement dipping slightly",
    description: "Pop-up fatigue may be setting in. Consider reducing frequency or refreshing creative assets.",
    action: "Review Pop-ups",
    metric: "-1.2% MoM",
  },
  {
    severity: "medium" as const,
    title: "Multi-channel users convert 3.2x more",
    description: "Users reached on both Email + WhatsApp have significantly higher conversion rates than single-channel users.",
    action: "Create Multi-Channel Flow",
    metric: "3.2x conversion",
  },
];

const severityStyles = {
  high: "border-l-red-500 bg-red-500/5",
  medium: "border-l-amber-500 bg-amber-500/5",
  low: "border-l-emerald-500 bg-emerald-500/5",
};

const severityBadge = {
  high: "bg-red-500/10 text-red-600",
  medium: "bg-amber-500/10 text-amber-600",
  low: "bg-emerald-500/10 text-emerald-600",
};

const engagementBySegment = [
  { segment: "Engaged", users: 4820, emailOpen: "62%", waRead: "92%", avgOrders: 4.2 },
  { segment: "At-Risk", users: 2140, emailOpen: "28%", waRead: "65%", avgOrders: 1.8 },
  { segment: "Dormant", users: 1247, emailOpen: "8%", waRead: "22%", avgOrders: 0.3 },
  { segment: "New", users: 890, emailOpen: "55%", waRead: "78%", avgOrders: 1.1 },
];

const Engagement = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Engagement</h1>
        <p className="text-sm text-muted-foreground mt-1">How users interact across your channels</p>
      </div>

      {/* Channel cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {channels.map((ch) => (
          <Card key={ch.name} className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-lg ${ch.bg} flex items-center justify-center`}>
                <ch.icon className={`w-4 h-4 ${ch.color}`} />
              </div>
              <h3 className="font-semibold text-foreground">{ch.name}</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Messages Sent</span>
                <span className="font-semibold text-foreground">{ch.metrics.sent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{ch.name === "WhatsApp" ? "Read Rate" : "Open Rate"}</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  {ch.metrics.openRate}%
                  {ch.metrics.openTrend > 0 ? (
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Click Rate</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  {ch.metrics.clickRate}%
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">Top Performing</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{ch.topPerforming}</p>
              <p className="text-xs text-accent mt-0.5">{ch.topMetric}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Engagement by Segment */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">Engagement by Segment</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">Segment</th>
                <th className="text-right py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">Users</th>
                <th className="text-right py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">Email Open</th>
                <th className="text-right py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">WA Read</th>
                <th className="text-right py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg Orders</th>
              </tr>
            </thead>
            <tbody>
              {engagementBySegment.map((row) => (
                <tr key={row.segment} className="border-b border-border/50">
                  <td className="py-3 font-medium text-foreground">{row.segment}</td>
                  <td className="py-3 text-right text-foreground">{row.users.toLocaleString()}</td>
                  <td className="py-3 text-right text-foreground">{row.emailOpen}</td>
                  <td className="py-3 text-right text-foreground">{row.waRead}</td>
                  <td className="py-3 text-right text-foreground">{row.avgOrders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Actionable Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-accent" />
          <h2 className="font-semibold text-foreground">Actionable Insights</h2>
        </div>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <Card
              key={i}
              className={`p-4 sm:p-5 border-l-4 ${severityStyles[insight.severity]}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground text-sm">{insight.title}</h3>
                    <Badge variant="outline" className={severityBadge[insight.severity]}>
                      {insight.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-sm font-bold text-foreground">{insight.metric}</span>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    {insight.action} <ArrowUpRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Engagement;

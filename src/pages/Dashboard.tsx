import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { metricsApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
  Loader2,
} from "lucide-react";

/* ── MVP Overview Metrics ─────────────────────────────────── */
// We'll define these dynamically below based on the API response

import { recommendationsApi } from "@/lib/api/recommendations.api";
import { automationsApi } from "@/lib/api/automations.api";

/* ── Weekly Engagement Trend Data ──────────────────────────── */
// Chart data will be populated dynamically from API

const chartConfig = {
  emailOpens: { label: "Email Opens", color: "hsl(220 60% 50%)" },
  emailClicks: { label: "Email Clicks", color: "hsl(14 90% 58%)" },
  waReads: { label: "WA Reads", color: "hsl(142 60% 45%)" },
};

const severityStyles = {
  high: "border-l-destructive bg-destructive/5",
  medium: "border-l-accent bg-accent/5",
  low: "border-l-primary bg-primary/5",
};

const Dashboard = () => {
  const navigate = useNavigate();

  // Fetch latest snapshot for cards
  const { data: latestMetrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ["metrics", "latest"],
    queryFn: metricsApi.getLatestMetrics,
  });

  // Fetch 7-day trend for chart (using total_customers as a proxy for trend until we seed specific channel events)
  const { data: trendData, isLoading: isTrendLoading } = useQuery({
    queryKey: ["metrics", "trend", "total_customers"],
    queryFn: () => metricsApi.getMetricTrend("total_customers", 7),
  });

  // Fetch true recommendations to replace 'What Needs Attention'
  const { data: recommendations = [] } = useQuery({
    queryKey: ["recommendations"],
    queryFn: recommendationsApi.getRecommendations,
  });

  // Fetch true automations to replace 'Active Automations'
  const { data: automations = [] } = useQuery({
    queryKey: ["automations"],
    queryFn: automationsApi.getAutomations,
  });

  // Map API output to the overview cards formatting
  const overviewMetrics = [
    {
      label: "Total Customers Tracked",
      value: latestMetrics?.total_customers ? Math.round(latestMetrics.total_customers.metric_value).toLocaleString() : "—",
      icon: Users,
      change: "Updated daily",
    },
    {
      label: "Need Attention",
      value: latestMetrics?.at_risk_customers ? Math.round(latestMetrics.at_risk_customers.metric_value).toLocaleString() : "—",
      icon: AlertTriangle,
      change: "Customers at-risk",
    },
    {
      label: "Active Automations",
      value: latestMetrics?.active_automations ? Math.round(latestMetrics.active_automations.metric_value).toLocaleString() : "—",
      icon: Workflow,
      change: "Running flows",
    },
    {
      label: "Avg. Engagement Rate",
      value: latestMetrics?.avg_engagement_rate ? `${Math.round(latestMetrics.avg_engagement_rate.metric_value)}%` : "—",
      icon: Activity,
      change: "Across all channels",
    },
  ];

  // Map historical metrics to Recharts format
  // Reversing so oldest is first, newest on the right
  const weeklyTrend = trendData ? [...trendData].reverse().map(row => {
    const d = new Date(row.computed_at || new Date());
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      // Currently mocking the breakdown since we don't have historical channel event seed data
      emailOpens: 0,
      emailClicks: 0,
      waReads: 0,
    };
  }) : [];

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
          Last analyzed {latestMetrics?.total_customers?.computed_at ? new Date(latestMetrics.total_customers.computed_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'never'}
        </div>
      </div>

      {/* ── Overview Metrics ──────────────────────────────── */}
      {isMetricsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
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
      )}

      {/* ── Weekly Engagement Trend Chart ──────────────── */}
      <Card className="p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-primary" />
          Weekly Engagement Trend
        </h2>
        {isTrendLoading ? (
          <div className="flex items-center justify-center py-12 h-[250px]">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <AreaChart data={weeklyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fillEmailOpens" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(220 60% 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(220 60% 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillWaReads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142 60% 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142 60% 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="waReads" stroke="hsl(142 60% 45%)" fill="url(#fillWaReads)" strokeWidth={2} />
              <Area type="monotone" dataKey="emailOpens" stroke="hsl(220 60% 50%)" fill="url(#fillEmailOpens)" strokeWidth={2} />
              <Area type="monotone" dataKey="emailClicks" stroke="hsl(14 90% 58%)" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ChartContainer>
        )}
      </Card>

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
          {recommendations.slice(0, 4).map((item: any) => {
            let severity: "high"|"medium"|"low" = "low";
            if (item.priority > 80) severity = "high";
            else if (item.priority > 50) severity = "medium";

            return (
              <Card
                key={item.id}
                className={`border-l-4 ${severityStyles[severity]} p-0 overflow-hidden`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-4 sm:px-5">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-card flex items-center justify-center border border-border">
                      <Zap className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.explanation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">Impact</p>
                      <p className="text-sm font-semibold text-foreground">{item.expected_impact}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 gap-1.5 text-xs"
                      onClick={() => navigate("/dashboard/recommendations")}
                    >
                      View Details <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
          {recommendations.length === 0 && (
            <div className="text-center py-8 border border-dashed rounded-lg text-muted-foreground">
              No pending items require your attention.
            </div>
          )}
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
                {automations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-muted-foreground">
                      No active automations.
                    </td>
                  </tr>
                ) : automations.map((f: any) => {
                  const isActive = f.status === 'active';
                  return (
                    <tr key={f.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 font-medium text-foreground">{f.name}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                          isActive
                            ? "bg-accent/10 text-accent"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {isActive ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {isActive ? "Active" : "Draft"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-muted-foreground">{f.total_runs || 0} runs</td>
                      <td className="px-5 py-3 text-right text-accent font-semibold">—</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

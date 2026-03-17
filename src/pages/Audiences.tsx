import { useQuery } from "@tanstack/react-query";
import { customersApi } from "@/lib/api";
import { recommendationsApi } from "@/lib/api/recommendations.api";
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
  Zap,
  Loader2,
} from "lucide-react";

const segments = [
  {
    id: "engaged",
    lifecycleId: "active",
    title: "Highly Engaged",
    count: 3420,
    percentage: "40%",
    icon: UserCheck,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
    trend: "—",
    trendDir: "up" as const,
    description: "Active in last 14 days — opened emails, clicked links, or made purchases.",
    metrics: [
      { label: "Avg. Recency", value: "—" },
      { label: "Purchase Freq.", value: "—" },
      { label: "Engagement Score", value: "—" },
    ],
  },
  {
    id: "at-risk",
    lifecycleId: "at_risk",
    title: "At Risk",
    count: 1247,
    percentage: "15%",
    icon: UserX,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
    trend: "—",
    trendDir: "up" as const,
    description: "30-60 days inactive. Showing signs of disengagement but recoverable with timely action.",
    metrics: [
      { label: "Avg. Recency", value: "—" },
      { label: "Engagement Score", value: "—" },
      { label: "Churn Probability", value: "—" },
    ],
  },
  {
    id: "dormant",
    lifecycleId: "dormant",
    title: "Dormant",
    count: 2180,
    percentage: "26%",
    icon: UserX,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    borderColor: "border-border",
    trend: "—",
    trendDir: "up" as const,
    description: "60+ days without any activity. Consider a targeted re-engagement strategy or sunsetting.",
    metrics: [
      { label: "Avg. Recency", value: "—" },
      { label: "Engagement Score", value: "—" },
      { label: "Churn Probability", value: "—" },
    ],
  },
  {
    id: "new",
    lifecycleId: "new",
    title: "New Customers",
    count: 1585,
    percentage: "19%",
    icon: UserPlus,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
    trend: "—",
    trendDir: "up" as const,
    description: "First purchase within the last 30 days. Critical window for building loyalty and habits.",
    metrics: [
      { label: "Avg. Recency", value: "—" },
      { label: "Purchase Freq.", value: "—" },
      { label: "2nd Purchase Rate", value: "—" },
    ],
  },
];

const Audiences = () => {
  const { data: distribution, isLoading } = useQuery({
    queryKey: ["customers", "distribution"],
    queryFn: customersApi.getSegmentDistribution,
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ["recommendations"],
    queryFn: recommendationsApi.getRecommendations,
  });

  // Merge the static copy with dynamic counts and percentages
  const totalCustomers = distribution
    ? Object.values(distribution).reduce((sum, count) => sum + count, 0)
    : 0;

  const dynamicSegments = segments.map(seg => {
    // Add 'champion' to active temporarily for the UI if we don't have a 5th card
    let count = distribution?.[seg.lifecycleId] || 0;
    if (seg.lifecycleId === 'active' && distribution?.['champion']) {
      count += distribution['champion'];
    }

    const percentage = totalCustomers > 0
      ? Math.round((count / totalCustomers) * 100)
      : 0;

    return {
      ...seg,
      count,
      percentage: `${percentage}%`
    };
  });

  return (
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
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <>
              <Users className="w-3 h-3" />
              {totalCustomers.toLocaleString()} total customers
            </>
          )}
        </div>
      </div>

      {/* Segment overview bar */}
      <Card className="p-4">
        {isLoading ? (
          <div className="h-14 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="flex w-full h-3 rounded-full overflow-hidden gap-0.5 bg-muted">
              {dynamicSegments.map((seg) => (
                <div
                  key={seg.id}
                  className={`${seg.bgColor} first:rounded-l-full last:rounded-r-full transition-all`}
                  style={{ width: seg.percentage }}
                  title={`${seg.title}: ${seg.percentage}`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-3">
              {dynamicSegments.map((seg) => (
                <div key={seg.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`w-2 h-2 rounded-full ${seg.bgColor}`} />
                  {seg.title} ({seg.percentage})
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Segment cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {dynamicSegments.map((seg) => {
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
                  {seg.trend !== "—" && <TrendIcon className={`w-3 h-3 ${seg.trendDir === "up" ? "text-accent" : "text-destructive"}`} />}
                  <span className={seg.trend === "—" ? "text-muted-foreground" : (seg.trendDir === "up" ? "text-accent" : "text-destructive")}>{seg.trend}</span>
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

              {/* Recommended actions (from AI) */}
              <div className="px-5 pb-4 space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Recommended Actions
                </p>
                {(() => {
                  const segRecs = recommendations.filter(
                    (r: any) => r.target_segment === seg.lifecycleId
                  );
                  if (segRecs.length === 0) {
                    return (
                      <p className="text-xs text-muted-foreground italic py-2">
                        Not enough data yet. Recommendations will appear here as more customer activity is collected.
                      </p>
                    );
                  }
                  return segRecs.slice(0, 2).map((rec: any) => (
                    <Button
                      key={rec.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-between text-xs h-9"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Zap className="w-3.5 h-3.5 shrink-0" />
                        {rec.title}
                      </span>
                      <span className="flex items-center gap-1.5 shrink-0">
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                          {rec.suggested_channel || "multi"}
                        </Badge>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </Button>
                  ));
                })()}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Audiences;

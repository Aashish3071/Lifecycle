import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { customersApi } from "@/lib/api";
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
  UserX,
  ArrowRight,
  Mail,
  MessageCircle,
  AlertTriangle,
  Clock,
  TrendingDown,
  Send,
  Shield,
  CalendarClock,
  Activity,
  Repeat,
  Loader2,
} from "lucide-react";

const getRiskColor = (score: number) => {
  if (score >= 80) return "text-destructive";
  if (score >= 60) return "text-accent";
  return "text-muted-foreground";
};

const getRiskBg = (score: number) => {
  if (score >= 80) return "bg-destructive/10";
  if (score >= 60) return "bg-accent/10";
  return "bg-muted";
};

const getRiskLabel = (score: number) => {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  return "Moderate";
};

const ChurnRisk = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filterRisk, setFilterRisk] = useState("all");

  // Fetch at-risk and dormant customers from customer_metrics
  const { data: atRiskCustomers = [], isLoading } = useQuery({
    queryKey: ["customers", "churn-risk"],
    queryFn: async () => {
      const data = await customersApi.getCustomersByStage("at_risk");
      const dormant = await customersApi.getCustomersByStage("dormant");
      return [...data, ...dormant].sort(
        (a: any, b: any) => (b.churn_risk_score || 0) - (a.churn_risk_score || 0)
      );
    },
  });

  const customers = atRiskCustomers.map((c: any) => ({
    id: c.id,
    name: c.name || c.email || "Unknown",
    email: c.email || "—",
    riskScore: c.churn_risk_score || 0,
    recency: c.days_since_last_purchase ? `${c.days_since_last_purchase} days` : "—",
    totalOrders: (c.purchase_count_30d || 0) + (c.purchase_count_90d || 0),
    engagementScore: c.engagement_score || 0,
    lifecycleStage: c.lifecycle_stage || "unknown",
    preferredChannel: c.preferred_channel || "email",
  }));

  const filtered = customers.filter((c: any) => {
    if (filterRisk === "critical" && c.riskScore < 80) return false;
    if (filterRisk === "high" && (c.riskScore < 60 || c.riskScore >= 80)) return false;
    if (filterRisk === "moderate" && c.riskScore >= 60) return false;
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
    selected.size === filtered.length
      ? setSelected(new Set())
      : setSelected(new Set(filtered.map((c: any) => c.id)));
  };

  const avgRiskScore = customers.length > 0
    ? Math.round(customers.reduce((a: number, c: any) => a + c.riskScore, 0) / customers.length)
    : 0;
  const avgEngagement = customers.length > 0
    ? Math.round(customers.reduce((a: number, c: any) => a + c.engagementScore, 0) / customers.length)
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Churn Risk</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customers most likely to churn — with risk scores and suggested next steps.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "At-Risk Customers", value: customers.length.toString(), icon: UserX, color: "text-destructive", sub: "Score 60+" },
          { label: "Avg Engagement Score", value: `${avgEngagement}/100`, icon: Activity, color: "text-accent", sub: "Low = higher risk" },
          { label: "Avg Risk Score", value: `${avgRiskScore}/100`, icon: Shield, color: "text-destructive", sub: "Higher = worse" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color} opacity-60`} />
            </div>
            <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
          </Card>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : customers.length === 0 ? (
        <Card className="p-8 border-dashed text-center">
          <p className="text-muted-foreground">No at-risk customers detected yet. Data will appear as the metrics engine processes customer activity.</p>
        </Card>
      ) : (
        <>
          {/* Filters + Bulk */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-[150px] h-9 text-xs">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="critical">Critical (80+)</SelectItem>
                <SelectItem value="high">High (60-79)</SelectItem>
                <SelectItem value="moderate">Moderate (&lt;60)</SelectItem>
              </SelectContent>
            </Select>

            {selected.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{selected.size} selected</span>
                <Button size="sm" variant="default" className="gap-1.5 text-xs" onClick={() => { toast.success(`Re-engagement campaign queued for ${selected.size} customer(s)!`); setSelected(new Set()); }}>
                  <Send className="w-3 h-3" />
                  Send Re-engagement Campaign
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
            <span className="text-xs text-muted-foreground">Select all ({filtered.length})</span>
          </div>

          {/* Customer list */}
          <div className="space-y-3">
            {filtered.map((customer: any) => (
              <Card key={customer.id} className={`p-0 overflow-hidden transition-shadow ${selected.has(customer.id) ? "ring-2 ring-accent/30" : ""}`}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 sm:p-5">
                  <div className="flex items-start gap-3 shrink-0">
                    <Checkbox
                      checked={selected.has(customer.id)}
                      onCheckedChange={() => toggleSelect(customer.id)}
                      className="mt-1"
                    />
                    <div className={`w-12 h-12 rounded-xl ${getRiskBg(customer.riskScore)} flex items-center justify-center`}>
                      <span className={`text-lg font-display font-bold ${getRiskColor(customer.riskScore)}`}>
                        {customer.riskScore}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground">{customer.name}</p>
                      <Badge
                        variant={customer.riskScore >= 80 ? "destructive" : "default"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {getRiskLabel(customer.riskScore)} Risk
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{customer.email}</p>

                    {/* Key metrics */}
                    <div className="flex flex-wrap gap-4 mt-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <CalendarClock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Recency: {customer.recency}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Activity className="w-3 h-3 text-accent" />
                        <span className="font-medium text-foreground">Engagement: {customer.engagementScore}/100</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        {customer.preferredChannel === "whatsapp" ? <MessageCircle className="w-3 h-3 text-muted-foreground" /> : <Mail className="w-3 h-3 text-muted-foreground" />}
                        <span className="text-muted-foreground">{customer.preferredChannel}</span>
                      </div>
                    </div>

                    {/* Suggested action */}
                    <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        <TrendingDown className="w-3 h-3 inline mr-1" />
                        Stage: {customer.lifecycleStage}
                      </span>
                      <Button size="sm" variant="default" className="gap-1.5 text-xs" onClick={() => toast.info(`Re-engagement initiated for ${customer.name}`)}>
                        Take Action
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ChurnRisk;

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
  UserX,
  ArrowRight,
  Mail,
  MessageCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  ShoppingCart,
  TrendingDown,
  Send,
  Shield,
} from "lucide-react";

const churnCustomers = [
  {
    id: "c-1",
    name: "Sarah Mitchell",
    email: "sarah.m@email.com",
    riskScore: 92,
    lastActivity: "78 days ago",
    lastPurchase: "82 days ago",
    ltv: "$1,240",
    totalOrders: 14,
    lastChannel: "Email",
    signals: ["No email opens in 45 days", "Unsubscribed from SMS", "Cart abandoned twice"],
    suggestedAction: "Send personal win-back email with 20% off",
  },
  {
    id: "c-2",
    name: "James Rodriguez",
    email: "james.r@email.com",
    riskScore: 87,
    lastActivity: "62 days ago",
    lastPurchase: "68 days ago",
    ltv: "$890",
    totalOrders: 8,
    lastChannel: "WhatsApp",
    signals: ["Stopped opening WhatsApp messages", "Browsed but didn't buy (3x)"],
    suggestedAction: "WhatsApp message with curated picks",
  },
  {
    id: "c-3",
    name: "Emily Chen",
    email: "emily.c@email.com",
    riskScore: 84,
    lastActivity: "55 days ago",
    lastPurchase: "60 days ago",
    ltv: "$2,100",
    totalOrders: 22,
    lastChannel: "Email",
    signals: ["High LTV at risk", "Opened last email but didn't click", "Purchase frequency dropped 60%"],
    suggestedAction: "VIP re-engagement with exclusive early access",
  },
  {
    id: "c-4",
    name: "Michael Park",
    email: "michael.p@email.com",
    riskScore: 78,
    lastActivity: "48 days ago",
    lastPurchase: "52 days ago",
    ltv: "$560",
    totalOrders: 6,
    lastChannel: "Email",
    signals: ["Support ticket unresolved", "Negative review left"],
    suggestedAction: "Personal outreach to resolve complaint",
  },
  {
    id: "c-5",
    name: "Lisa Thompson",
    email: "lisa.t@email.com",
    riskScore: 73,
    lastActivity: "40 days ago",
    lastPurchase: "45 days ago",
    ltv: "$430",
    totalOrders: 5,
    lastChannel: "WhatsApp",
    signals: ["Reduced email engagement", "Competitor purchase detected"],
    suggestedAction: "Competitive offer via WhatsApp",
  },
  {
    id: "c-6",
    name: "David Kim",
    email: "david.k@email.com",
    riskScore: 68,
    lastActivity: "35 days ago",
    lastPurchase: "38 days ago",
    ltv: "$780",
    totalOrders: 9,
    lastChannel: "Email",
    signals: ["Subscription downgraded", "Email click rate dropped 40%"],
    suggestedAction: "Reorder reminder with loyalty reward",
  },
];

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

  const filtered = churnCustomers.filter((c) => {
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
      : setSelected(new Set(filtered.map((c) => c.id)));
  };

  const atRiskRevenue = "$48,200";
  const avgRiskScore = Math.round(churnCustomers.reduce((a, c) => a + c.riskScore, 0) / churnCustomers.length);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Churn Risk</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customers most likely to churn — with risk scores and suggested win-back actions.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "At-Risk Customers", value: churnCustomers.length.toString(), icon: UserX, color: "text-destructive", sub: "Score 60+" },
          { label: "Revenue at Risk", value: atRiskRevenue, icon: DollarSign, color: "text-accent", sub: "Combined LTV" },
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
            <Button size="sm" variant="default" className="gap-1.5 text-xs">
              <Send className="w-3 h-3" />
              Send Win-Back Campaign
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
        {filtered.map((customer) => (
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
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Last active: {customer.lastActivity}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <ShoppingCart className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{customer.totalOrders} orders</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <DollarSign className="w-3 h-3 text-accent" />
                    <span className="font-medium text-foreground">{customer.ltv} LTV</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    {customer.lastChannel === "Email" ? <Mail className="w-3 h-3 text-muted-foreground" /> : <MessageCircle className="w-3 h-3 text-muted-foreground" />}
                    <span className="text-muted-foreground">{customer.lastChannel}</span>
                  </div>
                </div>

                {/* Churn signals */}
                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
                    Churn Signals
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {customer.signals.map((signal) => (
                      <span
                        key={signal}
                        className="inline-flex items-center gap-1 text-[10px] text-destructive/80 bg-destructive/5 border border-destructive/10 px-2 py-0.5 rounded"
                      >
                        <AlertTriangle className="w-2.5 h-2.5" />
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggested action */}
                <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    <TrendingDown className="w-3 h-3 inline mr-1" />
                    Suggested: {customer.suggestedAction}
                  </span>
                  <Button size="sm" variant="default" className="gap-1.5 text-xs">
                    Take Action
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChurnRisk;

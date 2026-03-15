import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  ShoppingCart,
  UserX,
  Gift,
  Heart,
  Mail,
  MessageCircle,
  TrendingUp,
  Clock,
  MoreVertical,
} from "lucide-react";

const automations = [
  {
    id: 1,
    name: "Abandoned Cart Recovery",
    trigger: "Cart abandoned > 1 hour",
    channels: ["Email", "WhatsApp"],
    status: "active" as const,
    sent: 4280,
    converted: 856,
    conversionRate: 20.0,
    revenue: "$34,240",
    icon: ShoppingCart,
    lastTriggered: "2 min ago",
  },
  {
    id: 2,
    name: "Win-Back Dormant Users",
    trigger: "No activity for 30 days",
    channels: ["Email"],
    status: "active" as const,
    sent: 1920,
    converted: 288,
    conversionRate: 15.0,
    revenue: "$11,520",
    icon: UserX,
    lastTriggered: "18 min ago",
  },
  {
    id: 3,
    name: "Welcome Series",
    trigger: "New user signup",
    channels: ["Email", "WhatsApp"],
    status: "active" as const,
    sent: 3150,
    converted: 1260,
    conversionRate: 40.0,
    revenue: "$18,900",
    icon: Gift,
    lastTriggered: "5 min ago",
  },
  {
    id: 4,
    name: "Post-Purchase Cross Sell",
    trigger: "Order delivered + 3 days",
    channels: ["Email"],
    status: "paused" as const,
    sent: 980,
    converted: 147,
    conversionRate: 15.0,
    revenue: "$4,410",
    icon: Heart,
    lastTriggered: "2 days ago",
  },
  {
    id: 5,
    name: "Reorder Reminder",
    trigger: "Based on avg. consumption cycle",
    channels: ["WhatsApp"],
    status: "draft" as const,
    sent: 0,
    converted: 0,
    conversionRate: 0,
    revenue: "$0",
    icon: Clock,
    lastTriggered: "Never",
  },
];

const statusStyles = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  paused: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  draft: "bg-muted text-muted-foreground border-border",
};

const Automations = () => {
  const navigate = useNavigate();
  const [flows, setFlows] = useState(automations);

  const toggleStatus = (id: number) => {
    setFlows((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: f.status === "active" ? ("paused" as const) : ("active" as const) }
          : f
      )
    );
  };

  const totalSent = flows.reduce((a, f) => a + f.sent, 0);
  const totalConverted = flows.reduce((a, f) => a + f.converted, 0);
  const activeCount = flows.filter((f) => f.status === "active").length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Automations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage automated customer journey flows
          </p>
        </div>
        <Button
          onClick={() => navigate("/dashboard/automations/create")}
          className="gap-2"
          variant="default"
        >
          <Plus className="w-4 h-4" />
          Create Flow
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Flows</p>
          <p className="text-2xl font-bold text-foreground mt-1">{activeCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Sent</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalSent.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Conversions</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalConverted.toLocaleString()}</p>
        </Card>
      </div>

      {/* Automation list */}
      <div className="space-y-3">
        {flows.map((flow) => (
          <Card
            key={flow.id}
            className="p-4 sm:p-5 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate("/dashboard/automations/create")}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Icon + info */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <flow.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground text-sm">{flow.name}</h3>
                    <Badge variant="outline" className={statusStyles[flow.status]}>
                      {flow.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{flow.trigger}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {flow.channels.map((ch) => (
                      <span key={ch} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        {ch === "Email" ? <Mail className="w-3 h-3" /> : <MessageCircle className="w-3 h-3" />}
                        {ch}
                      </span>
                    ))}
                    <span className="text-xs text-muted-foreground">· Last: {flow.lastTriggered}</span>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-6 text-sm shrink-0">
                <div className="text-center hidden md:block">
                  <p className="text-xs text-muted-foreground">Sent</p>
                  <p className="font-semibold text-foreground">{flow.sent.toLocaleString()}</p>
                </div>
                <div className="text-center hidden md:block">
                  <p className="text-xs text-muted-foreground">Converted</p>
                  <p className="font-semibold text-foreground">{flow.converted.toLocaleString()}</p>
                </div>
                <div className="text-center hidden sm:block">
                  <p className="text-xs text-muted-foreground">Rate</p>
                  <p className="font-semibold text-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    {flow.conversionRate}%
                  </p>
                </div>
                <div className="text-center hidden sm:block">
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="font-semibold text-foreground">{flow.revenue}</p>
                </div>
                <Switch
                  checked={flow.status === "active"}
                  onCheckedChange={(e) => {
                    e && e; // prevent card click
                    toggleStatus(flow.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Automations;

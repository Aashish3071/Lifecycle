import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  MessageCircle,
  Send,
  Eye,
  MousePointerClick,
  Users,
  TrendingUp,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  Smartphone,
} from "lucide-react";

const campaigns = [
  {
    id: 1,
    name: "Cart Recovery Nudge",
    status: "active" as const,
    sentAt: "Ongoing",
    recipients: 2840,
    delivered: 2780,
    read: 2224,
    replied: 445,
    readRate: 80.0,
    replyRate: 16.0,
    revenue: undefined,
    message: "Hey! You left items in your cart. Complete your order before they sell out 🛒",
  },
  {
    id: 2,
    name: "Win-Back Message",
    status: "sent" as const,
    sentAt: "Mar 11, 2026",
    recipients: 1240,
    delivered: 1215,
    read: 972,
    replied: 194,
    readRate: 80.0,
    replyRate: 16.0,
    revenue: undefined,
    message: "We miss you! Check out what's new since your last visit 💛",
  },
  {
    id: 3,
    name: "Order Confirmation",
    status: "active" as const,
    sentAt: "Ongoing",
    recipients: 5600,
    delivered: 5544,
    read: 4990,
    replied: 560,
    readRate: 90.0,
    replyRate: 10.0,
    revenue: undefined,
    message: "Your order #{{order_id}} has been confirmed! Track it here 📦",
  },
  {
    id: 4,
    name: "Flash Sale Alert",
    status: "scheduled" as const,
    sentAt: "Mar 20, 2026",
    recipients: 6200,
    delivered: 0,
    read: 0,
    replied: 0,
    readRate: 0,
    replyRate: 0,
    revenue: undefined,
    message: "🔥 Don't miss out! Check out our latest collection, available for a limited time only!",
  },
  {
    id: 5,
    name: "Replenishment Reminder",
    status: "draft" as const,
    sentAt: "—",
    recipients: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    readRate: 0,
    replyRate: 0,
    revenue: undefined,
    message: "Time to restock? Your {{product}} might be running low 🔄",
  },
];

const statusConfig = {
  sent: { label: "Sent", style: "bg-emerald-500/10 text-emerald-600" },
  active: { label: "Active", style: "bg-blue-500/10 text-blue-600" },
  scheduled: { label: "Scheduled", style: "bg-amber-500/10 text-amber-600" },
  draft: { label: "Draft", style: "bg-muted text-muted-foreground" },
};

const WhatsApp = () => {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? campaigns : campaigns.filter((c) => c.status === tab);

  const totalDelivered = campaigns.reduce((a, c) => a + c.delivered, 0);
  const totalRead = campaigns.reduce((a, c) => a + c.read, 0);
  const totalReplied = campaigns.reduce((a, c) => a + c.replied, 0);
  const avgReadRate = totalDelivered > 0 ? ((totalRead / totalDelivered) * 100).toFixed(1) : "0";
  const avgReplyRate = totalDelivered > 0 ? ((totalReplied / totalDelivered) * 100).toFixed(1) : "0";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">WhatsApp Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track your WhatsApp messages</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> New Message
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Delivered</p>
            <Send className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{totalDelivered.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg Read Rate</p>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{avgReadRate}%</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +5.4% vs last month
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg Reply Rate</p>
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{avgReplyRate}%</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +2.1% vs last month
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Opt-in Users</p>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">8,240</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +520 this week
          </p>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4 space-y-3">
          {filtered.map((c) => {
            const st = statusConfig[c.status];
            return (
              <Card key={c.id} className="p-4 sm:p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground text-sm">{c.name}</h3>
                        <Badge variant="outline" className={st.style}>{st.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-sm">{c.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {c.status === "scheduled" ? `Scheduled for ${c.sentAt}` : c.sentAt}
                        {c.recipients > 0 && ` · ${c.recipients.toLocaleString()} recipients`}
                      </p>
                    </div>
                  </div>

                  {c.status !== "draft" && c.status !== "scheduled" && (
                    <div className="flex items-center gap-6 text-sm shrink-0">
                      <div className="text-center hidden md:block">
                        <p className="text-xs text-muted-foreground">Delivered</p>
                        <p className="font-semibold text-foreground">{c.delivered.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Read Rate</p>
                        <p className="font-semibold text-foreground">{c.readRate}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Reply Rate</p>
                        <p className="font-semibold text-foreground">{c.replyRate}%</p>
                      </div>
                      <div className="text-center hidden sm:block">
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="font-semibold text-accent">{c.revenue}</p>
                      </div>
                    </div>
                  )}

                  {(c.status === "draft" || c.status === "scheduled") && (
                    <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                      {c.status === "draft" ? "Edit Draft" : "View"} <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatsApp;

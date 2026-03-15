import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Mail,
  Send,
  Eye,
  MousePointerClick,
  Users,
  TrendingUp,
  TrendingDown,
  Plus,
  MoreVertical,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
} from "lucide-react";

const campaigns = [
  {
    id: 1,
    name: "Holiday Cart Recovery",
    status: "sent" as const,
    sentAt: "Mar 12, 2026",
    recipients: 4280,
    delivered: 4156,
    opened: 1872,
    clicked: 624,
    openRate: 45.0,
    clickRate: 15.0,
    revenue: "$12,480",
    subject: "You left something behind 🛒",
  },
  {
    id: 2,
    name: "Welcome Series - Day 1",
    status: "active" as const,
    sentAt: "Ongoing",
    recipients: 3150,
    delivered: 3087,
    opened: 1852,
    clicked: 926,
    openRate: 60.0,
    clickRate: 30.0,
    revenue: "$18,520",
    subject: "Welcome to the family! Here's 15% off",
  },
  {
    id: 3,
    name: "Win-Back Dormant Users",
    status: "sent" as const,
    sentAt: "Mar 10, 2026",
    recipients: 1920,
    delivered: 1843,
    opened: 553,
    clicked: 166,
    openRate: 30.0,
    clickRate: 9.0,
    revenue: "$4,980",
    subject: "We miss you! Come back for 20% off",
  },
  {
    id: 4,
    name: "Product Launch Announcement",
    status: "scheduled" as const,
    sentAt: "Mar 18, 2026",
    recipients: 8400,
    delivered: 0,
    opened: 0,
    clicked: 0,
    openRate: 0,
    clickRate: 0,
    revenue: "$0",
    subject: "Something exciting is coming...",
  },
  {
    id: 5,
    name: "Monthly Newsletter",
    status: "draft" as const,
    sentAt: "—",
    recipients: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    openRate: 0,
    clickRate: 0,
    revenue: "$0",
    subject: "March Updates & Exclusive Deals",
  },
];

const statusConfig = {
  sent: { label: "Sent", icon: CheckCircle2, style: "bg-emerald-500/10 text-emerald-600" },
  active: { label: "Active", icon: TrendingUp, style: "bg-blue-500/10 text-blue-600" },
  scheduled: { label: "Scheduled", icon: Clock, style: "bg-amber-500/10 text-amber-600" },
  draft: { label: "Draft", icon: XCircle, style: "bg-muted text-muted-foreground" },
};

const Email = () => {
  const [tab, setTab] = useState("all");

  const filtered = tab === "all" ? campaigns : campaigns.filter((c) => c.status === tab);

  const totalSent = campaigns.reduce((a, c) => a + c.delivered, 0);
  const totalOpened = campaigns.reduce((a, c) => a + c.opened, 0);
  const totalClicked = campaigns.reduce((a, c) => a + c.clicked, 0);
  const avgOpenRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : "0";
  const avgClickRate = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : "0";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Email Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track your email campaigns</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> New Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Sent</p>
            <Send className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{totalSent.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg Open Rate</p>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{avgOpenRate}%</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +3.2% vs last month
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg Click Rate</p>
            <MousePointerClick className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{avgClickRate}%</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +1.8% vs last month
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Subscribers</p>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">12,450</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +340 this week
          </p>
        </Card>
      </div>

      {/* Tabs + Campaign list */}
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
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground text-sm">{c.name}</h3>
                        <Badge variant="outline" className={st.style}>{st.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">Subject: {c.subject}</p>
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
                        <p className="text-xs text-muted-foreground">Open Rate</p>
                        <p className="font-semibold text-foreground">{c.openRate}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Click Rate</p>
                        <p className="font-semibold text-foreground">{c.clickRate}%</p>
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

export default Email;

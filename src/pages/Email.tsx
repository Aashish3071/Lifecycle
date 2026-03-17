import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { campaignsApi } from "@/lib/api";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
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
  Loader2,
} from "lucide-react";

const statusConfig = {
  sent: { label: "Sent", icon: CheckCircle2, style: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  active: { label: "Active", icon: TrendingUp, style: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  scheduled: { label: "Scheduled", icon: Clock, style: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  draft: { label: "Draft", icon: XCircle, style: "bg-muted text-muted-foreground border-border" },
};

const Email = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["campaigns", "email"],
    queryFn: () => campaignsApi.getCampaigns("email"),
  });

  const filtered = tab === "all" || tab === "sent" ? campaigns : [];

  const totalSent = campaigns.reduce((a, c) => a + (c.delivered || 0), 0);
  const totalOpened = campaigns.reduce((a, c) => a + (c.opened || 0), 0);
  const totalClicked = campaigns.reduce((a, c) => a + (c.clicked || 0), 0);
  const avgOpenRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : "0";
  const avgClickRate = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : "0";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Email Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track your email campaigns</p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/dashboard/email/compose")}>
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
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            Insufficient data for trend
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg Click Rate</p>
            <MousePointerClick className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{avgClickRate}%</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            Insufficient data for trend
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Subscribers</p>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">—</p>
          <p className="text-xs text-muted-foreground mt-1">
            Tracking setup pending
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
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border border-dashed rounded-lg">
              No campaigns found.
            </div>
          ) : filtered.map((c) => {
            const st = statusConfig.sent;
            const delivered = c.delivered || 0;
            const recipients = c.sent_count || 0;
            const opened = c.opened || 0;
            const clicked = c.clicked || 0;
            const openRate = delivered > 0 ? ((opened / delivered) * 100).toFixed(1) : "0";
            const clickRate = delivered > 0 ? ((clicked / delivered) * 100).toFixed(1) : "0";
            const revenue = c.revenue ? `$${c.revenue.toLocaleString()}` : "$0";
            const sentAtText = format(new Date(c.created_at || ''), 'MMM d, yyyy');

            return (
              <Card key={c.id} className="p-4 sm:p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground text-sm">{c.subject || "Email Campaign"}</h3>
                        <Badge variant="outline" className={st.style}>{st.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-sm">Subject: {c.subject || "No subject"}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {sentAtText}
                        {recipients > 0 && ` · ${recipients.toLocaleString()} recipients`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm shrink-0">
                    <div className="text-center hidden md:block">
                      <p className="text-xs text-muted-foreground">Delivered</p>
                      <p className="font-semibold text-foreground">{delivered.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Open Rate</p>
                      <p className="font-semibold text-foreground">{openRate}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Click Rate</p>
                      <p className="font-semibold text-foreground">{clickRate}%</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="font-semibold text-accent">{revenue}</p>
                    </div>
                  </div>
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

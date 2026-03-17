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
  Loader2,
} from "lucide-react";

const statusConfig = {
  sent: { label: "Sent", style: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  active: { label: "Active", style: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  scheduled: { label: "Scheduled", style: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  draft: { label: "Draft", style: "bg-muted text-muted-foreground border-border" },
};

const WhatsApp = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["campaigns", "whatsapp"],
    queryFn: () => campaignsApi.getCampaigns("whatsapp"),
  });

  const filtered = tab === "all" || tab === "sent" ? campaigns : [];

  const totalDelivered = campaigns.reduce((a, c) => a + (c.delivered || 0), 0);
  const totalRead = campaigns.reduce((a, c) => a + (c.opened || 0), 0);
  const totalReplied = campaigns.reduce((a, c) => a + (c.clicked || 0), 0);
  const avgReadRate = totalDelivered > 0 ? ((totalRead / totalDelivered) * 100).toFixed(1) : "0";
  const avgReplyRate = totalDelivered > 0 ? ((totalReplied / totalDelivered) * 100).toFixed(1) : "0";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">WhatsApp Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track your WhatsApp messages</p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/dashboard/whatsapp/compose")}>
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
          <p className="text-xs text-muted-foreground mt-1">
            Insufficient data
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg Reply Rate</p>
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{avgReplyRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">
            Insufficient data
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Opt-in Users</p>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">—</p>
          <p className="text-xs text-muted-foreground mt-1">
            Tracking setup pending
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
            const read = c.opened || 0;
            const replied = c.clicked || 0;
            const readRate = delivered > 0 ? ((read / delivered) * 100).toFixed(1) : "0";
            const replyRate = delivered > 0 ? ((replied / delivered) * 100).toFixed(1) : "0";
            const sentAtText = format(new Date(c.created_at || ''), 'MMM d, yyyy');

            return (
              <Card key={c.id} className="p-4 sm:p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground text-sm">{c.subject || "WhatsApp Blast"}</h3>
                        <Badge variant="outline" className={st.style}>{st.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-sm">{c.subject || "Message template"}</p>
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
                      <p className="text-xs text-muted-foreground">Read Rate</p>
                      <p className="font-semibold text-foreground">{readRate}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Reply Rate</p>
                      <p className="font-semibold text-foreground">{replyRate}%</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-xs text-muted-foreground">Replied</p>
                      <p className="font-semibold text-accent">{replied.toLocaleString()}</p>
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

export default WhatsApp;

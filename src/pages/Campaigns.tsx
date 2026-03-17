import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignsApi } from "@/lib/api";
import { customersApi } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Megaphone,
  Mail,
  MessageCircle,
  Plus,
  TrendingUp,
  Users,
  BarChart3,
  Send,
  X,
  Eye,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";

const statusConfig: Record<string, { label: string; style: string }> = {
  sent: { label: "Sent", style: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  active: { label: "Active", style: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  scheduled: { label: "Scheduled", style: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  draft: { label: "Draft", style: "bg-muted text-muted-foreground border-border" },
};

const Campaigns = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("all");
  const [showCompose, setShowCompose] = useState(false);

  // Compose form state
  const [campaignName, setCampaignName] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [sendEmail, setSendEmail] = useState(true);
  const [sendWhatsApp, setSendWhatsApp] = useState(true);

  // Fetch campaigns
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["campaigns", "all"],
    queryFn: campaignsApi.getAllCampaigns,
  });

  const { data: distribution } = useQuery({
    queryKey: ["customers", "distribution"],
    queryFn: customersApi.getSegmentDistribution,
  });

  const totalCustomers = distribution
    ? Object.values(distribution).reduce((sum, count) => sum + count, 0)
    : 0;

  const getAudienceCount = () => {
    if (!distribution) return 0;
    if (audience === "all") return totalCustomers;
    if (audience === "engaged") return (distribution["active"] || 0) + (distribution["champion"] || 0);
    return distribution[audience] || 0;
  };

  const sendMutation = useMutation({
    mutationFn: async () => {
      const groupId = crypto.randomUUID();
      const promises = [];
      if (sendEmail) {
        promises.push(
          campaignsApi.createCampaign({
            channel: "email",
            subject: campaignName,
            sent_count: getAudienceCount(),
            campaign_group_id: groupId,
          })
        );
      }
      if (sendWhatsApp) {
        promises.push(
          campaignsApi.createCampaign({
            channel: "whatsapp",
            subject: campaignName,
            sent_count: getAudienceCount(),
            campaign_group_id: groupId,
          })
        );
      }
      return Promise.all(promises);
    },
    onSuccess: () => {
      const channels = [sendEmail && "Email", sendWhatsApp && "WhatsApp"].filter(Boolean).join(" + ");
      toast.success("Campaign sent!", { description: `Sent via ${channels} to ${getAudienceCount().toLocaleString()} recipients.` });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      setShowCompose(false);
      setCampaignName("");
      setMessage("");
      setAudience("all");
    },
    onError: () => toast.error("Failed to send campaign"),
  });

  const handleSend = () => {
    if (!campaignName.trim()) return toast.error("Campaign name is required");
    if (!message.trim()) return toast.error("Message content is required");
    if (!sendEmail && !sendWhatsApp) return toast.error("Select at least one channel");
    sendMutation.mutate();
  };

  const filtered = tab === "all" ? campaigns : campaigns.filter((c: any) => c.status === tab || c.channel === tab);
  const totalSent = campaigns.reduce((a: number, c: any) => a + (c.sent_count || 0), 0);
  const totalDelivered = campaigns.reduce((a: number, c: any) => a + (c.delivered || 0), 0);
  const totalOpened = campaigns.reduce((a: number, c: any) => a + (c.opened || 0), 0);
  const avgOpenRate = totalDelivered > 0 ? ((totalOpened / totalDelivered) * 100).toFixed(1) : "0";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">Send cross-channel campaigns from one place</p>
        </div>
        <Button className="gap-2" onClick={() => setShowCompose(!showCompose)}>
          {showCompose ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> New Campaign</>}
        </Button>
      </div>

      {/* Inline Compose */}
      {showCompose && (
        <Card className="p-5 sm:p-6 border-accent/30 border-2 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="w-5 h-5 text-accent" />
            <h2 className="font-semibold text-foreground">Create Campaign</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Campaign Name</Label>
                <Input
                  placeholder="e.g. Spring Sale 2026"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers ({totalCustomers.toLocaleString()})</SelectItem>
                    <SelectItem value="engaged">Highly Engaged ({((distribution?.["active"] || 0) + (distribution?.["champion"] || 0)).toLocaleString()})</SelectItem>
                    <SelectItem value="at_risk">At Risk ({(distribution?.["at_risk"] || 0).toLocaleString()})</SelectItem>
                    <SelectItem value="dormant">Dormant ({(distribution?.["dormant"] || 0).toLocaleString()})</SelectItem>
                    <SelectItem value="new">New Customers ({(distribution?.["new"] || 0).toLocaleString()})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Message</Label>
                <Textarea
                  placeholder="Write your campaign message..."
                  className="min-h-[120px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Channels</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent/30 transition-colors">
                    <Checkbox id="ch-email" checked={sendEmail} onCheckedChange={(v) => setSendEmail(!!v)} />
                    <Mail className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Email</p>
                      <p className="text-[10px] text-muted-foreground">Full message with subject line</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent/30 transition-colors">
                    <Checkbox id="ch-whatsapp" checked={sendWhatsApp} onCheckedChange={(v) => setSendWhatsApp(!!v)} />
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-foreground">WhatsApp</p>
                      <p className="text-[10px] text-muted-foreground">Text message (max 1024 chars)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">Summary</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Sending to: <span className="text-foreground font-medium">{getAudienceCount().toLocaleString()} recipients</span></p>
                  <p>Channels: <span className="text-foreground font-medium">{[sendEmail && "Email", sendWhatsApp && "WhatsApp"].filter(Boolean).join(", ") || "None selected"}</span></p>
                </div>
              </div>

              <Button
                onClick={handleSend}
                disabled={sendMutation.isPending}
                className="w-full gap-1.5"
              >
                {sendMutation.isPending ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="w-3.5 h-3.5" /> Send Campaign</>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Campaigns</p>
            <Megaphone className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{campaigns.length}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Sent</p>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{totalSent.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Delivered</p>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{totalDelivered.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg Open Rate</p>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{avgOpenRate}%</p>
        </Card>
      </div>

      {/* Campaign List */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4 space-y-3">
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <Megaphone className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No campaigns yet. Create your first campaign above!</p>
            </Card>
          ) : (
            filtered.map((c: any) => {
              const st = statusConfig[c.status] || statusConfig.sent;
              return (
                <Card key={c.id} className="p-4 sm:p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        {c.channel === "whatsapp" ? (
                          <MessageCircle className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Mail className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground text-sm">{c.subject || "Untitled"}</h3>
                          <Badge variant="outline" className={st.style}>{st.label}</Badge>
                          <Badge variant="outline" className="capitalize text-[10px]">{c.channel}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Created {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm shrink-0">
                      <div className="text-center hidden md:block">
                        <p className="text-xs text-muted-foreground">Sent</p>
                        <p className="font-semibold text-foreground">{(c.sent_count || 0).toLocaleString()}</p>
                      </div>
                      <div className="text-center hidden md:block">
                        <p className="text-xs text-muted-foreground">Delivered</p>
                        <p className="font-semibold text-foreground">{(c.delivered || 0).toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Opened</p>
                        <p className="font-semibold text-foreground">{(c.opened || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Campaigns;

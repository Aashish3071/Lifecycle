import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { integrationsApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Building2,
  Link2,
  Users,
  Bell,
  Globe,
  BarChart3,
  Mail,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Loader2,
} from "lucide-react";

/* ── Tab definition ──────────────────────────────────────────── */
const tabs = [
  { id: "account", label: "Account", icon: User },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "team", label: "Team Members", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
] as const;

type TabId = (typeof tabs)[number]["id"];

/* ── Integration UI config (icons, descriptions only) ──────── */
const integrations = [
  {
    id: "website",
    name: "Your Website",
    description: "Track customer behavior, purchases, and product views from your store.",
    icon: Globe,
    connected: false,
    detail: null,
    lastSync: null,
  },
  {
    id: "ga4",
    name: "Google Analytics (GA4)",
    description: "Import traffic data, user journeys, and conversion events from GA4.",
    icon: BarChart3,
    connected: false,
    detail: null,
    lastSync: null,
  },
  {
    id: "email",
    name: "Email Provider",
    description: "Connect your SMTP or email service to send transactional and marketing emails.",
    icon: Mail,
    connected: false,
    detail: null,
    lastSync: null,
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Send personalized messages and campaigns via WhatsApp.",
    icon: MessageCircle,
    connected: false,
    detail: null,
    lastSync: null,
  },
];

const teamMembers: { id: number; name: string; email: string; role: string; avatar: string }[] = [];

const roleBadge: Record<string, "default" | "secondary" | "outline"> = {
  Owner: "default",
  Admin: "secondary",
  Member: "outline",
};

/* ── Component ───────────────────────────────────────────────── */
const Settings = () => {
  const [activeTab, setActiveTab] = useState<TabId>("account");
  const queryClient = useQueryClient();

  // Fetch Integrations
  const { data: dbIntegrations, isLoading: isIntegrationsLoading } = useQuery({
    queryKey: ["integrations"],
    queryFn: async () => {
      // First ensure the 4 core integrations at least exist in the DB
      const coreTypes = ["website", "ga4", "email", "whatsapp"];
      await Promise.all(coreTypes.map(t => integrationsApi.initializeIntegration(t)));
      // Then fetch all
      return integrationsApi.getIntegrations();
    },
  });

  // Mutate Integrations
  const updateIntegration = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      integrationsApi.updateIntegrationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
  });

  // Merge DB state with UI config (icons, descriptions)
  const mergedIntegrations = integrations.map(uiInt => {
    const dbInt = (dbIntegrations as any[])?.find((d: any) => d.type === uiInt.id);
    return {
      ...uiInt,
      dbId: dbInt?.id,
      connected: dbInt?.status === 'connected',
      status: dbInt?.status || 'disconnected',
      eventsToday: dbInt?.events_today || 0,
      lastSync: dbInt?.last_sync_at 
        ? new Date(dbInt.last_sync_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        : null
    };
  });

  const handleConnect = (int: typeof mergedIntegrations[0]) => {
    if (!int.dbId) return;
    toast.promise(
      updateIntegration.mutateAsync({ id: int.dbId, status: "connected" }),
      {
        loading: `Connecting ${int.name}...`,
        success: `${int.name} connected successfully! Data sync starting.`,
        error: `Failed to connect ${int.name}`
      }
    );
  };

  const handleDisconnect = (int: typeof mergedIntegrations[0]) => {
    if (!int.dbId) return;
    toast.promise(
      updateIntegration.mutateAsync({ id: int.dbId, status: "disconnected" }),
      {
        loading: `Disconnecting ${int.name}...`,
        success: `${int.name} disconnected.`,
        error: `Failed to disconnect ${int.name}`
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account, integrations, team, and notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
        {/* Sidebar tabs */}
        <nav className="flex md:flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md transition-colors text-left ${
                activeTab === tab.id
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="space-y-6">
          {/* ── Account ─────────────────────────────────────── */}
          {activeTab === "account" && (
            <>
              <Card className="p-6 space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">Business Details</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="company" className="text-xs">Company Name</Label>
                    <Input id="company" defaultValue="Lifecycle Demo Store" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="website" className="text-xs">Website</Label>
                    <Input id="website" defaultValue="https://demo.lifecycle.io" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs">Support Email</Label>
                    <Input id="email" type="email" defaultValue="support@lifecycle.io" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="timezone" className="text-xs">Timezone</Label>
                    <Input id="timezone" defaultValue="UTC+5:30 (IST)" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">Sender Defaults</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="senderName" className="text-xs">Sender Name</Label>
                    <Input id="senderName" defaultValue="Lifecycle" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="replyTo" className="text-xs">Reply-to Email</Label>
                    <Input id="replyTo" type="email" defaultValue="hello@lifecycle.io" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button size="sm" onClick={() => toast.success("Account settings saved!")}>Save Changes</Button>
                </div>
              </Card>
            </>
          )}

          {/* ── Integrations ────────────────────────────────── */}
          {activeTab === "integrations" && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg px-4 py-3 border border-border">
                <p className="text-xs text-muted-foreground">
                  Connect your data sources to start collecting customer signals. The more sources connected, the better your recommendations.
                </p>
              </div>
              {isIntegrationsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                mergedIntegrations.map((int) => (
                  <Card key={int.id} className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <int.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-foreground">{int.name}</h3>
                          {int.connected ? (
                            <Badge variant="secondary" className="gap-1 text-[10px]">
                              <CheckCircle2 className="w-3 h-3" /> Connected
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1 text-[10px] text-muted-foreground">
                              <AlertCircle className="w-3 h-3" /> Not connected
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{int.description}</p>
                        {int.connected && (
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                            <span>{int.eventsToday} events today</span>
                            {int.lastSync && <span>· Last sync: {int.lastSync}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {int.connected ? (
                        <>
                          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast.info(`Managing ${int.name}`, { description: "Integration configuration details coming soon." })}>
                            <ExternalLink className="w-3 h-3" /> Manage
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={updateIntegration.isPending}
                            className="text-destructive hover:text-destructive text-xs" 
                            onClick={() => handleDisconnect(int)}
                          >
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          className="gap-1.5 text-xs" 
                          disabled={updateIntegration.isPending}
                          onClick={() => handleConnect(int)}
                        >
                          <Link2 className="w-3 h-3" /> Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )))}
            </div>
          )}

          {/* ── Team Members ────────────────────────────────── */}
          {activeTab === "team" && (
            <Card className="p-0 overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Team Members</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Manage who has access to your Lifecycle account.
                  </p>
                </div>
                <Button size="sm" className="gap-1.5 text-xs" onClick={() => toast.info("Team invitations coming soon!", { description: "We're building role-based access controls." })}>
                  <Plus className="w-3 h-3" /> Invite
                </Button>
              </div>
              <div className="divide-y divide-border">
                {teamMembers.map((member) => (
                  <div key={member.id} className="px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={roleBadge[member.role as keyof typeof roleBadge]}>{member.role}</Badge>
                      {member.role !== "Owner" && (
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ── Notifications ───────────────────────────────── */}
          {activeTab === "notifications" && (
            <Card className="p-6 space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-1">Email Notifications</h2>
                <p className="text-xs text-muted-foreground">Choose what updates you receive by email.</p>
              </div>
              {[
                { label: "Weekly performance digest", desc: "Summary of key metrics every Monday.", default: true },
                { label: "Automation alerts", desc: "Get notified when a flow fails or pauses unexpectedly.", default: true },
                { label: "Customer risk warnings", desc: "Alert when customers show disengagement signals.", default: true },
                { label: "New team member joins", desc: "Notification when someone accepts an invite.", default: false },
              ].map((pref) => (
                <div key={pref.label} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-sm font-medium text-foreground">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">{pref.desc}</p>
                  </div>
                  <Switch defaultChecked={pref.default} />
                </div>
              ))}
              <Separator />
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-1">In-App Notifications</h2>
                <p className="text-xs text-muted-foreground">Control what shows up in your notification center.</p>
              </div>
              {[
                { label: "Recommended actions", desc: "Surface new opportunities as they're detected.", default: true },
                { label: "Integration sync status", desc: "Show sync success or failure banners.", default: true },
              ].map((pref) => (
                <div key={pref.label} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-sm font-medium text-foreground">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">{pref.desc}</p>
                  </div>
                  <Switch defaultChecked={pref.default} />
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

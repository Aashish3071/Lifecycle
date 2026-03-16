import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Megaphone,
  Mail,
  MessageCircle,
  Globe,
  TrendingUp,
  Plus,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  FlaskConical,
  ArrowUpRight,
  DollarSign,
  Users,
  BarChart3,
} from "lucide-react";

const campaigns = [
  {
    id: 1,
    name: "Spring Sale 2026",
    status: "active" as const,
    channels: ["Email", "WhatsApp"],
    startDate: "Mar 10, 2026",
    endDate: "Mar 20, 2026",
    budget: "$5,000",
    spent: "$3,240",
    reach: 12400,
    conversions: 1860,
    convRate: 15.0,
    abTest: { variant: "A: Urgency copy", winner: true, lift: "+12%" },
  },
  {
    id: 2,
    name: "Win-Back March",
    status: "active" as const,
    channels: ["Email"],
    startDate: "Mar 8, 2026",
    endDate: "Mar 22, 2026",
    budget: "$2,000",
    spent: "$1,420",
    reach: 3200,
    conversions: 384,
    revenue: "$15,360",
    convRate: 12.0,
    abTest: { variant: "B: Free shipping", winner: true, lift: "+8%" },
  },
  {
    id: 3,
    name: "New Collection Launch",
    status: "scheduled" as const,
    channels: ["Email", "WhatsApp", "On-site"],
    startDate: "Mar 25, 2026",
    endDate: "Apr 5, 2026",
    budget: "$8,000",
    spent: "$0",
    reach: 0,
    conversions: 0,
    revenue: "$0",
    convRate: 0,
    abTest: null,
  },
  {
    id: 4,
    name: "Valentine's Day Push",
    status: "completed" as const,
    channels: ["Email", "WhatsApp"],
    startDate: "Feb 7, 2026",
    endDate: "Feb 14, 2026",
    budget: "$4,500",
    spent: "$4,500",
    reach: 18600,
    conversions: 3348,
    revenue: "$133,920",
    convRate: 18.0,
    abTest: { variant: "A: Urgency copy", winner: true, lift: "+22%" },
  },
  {
    id: 5,
    name: "Post-Holiday Clearance",
    status: "completed" as const,
    channels: ["Email"],
    startDate: "Jan 2, 2026",
    endDate: "Jan 15, 2026",
    budget: "$3,000",
    spent: "$3,000",
    reach: 14200,
    conversions: 2130,
    revenue: "$63,900",
    convRate: 15.0,
    abTest: null,
  },
  {
    id: 6,
    name: "Flash Sale Weekend",
    status: "paused" as const,
    channels: ["WhatsApp"],
    startDate: "Mar 14, 2026",
    endDate: "Mar 16, 2026",
    budget: "$1,500",
    spent: "$680",
    reach: 4100,
    conversions: 328,
    revenue: "$9,840",
    convRate: 8.0,
    abTest: null,
  },
];

const statusConfig = {
  active: { label: "Active", icon: Play, style: "bg-emerald-500/10 text-emerald-600" },
  scheduled: { label: "Scheduled", icon: Clock, style: "bg-blue-500/10 text-blue-600" },
  completed: { label: "Completed", icon: CheckCircle2, style: "bg-muted text-muted-foreground" },
  paused: { label: "Paused", icon: Pause, style: "bg-amber-500/10 text-amber-600" },
};

const channelIcon = {
  Email: Mail,
  WhatsApp: MessageCircle,
  "On-site": Globe,
};

const Campaigns = () => {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? campaigns : campaigns.filter((c) => c.status === tab);

  const totalRevenue = campaigns.reduce((a, c) => a + parseFloat(c.revenue.replace(/[$,]/g, "")), 0);
  const totalConversions = campaigns.reduce((a, c) => a + c.conversions, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">All your marketing campaigns in one place</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> New Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active</p>
            <Megaphone className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{activeCampaigns}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Revenue</p>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">${(totalRevenue / 1000).toFixed(0)}k</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Conversions</p>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{totalConversions.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg Conv. Rate</p>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">13.6%</p>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4 space-y-3">
          {filtered.map((c) => {
            const st = statusConfig[c.status];
            return (
              <Card key={c.id} className="p-4 sm:p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Megaphone className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground text-sm">{c.name}</h3>
                        <Badge variant="outline" className={st.style}>{st.label}</Badge>
                        {c.abTest && (
                          <Badge variant="outline" className="bg-violet-500/10 text-violet-600 gap-1">
                            <FlaskConical className="w-3 h-3" /> A/B Test
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {c.channels.map((ch) => {
                          const Icon = channelIcon[ch as keyof typeof channelIcon];
                          return (
                            <span key={ch} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Icon className="w-3 h-3" /> {ch}
                            </span>
                          );
                        })}
                        <span className="text-xs text-muted-foreground">· {c.startDate} — {c.endDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 text-sm shrink-0 flex-wrap">
                    {c.reach > 0 && (
                      <>
                        <div className="text-center hidden md:block">
                          <p className="text-xs text-muted-foreground">Reach</p>
                          <p className="font-semibold text-foreground">{c.reach.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Conv. Rate</p>
                          <p className="font-semibold text-foreground">{c.convRate}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Revenue</p>
                          <p className="font-semibold text-accent">{c.revenue}</p>
                        </div>
                      </>
                    )}
                    {c.abTest && (
                      <div className="text-center hidden lg:block">
                        <p className="text-xs text-muted-foreground">A/B Winner</p>
                        <p className="font-semibold text-foreground text-xs">{c.abTest.variant}</p>
                        <p className="text-xs text-emerald-600">{c.abTest.lift} lift</p>
                      </div>
                    )}
                    {c.status === "scheduled" && (
                      <Button variant="outline" size="sm" className="gap-1.5">
                        View <ArrowUpRight className="w-3 h-3" />
                      </Button>
                    )}
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

export default Campaigns;

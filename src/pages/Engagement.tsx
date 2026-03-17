import { useQuery } from "@tanstack/react-query";
import { campaignsApi } from "@/lib/api";
import { customersApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Mail,
  MessageCircle,
  Globe,
  Users,
  BarChart3,
  Activity,
  Loader2,
  Zap,
  ArrowUpRight,
} from "lucide-react";

const barChartConfig = {
  openRate: { label: "Open/Read Rate", color: "hsl(220 60% 50%)" },
  clickRate: { label: "Click Rate", color: "hsl(14 90% 58%)" },
};

const Engagement = () => {
  // Fetch campaign data for Email and WhatsApp
  const { data: emailCampaigns = [], isLoading: isEmailLoading } = useQuery({
    queryKey: ["campaigns", "email"],
    queryFn: () => campaignsApi.getCampaigns("email"),
  });

  const { data: whatsappCampaigns = [], isLoading: isWaLoading } = useQuery({
    queryKey: ["campaigns", "whatsapp"],
    queryFn: () => campaignsApi.getCampaigns("whatsapp"),
  });

  const { data: distribution, isLoading: isDistLoading } = useQuery({
    queryKey: ["customers", "distribution"],
    queryFn: customersApi.getSegmentDistribution,
  });

  const isLoading = isEmailLoading || isWaLoading || isDistLoading;

  // Compute channel metrics from campaign_sends
  const emailSent = emailCampaigns.reduce((a, c) => a + (c.delivered || 0), 0);
  const emailOpened = emailCampaigns.reduce((a, c) => a + (c.opened || 0), 0);
  const emailClicked = emailCampaigns.reduce((a, c) => a + (c.clicked || 0), 0);
  const emailOpenRate = emailSent > 0 ? ((emailOpened / emailSent) * 100).toFixed(1) : "0";
  const emailClickRate = emailSent > 0 ? ((emailClicked / emailSent) * 100).toFixed(1) : "0";

  const waSent = whatsappCampaigns.reduce((a, c) => a + (c.delivered || 0), 0);
  const waRead = whatsappCampaigns.reduce((a, c) => a + (c.opened || 0), 0);
  const waReplied = whatsappCampaigns.reduce((a, c) => a + (c.clicked || 0), 0);
  const waReadRate = waSent > 0 ? ((waRead / waSent) * 100).toFixed(1) : "0";
  const waReplyRate = waSent > 0 ? ((waReplied / waSent) * 100).toFixed(1) : "0";

  const channels = [
    {
      name: "Email",
      icon: Mail,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
      sent: emailSent,
      openRate: emailOpenRate,
      clickRate: emailClickRate,
      rateLabel: "Open Rate",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      sent: waSent,
      openRate: waReadRate,
      clickRate: waReplyRate,
      rateLabel: "Read Rate",
    },
    {
      name: "On-site",
      icon: Globe,
      color: "text-violet-600",
      bg: "bg-violet-500/10",
      sent: 0,
      openRate: "—",
      clickRate: "—",
      rateLabel: "View Rate",
    },
  ];

  const barChartData = [
    { channel: "Email", openRate: parseFloat(emailOpenRate), clickRate: parseFloat(emailClickRate) },
    { channel: "WhatsApp", openRate: parseFloat(waReadRate), clickRate: parseFloat(waReplyRate) },
    { channel: "On-site", openRate: 0, clickRate: 0 },
  ];

  // Segment distribution for table
  const segmentRows = distribution ? [
    { segment: "Active", users: (distribution["active"] || 0) + (distribution["champion"] || 0) },
    { segment: "At-Risk", users: distribution["at_risk"] || 0 },
    { segment: "Dormant", users: distribution["dormant"] || 0 },
    { segment: "New", users: distribution["new"] || 0 },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Engagement</h1>
        <p className="text-sm text-muted-foreground mt-1">How users interact across your channels</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Channel cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {channels.map((ch) => (
              <Card key={ch.name} className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-8 h-8 rounded-lg ${ch.bg} flex items-center justify-center`}>
                    <ch.icon className={`w-4 h-4 ${ch.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground">{ch.name}</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Messages Sent</span>
                    <span className="font-semibold text-foreground">{ch.sent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{ch.rateLabel}</span>
                    <span className="font-semibold text-foreground">{ch.openRate}{ch.openRate !== "—" ? "%" : ""}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Click Rate</span>
                    <span className="font-semibold text-foreground">{ch.clickRate}{ch.clickRate !== "—" ? "%" : ""}</span>
                  </div>
                </div>

                {ch.name === "On-site" && (
                  <div className="mt-4 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground italic">Website tracking not yet connected</p>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Channel Comparison Chart */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Channel Comparison</h2>
            </div>
            <ChartContainer config={barChartConfig} className="h-[280px] w-full">
              <BarChart data={barChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="channel" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" unit="%" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="openRate" fill="hsl(220 60% 50%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clickRate" fill="hsl(14 90% 58%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </Card>

          {/* Engagement by Segment */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Engagement by Segment</h2>
            </div>
            {segmentRows.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Not enough data yet. Segment data will appear as customers are tracked.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">Segment</th>
                      <th className="text-right py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    {segmentRows.map((row) => (
                      <tr key={row.segment} className="border-b border-border/50">
                        <td className="py-3 font-medium text-foreground">{row.segment}</td>
                        <td className="py-3 text-right text-foreground">{row.users.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Note about insights */}
          <Card className="p-5 border-dashed">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-accent" />
              <h2 className="font-semibold text-foreground">Actionable Insights</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Insights will be generated automatically once enough campaign and engagement data has been collected across channels.
            </p>
          </Card>
        </>
      )}
    </div>
  );
};

export default Engagement;

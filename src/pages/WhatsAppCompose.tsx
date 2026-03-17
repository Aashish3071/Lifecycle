import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { campaignsApi } from "@/lib/api";
import { customersApi } from "@/lib/api";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Send,
  Eye,
  MessageCircle,
  Loader2,
} from "lucide-react";

const WhatsAppCompose = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [templateName, setTemplateName] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");

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
    mutationFn: () =>
      campaignsApi.createCampaign({
        channel: "whatsapp",
        subject: templateName,
        sent_count: getAudienceCount(),
      }),
    onSuccess: () => {
      toast.success("WhatsApp message sent!", { description: `Sent to ${getAudienceCount().toLocaleString()} recipients.` });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      navigate("/dashboard/whatsapp");
    },
    onError: () => toast.error("Failed to send message"),
  });

  const handleSend = () => {
    if (!templateName.trim()) return toast.error("Template name is required");
    if (!message.trim()) return toast.error("Message body is required");
    if (message.length > 1024) return toast.error("WhatsApp messages must be under 1024 characters");
    sendMutation.mutate();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/whatsapp")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">New WhatsApp Message</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Compose and send a WhatsApp message to your audience</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Compose form */}
        <div className="space-y-5">
          <Card className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="audience">Audience</Label>
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
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                placeholder="e.g. Cart Recovery Nudge"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="message">Message</Label>
                <span className={`text-[10px] ${message.length > 1024 ? "text-destructive" : "text-muted-foreground"}`}>
                  {message.length}/1024
                </span>
              </div>
              <Textarea
                id="message"
                placeholder="Hi {{name}}, we noticed you left something in your cart..."
                className="min-h-[180px] resize-y"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">
                Use {"{{name}}"} for customer name, {"{{product}}"} for product name
              </p>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigate("/dashboard/whatsapp")}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={sendMutation.isPending}
              className="gap-1.5"
            >
              {sendMutation.isPending ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
              ) : (
                <><Send className="w-3.5 h-3.5" /> Send Message</>
              )}
            </Button>
          </div>
        </div>

        {/* WhatsApp preview */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Eye className="w-4 h-4" /> Preview
          </div>

          <Card className="max-w-[320px] mx-auto overflow-hidden">
            {/* WhatsApp header */}
            <div className="bg-emerald-700 px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Your Business</p>
                <p className="text-[10px] text-white/70">Online</p>
              </div>
            </div>

            {/* Chat area */}
            <div className="bg-[#ECE5DD] dark:bg-[#0B141A] p-4 min-h-[250px] flex flex-col justify-end">
              {message ? (
                <div className="bg-white dark:bg-[#1F2C34] rounded-lg rounded-tl-none p-3 max-w-[90%] shadow-sm">
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {message}
                  </p>
                  <p className="text-[9px] text-muted-foreground text-right mt-1">Now</p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center italic">
                  Your message will appear here...
                </p>
              )}
            </div>

            <div className="bg-muted/50 px-4 py-2 border-t border-border">
              <p className="text-[10px] text-muted-foreground">
                Sending to {getAudienceCount().toLocaleString()} recipients
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppCompose;

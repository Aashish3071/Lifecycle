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
  Monitor,
  Smartphone,
  Mail,
  Loader2,
} from "lucide-react";

const EmailCompose = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("all");
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("desktop");

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
        channel: "email",
        subject,
        sent_count: getAudienceCount(),
      }),
    onSuccess: () => {
      toast.success("Email campaign sent!", { description: `Sent to ${getAudienceCount().toLocaleString()} recipients.` });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      navigate("/dashboard/email");
    },
    onError: () => toast.error("Failed to send campaign"),
  });

  const handleSend = () => {
    if (!subject.trim()) return toast.error("Subject line is required");
    if (!body.trim()) return toast.error("Email body is required");
    sendMutation.mutate();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/email")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">New Email Campaign</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Compose and send an email to your audience</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
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
              <Label htmlFor="subject">Subject Line</Label>
              <Input
                id="subject"
                placeholder="e.g. Your exclusive offer inside 🎁"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="body">Email Body</Label>
              <Textarea
                id="body"
                placeholder="Write your email content here..."
                className="min-h-[200px] resize-y"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigate("/dashboard/email")}>
              Cancel
            </Button>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSend}
                disabled={sendMutation.isPending}
                className="gap-1.5"
              >
                {sendMutation.isPending ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="w-3.5 h-3.5" /> Send Campaign</>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Preview panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" /> Preview
            </div>
            <div className="flex items-center gap-1 border border-border rounded-md p-0.5">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`p-1.5 rounded ${previewMode === "desktop" ? "bg-muted" : ""}`}
              >
                <Monitor className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`p-1.5 rounded ${previewMode === "mobile" ? "bg-muted" : ""}`}
              >
                <Smartphone className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <Card className={`overflow-hidden border-2 ${previewMode === "mobile" ? "max-w-[320px] mx-auto" : ""}`}>
            {/* Email preview */}
            <div className="bg-muted/50 px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="w-3 h-3" />
                <span className="font-medium text-foreground">{subject || "Subject line..."}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">From: noreply@lifecycle.io</p>
              <p className="text-[10px] text-muted-foreground">To: {getAudienceCount().toLocaleString()} recipients</p>
            </div>
            <div className="p-5 min-h-[200px]">
              {body ? (
                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {body}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Your email content will appear here...</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailCompose;

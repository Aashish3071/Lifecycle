import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { automationsApi } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  ShoppingCart,
  UserX,
  Gift,
  Heart,
  Mail,
  MessageCircle,
  TrendingUp,
  Clock,
  MoreVertical,
  Loader2,
} from "lucide-react";

// We use local icon mapping based on common automation names dynamically
const getIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('cart')) return ShoppingCart;
  if (n.includes('welcome')) return Gift;
  if (n.includes('win-back') || n.includes('dormant')) return UserX;
  if (n.includes('cross')) return Heart;
  return Clock;
};

const statusStyles = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  paused: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  draft: "bg-muted text-muted-foreground border-border",
};

const Automations = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: automations = [], isLoading } = useQuery({
    queryKey: ["automations"],
    queryFn: automationsApi.getAutomations,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'paused' | 'draft' }) =>
      automationsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
    },
    onError: () => {
      toast.error("Failed to update status");
    }
  });

  const toggleStatus = (id: string, currentStatus: string) => {
    if (updateStatus.isPending) return;
    const newStatus = currentStatus === "active" ? "paused" : "active";
    updateStatus.mutate({ id, status: newStatus as 'active' | 'paused' | 'draft' });
  };

  const totalSent = automations.reduce((a, f) => a + ((f as any).metrics?.sent || 0), 0);
  const totalConverted = automations.reduce((a, f) => a + ((f as any).metrics?.converted || 0), 0);
  const activeCount = automations.filter((f) => f.status === "active").length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Automations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage automated customer journey flows
          </p>
        </div>
        <Button
          onClick={() => navigate("/dashboard/automations/create")}
          className="gap-2"
          variant="default"
        >
          <Plus className="w-4 h-4" />
          Create Flow
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Flows</p>
          <p className="text-2xl font-bold text-foreground mt-1">{activeCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Sent</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalSent.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Conversions</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalConverted.toLocaleString()}</p>
        </Card>
      </div>

      {/* Automation list */}
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          {automations.map((flow) => {
            const f = flow as any;
            const FlowIcon = getIcon(f.name);
            const sent = f.metrics?.sent || 0;
            const converted = f.metrics?.converted || 0;
            const cRate = sent > 0 ? ((converted / sent) * 100).toFixed(1) : "0.0";
            const engRate = sent > 0 ? (((f.metrics?.engaged || 0) / sent) * 100).toFixed(1) : "0.0";
            
            return (
              <Card
                key={f.id}
                className="p-4 sm:p-5 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate("/dashboard/automations/create")}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Icon + info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FlowIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground text-sm">{f.name}</h3>
                        <Badge variant="outline" className={statusStyles[f.status as keyof typeof statusStyles]}>
                          {f.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{f.trigger_condition}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {f.channels?.map((ch: any) => (
                          <span key={ch} className="inline-flex items-center gap-1 text-xs text-muted-foreground capitalize">
                            {ch === "email" ? <Mail className="w-3 h-3" /> : <MessageCircle className="w-3 h-3" />}
                            {ch}
                          </span>
                        ))}
                        <span className="text-xs text-muted-foreground">· Created {formatDistanceToNow(new Date(f.created_at || ''), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-6 text-sm shrink-0">
                    <div className="text-center hidden md:block">
                      <p className="text-xs text-muted-foreground">Sent</p>
                      <p className="font-semibold text-foreground">{sent.toLocaleString()}</p>
                    </div>
                    <div className="text-center hidden md:block">
                      <p className="text-xs text-muted-foreground">Converted</p>
                      <p className="font-semibold text-foreground">{converted.toLocaleString()}</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-xs text-muted-foreground">Rate</p>
                      <p className="font-semibold text-foreground flex items-center gap-1 justify-center">
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        {cRate}%
                      </p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-xs text-muted-foreground">Engagement</p>
                      <p className="font-semibold text-foreground text-center">{engRate}%</p>
                    </div>
                    <Switch
                      checked={f.status === "active"}
                      disabled={updateStatus.isPending || f.status === "draft"}
                      onCheckedChange={(val) => {
                        toggleStatus(f.id, f.status);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0"
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Automations;

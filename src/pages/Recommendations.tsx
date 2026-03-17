import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recommendationsApi } from "@/lib/api";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  UserX,
  MessageCircle,
  Mail,
  RefreshCw,
  Eye,
  ArrowRight,
  Zap,
  Filter,
  CheckCircle2,
  Clock,
  Target,
  Users,
  CalendarClock,
  Loader2,
} from "lucide-react";

// The actual list is fetched dynamically from DB instead of statically.
// We preserve icon mapping locally for visual representation.
const recommendationIcons: Record<string, any> = {
  high: UserX,
  medium: CalendarClock,
  low: Eye,
};

const severityStyles = {
  high: "border-l-destructive bg-destructive/5",
  medium: "border-l-accent bg-accent/5",
  low: "border-l-primary bg-primary/5",
};

const severityBadge = {
  high: "destructive" as const,
  medium: "default" as const,
  low: "secondary" as const,
};

const channelIcon = {
  email: Mail,
  whatsapp: MessageCircle,
};

const Recommendations = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterChannel, setFilterChannel] = useState("all");

  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: recommendationsApi.getRecommendations,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'applied' | 'dismissed' }) => 
      recommendationsApi.updateRecommendationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      setSelected(new Set()); // clear selection on success
    },
  });

  const filtered = recommendations.filter((r) => {
    // Priority logic: mapping 1/2/3 back to hi/med/low purely for frontend filtering 
    const severityStr = 
      r.priority > 7 ? 'high' : 
      r.priority > 4 ? 'medium' : 'low';
      
    if (filterSeverity !== "all" && severityStr !== filterSeverity) return false;
    if (filterChannel !== "all" && r.suggested_channel !== filterChannel) return false;
    if (r.status !== 'pending') return false; // Hide applied/dismissed from the main feed
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkAction = (status: 'applied' | 'dismissed') => {
    if(selected.size === 0) return;
    const count = selected.size;
    
    // Fire sequentially or parallel promise all
    toast.promise(
      Promise.all(Array.from(selected).map(id => updateStatus.mutateAsync({ id, status }))),
      {
        loading: `Updating ${count} recommendations...`,
        success: `${count} recommendations marked as ${status}.`,
        error: "Failed to update recommendations"
      }
    );
  };

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((r) => r.id)));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Recommendations
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Actions suggested by your customer data — each linked to a specific metric and the next step to take.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-[130px] h-9 text-xs">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterChannel} onValueChange={setFilterChannel}>
            <SelectTrigger className="w-[130px] h-9 text-xs">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {selected.size} selected
            </span>
            <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => handleBulkAction('dismissed')} disabled={updateStatus.isPending}>
              Dismiss
            </Button>
            <Button size="sm" className="text-xs h-8" onClick={() => handleBulkAction('applied')} disabled={updateStatus.isPending}>
              Mark Applied
            </Button>
            <Button size="sm" variant="ghost" className="text-xs h-8 text-muted-foreground" onClick={() => setSelected(new Set())}>
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Select all */}
      <div className="flex items-center gap-2 px-1">
        <Checkbox
          checked={filtered.length > 0 && selected.size === filtered.length}
          onCheckedChange={selectAll}
        />
        <span className="text-xs text-muted-foreground">
          Select all ({filtered.length})
        </span>
      </div>

      {/* Recommendation Cards */}
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const channelStr = item.suggested_channel?.toLowerCase() || 'email';
            const ChannelIcon = channelIcon[channelStr as keyof typeof channelIcon] || Mail;
            
            const severityStr = 
              item.priority > 7 ? 'high' : 
              item.priority > 4 ? 'medium' : 'low';
            
            const RecIcon = recommendationIcons[severityStr] || ShoppingCart;

            return (
              <Card
                key={item.id}
                className={`border-l-4 ${severityStyles[severityStr as keyof typeof severityStyles]} p-0 overflow-hidden transition-shadow ${
                  selected.has(item.id) ? "ring-2 ring-accent/30" : ""
                }`}
              >
              <div className="flex items-start gap-4 px-4 py-4 sm:px-5">
                <div className="flex items-center gap-3 shrink-0 pt-0.5">
                  <Checkbox
                    checked={selected.has(item.id)}
                    onCheckedChange={() => toggleSelect(item.id)}
                  />
                  <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center border border-border">
                    <RecIcon className="w-5 h-5 text-foreground" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <Badge
                      variant={severityBadge[severityStr as keyof typeof severityBadge]}
                      className="text-[10px] px-1.5 py-0 capitalize"
                    >
                      {severityStr}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      <ChannelIcon className="w-3 h-3" />
                      {channelStr}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {item.explanation}
                  </p>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Target className="w-3 h-3 text-accent" />
                      <span className="font-bold text-foreground">Target Segment</span>
                      <span className="text-muted-foreground">{item.target_segment}</span>
                    </div>
                    {item.expected_impact && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <Zap className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Est. Impact: {item.expected_impact}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="default"
                  className="shrink-0 gap-1.5 hidden sm:flex"
                  onClick={() => navigate('/dashboard/automations')}
                >
                  {item.suggested_action}
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
              {/* Mobile action */}
              <div className="sm:hidden px-4 pb-4">
                <Button
                  size="sm"
                  variant="default"
                  className="w-full gap-1.5"
                  onClick={() => navigate('/dashboard/automations')}
                >
                  {item.suggested_action}
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          );
        })}

        {filtered.length === 0 && !isLoading && (
          <Card className="p-12 flex flex-col items-center text-center">
            <CheckCircle2 className="w-10 h-10 text-accent/30 mb-3" />
            <p className="text-sm font-medium text-foreground">All clear!</p>
            <p className="text-xs text-muted-foreground mt-1">
              No recommendations match your current filters.
            </p>
          </Card>
        )}
        </div>
      )}
    </div>
  );
};

export default Recommendations;

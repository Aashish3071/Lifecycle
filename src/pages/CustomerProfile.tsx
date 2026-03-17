import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { customersApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  ShoppingCart, 
  Eye, 
  CreditCard, 
  Activity, 
  AlertTriangle, 
  Loader2,
  Clock,
  TrendingUp,
  Award
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

const getEventIcon = (type: string) => {
  if (type.includes("purchase") || type.includes("order")) return CreditCard;
  if (type.includes("cart") || type.includes("checkout")) return ShoppingCart;
  if (type.includes("view") || type.includes("session")) return Eye;
  return Activity;
};

const CustomerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => customersApi.getCustomerProfile(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data?.customer) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Card className="p-8 text-center text-muted-foreground">
          <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
          <p>Customer not found or access denied.</p>
        </Card>
      </div>
    );
  }

  const { customer, metrics, events } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header string */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            {customer.name || customer.email || "Unknown Customer"}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
            {customer.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {customer.email}
              </span>
            )}
            {customer.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {customer.phone}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Since {format(new Date(customer.first_seen_at!), "MMM yyyy")}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats & Meta */}
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Key Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Lifecycle Stage</span>
                <Badge variant="outline" className="capitalize bg-primary/10 text-primary border-primary/20">
                  {metrics?.lifecycle_stage || 'Unknown'}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Total Orders</span>
                <span className="text-sm font-medium text-foreground">{metrics?.total_orders || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Lifetime Value</span>
                <span className="text-sm font-medium text-foreground">${(metrics?.clv || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Avg. Order Value</span>
                <span className="text-sm font-medium text-foreground">${(metrics?.aov || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Churn Risk Score</span>
                <span className={`text-sm font-medium flex items-center gap-1 ${(metrics?.churn_risk_score || 0) > 70 ? 'text-destructive' : 'text-emerald-500'}`}>
                  {((metrics?.churn_risk_score || 0) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-accent/5 border-accent/20">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-accent" /> AI Insights
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Based on recent activity, this customer is likely to respond to <strong>email campaigns</strong> featuring new arrivals. They show typical purchase patterns for end-of-month restocks.
            </p>
          </Card>
        </div>

        {/* Right Column: Event Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 pb-2">
            <h3 className="text-base font-semibold text-foreground mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Activity Timeline
            </h3>
            <p className="text-xs text-muted-foreground mb-6">Recent interactions across all channels</p>
            
            <div className="space-y-8 pl-2 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {events.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No recent events found.</p>
              ) : (
                events.map((event: any, idx: number) => {
                  const EventIcon = getEventIcon(event.event_type);
                  return (
                    <div key={event.id || idx} className="relative flex items-start justify-between">
                      <div className="absolute left-0 mt-1 md:left-1/2 w-8 h-8 flex items-center justify-center bg-card border-2 border-primary/20 rounded-full md:-ml-4 z-10">
                        <EventIcon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="w-full ml-12 md:ml-0 md:w-[45%] md:odd:text-right md:even:ml-auto">
                        <Card className="p-3 shadow-sm border-muted transition-colors hover:bg-muted/30">
                          <h4 className="text-sm font-semibold capitalize text-foreground">{event.event_type.replace(/_/g, ' ')}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                          </p>
                          {event.properties && Object.keys(event.properties).length > 0 && (
                            <div className="mt-2 text-xs bg-muted/50 p-2 rounded text-muted-foreground text-left overflow-x-auto">
                              <pre>{JSON.stringify(event.properties, null, 2)}</pre>
                            </div>
                          )}
                        </Card>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;

import { Card } from "@/components/ui/card";
import {
  Users,
  ShoppingCart,
  Mail,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  { label: "Total Customers", value: "12,847", change: "+12.3%", up: true, icon: Users },
  { label: "Orders This Month", value: "1,284", change: "+8.1%", up: true, icon: ShoppingCart },
  { label: "Emails Sent", value: "48,392", change: "+24.5%", up: true, icon: Mail },
  { label: "Revenue", value: "$184,293", change: "-2.4%", up: false, icon: TrendingUp },
];

const recentOrders = [
  { id: "#ORD-7291", customer: "Sarah Miller", product: "Premium Plan", amount: "$249.00", status: "Completed" },
  { id: "#ORD-7290", customer: "James Chen", product: "Starter Plan", amount: "$49.00", status: "Processing" },
  { id: "#ORD-7289", customer: "Emily Davis", product: "Growth Plan", amount: "$149.00", status: "Completed" },
  { id: "#ORD-7288", customer: "Michael Brown", product: "Premium Plan", amount: "$249.00", status: "Shipped" },
  { id: "#ORD-7287", customer: "Lisa Wang", product: "Starter Plan", amount: "$49.00", status: "Completed" },
];

const topCampaigns = [
  { name: "Spring Sale Announcement", sent: 12480, opened: "68%", clicked: "24%" },
  { name: "New Product Launch", sent: 8920, opened: "72%", clicked: "31%" },
  { name: "Win-back Series #3", sent: 3450, opened: "45%", clicked: "12%" },
];

const Dashboard = () => (
  <div className="max-w-6xl mx-auto space-y-8">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
      <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's what's happening.</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{s.label}</span>
            <s.icon className="w-4 h-4 text-muted-foreground/50" />
          </div>
          <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
          <div className="flex items-center gap-1 mt-1">
            {s.up ? (
              <ArrowUpRight className="w-3 h-3 text-accent" />
            ) : (
              <ArrowDownRight className="w-3 h-3 text-destructive" />
            )}
            <span className={`text-xs font-medium ${s.up ? "text-accent" : "text-destructive"}`}>
              {s.change}
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent orders */}
      <Card className="lg:col-span-2 p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Order</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Product</th>
                <th className="text-right px-5 py-3 font-medium">Amount</th>
                <th className="text-right px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground">{o.id}</td>
                  <td className="px-5 py-3 text-muted-foreground">{o.customer}</td>
                  <td className="px-5 py-3 text-muted-foreground">{o.product}</td>
                  <td className="px-5 py-3 text-right text-foreground">{o.amount}</td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        o.status === "Completed"
                          ? "bg-accent/10 text-accent"
                          : o.status === "Processing"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Top campaigns */}
      <Card className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Top Campaigns</h2>
        </div>
        <div className="divide-y divide-border">
          {topCampaigns.map((c) => (
            <div key={c.name} className="px-5 py-4 hover:bg-muted/30 transition-colors">
              <p className="text-sm font-medium text-foreground mb-2">{c.name}</p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>{c.sent.toLocaleString()} sent</span>
                <span>{c.opened} opened</span>
                <span>{c.clicked} clicked</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

export default Dashboard;

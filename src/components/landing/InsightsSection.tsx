import { motion } from "framer-motion";
import { AlertCircle, TrendingUp, UserCheck } from "lucide-react";

const cards = [
  {
    icon: AlertCircle,
    insight: "37 customers abandoned carts today.",
    action: "Send reminder email within 1 hour.",
    reason: "High purchase intent detected.",
    chartData: [20, 28, 18, 35, 37],
    chartColor: "hsl(14 90% 58%)",
    urgency: "Critical",
  },
  {
    icon: TrendingUp,
    insight: "21 customers are likely to reorder this week.",
    action: "Send reorder reminder with product suggestions.",
    reason: "Purchase cycle pattern detected.",
    chartData: [8, 12, 15, 18, 21],
    chartColor: "hsl(142 71% 45%)",
    urgency: "High",
  },
  {
    icon: UserCheck,
    insight: "12 high-value customers have not purchased in 60 days.",
    action: "Suggest a win-back campaign via email or WhatsApp.",
    reason: "Churn risk identified.",
    chartData: [30, 25, 20, 16, 12],
    chartColor: "hsl(38 92% 50%)",
    urgency: "Warning",
  },
];

const MiniChart = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 120;
  const height = 40;
  const padding = 2;

  const points = data.map((v, i) => ({
    x: padding + (i / (data.length - 1)) * (width - padding * 2),
    y: height - padding - ((v - min) / range) * (height - padding * 2),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#grad-${color.replace(/[^a-z0-9]/gi, "")})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={3} fill={color} />
    </svg>
  );
};

const urgencyColors: Record<string, string> = {
  Critical: "bg-destructive/10 text-destructive",
  High: "bg-accent/10 text-accent",
  Warning: "bg-[hsl(38_92%_50%)]/10 text-[hsl(38_92%_50%)]",
};

const InsightsSection = () => (
  <section className="py-24 md:py-32 bg-background">
    <div className="container mx-auto px-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
          Clear Marketing Actions, <span className="text-gradient">Not Just Reports</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <motion.div
            key={c.insight}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            className="group bg-card rounded-xl border border-border p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 hover:border-accent/30 transition-all duration-300 cursor-default"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <c.icon className="w-4 h-4 text-accent" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${urgencyColors[c.urgency]}`}>
                {c.urgency}
              </span>
            </div>

            <div className="mb-4">
              <MiniChart data={c.chartData} color={c.chartColor} />
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Insight</span>
                <p className="text-sm font-medium text-foreground mt-0.5">{c.insight}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">Recommended action</span>
                <p className="text-sm text-foreground mt-0.5">{c.action}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Reason</span>
                <p className="text-xs text-muted-foreground mt-0.5">{c.reason}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-center text-muted-foreground text-sm"
      >
        The system highlights the opportunities that matter most.
      </motion.p>
    </div>
  </section>
);

export default InsightsSection;

import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

const DashboardPlaceholder = () => {
  const location = useLocation();
  const pageName = location.pathname.split("/").pop() || "Page";
  const title = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">{title}</h1>
      <Card className="p-12 flex flex-col items-center justify-center text-center">
        <Construction className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <p className="text-lg font-medium text-foreground mb-1">Coming Soon</p>
        <p className="text-sm text-muted-foreground max-w-md">
          The {title.toLowerCase()} module is under development. Check back soon for updates.
        </p>
      </Card>
    </div>
  );
};

export default DashboardPlaceholder;

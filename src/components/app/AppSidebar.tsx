import {
  LayoutDashboard,
  Mail,
  Users,
  ShoppingCart,
  BarChart3,
  Megaphone,
  Workflow,
  Settings,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Campaigns", url: "/dashboard/campaigns", icon: Megaphone },
  { title: "Flows", url: "/dashboard/flows", icon: Workflow },
  { title: "Email Templates", url: "/dashboard/templates", icon: Mail },
];

const dataItems = [
  { title: "Customers", url: "/dashboard/customers", icon: Users },
  { title: "Orders", url: "/dashboard/orders", icon: ShoppingCart },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Segments", url: "/dashboard/segments", icon: Sparkles },
];

const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { onboardingComplete, onboardingDismissed } = useAuth();
  const location = useLocation();
  const showOnboardingBadge = !onboardingComplete && onboardingDismissed;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-4">
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <span className="font-display text-lg font-bold text-sidebar-foreground tracking-tight">
            {collapsed ? "L" : <>Lifecycle<span className="text-accent">.</span></>}
          </span>
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        {/* Onboarding nudge */}
        {showOnboardingBadge && (
          <div className="px-3 mb-2">
            <NavLink
              to="/onboarding"
              className="flex items-center gap-2 text-xs px-3 py-2 rounded-md bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
            >
              <ListChecks className="w-4 h-4" />
              {!collapsed && (
                <>
                  <span className="font-medium">Complete setup</span>
                  <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                    !
                  </Badge>
                </>
              )}
            </NavLink>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Data</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dataItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/dashboard/settings"
                className="hover:bg-sidebar-accent/50"
                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              >
                <Settings className="mr-2 h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

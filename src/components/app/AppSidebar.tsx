import {
  LayoutDashboard,
  Zap,
  Users,
  Workflow,
  Settings,
  ListChecks,
  Mail,
  MessageCircle,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
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

const coreItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Recommendations", url: "/dashboard/recommendations", icon: Zap },
  { title: "Audiences", url: "/dashboard/audiences", icon: Users },
  { title: "Automations", url: "/dashboard/automations", icon: Workflow },
];

const channelItems = [
  { title: "Email", url: "/dashboard/email", icon: Mail },
  { title: "WhatsApp", url: "/dashboard/whatsapp", icon: MessageCircle },
];

const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { onboardingComplete, onboardingDismissed } = useAuth();
  const showOnboardingBadge = !onboardingComplete && onboardingDismissed;

  const renderGroup = (label: string, items: typeof coreItems) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
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
  );

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
                  <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">!</Badge>
                </>
              )}
            </NavLink>
          </div>
        )}

        {renderGroup("Core", coreItems)}
        {renderGroup("Channels", channelItems)}
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

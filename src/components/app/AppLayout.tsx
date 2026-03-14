import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";

const AppLayout = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <AppTopbar />
        <main className="flex-1 bg-background p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  </SidebarProvider>
);

export default AppLayout;

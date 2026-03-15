import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import DashboardPlaceholder from "./pages/DashboardPlaceholder";
import Recommendations from "./pages/Recommendations";
import Audiences from "./pages/Audiences";
import ChurnRisk from "./pages/ChurnRisk";
import Automations from "./pages/Automations";
import CampaignBuilder from "./pages/CampaignBuilder";
import Email from "./pages/Email";
import WhatsApp from "./pages/WhatsApp";
import Campaigns from "./pages/Campaigns";
import Engagement from "./pages/Engagement";
import AppLayout from "./components/app/AppLayout";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="recommendations" element={<Recommendations />} />
              <Route path="audiences" element={<Audiences />} />
              <Route path="automations" element={<Automations />} />
              <Route path="automations/create" element={<CampaignBuilder />} />
              <Route path="email" element={<DashboardPlaceholder />} />
              <Route path="whatsapp" element={<DashboardPlaceholder />} />
              <Route path="campaigns" element={<DashboardPlaceholder />} />
              <Route path="churn" element={<ChurnRisk />} />
              <Route path="engagement" element={<DashboardPlaceholder />} />
              <Route path="settings" element={<DashboardPlaceholder />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

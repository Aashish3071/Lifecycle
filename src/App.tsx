import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UserSetup from "./pages/UserSetup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Recommendations from "./pages/Recommendations";
import Audiences from "./pages/Audiences";
import Automations from "./pages/Automations";
import Campaigns from "./pages/Campaigns";
import CampaignBuilder from "./pages/CampaignBuilder";
import Email from "./pages/Email";
import EmailCompose from "./pages/EmailCompose";
import WhatsApp from "./pages/WhatsApp";
import WhatsAppCompose from "./pages/WhatsAppCompose";
import Settings from "./pages/Settings";
import CustomerProfile from "./pages/CustomerProfile";
import AppLayout from "./components/app/AppLayout";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const SetupGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, setupComplete } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!setupComplete) return <Navigate to="/setup" replace />;
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
            <Route path="/setup" element={<ProtectedRoute><UserSetup /></ProtectedRoute>} />
            <Route path="/onboarding" element={<SetupGuard><Onboarding /></SetupGuard>} />
            <Route path="/dashboard" element={<SetupGuard><AppLayout /></SetupGuard>}>
              <Route index element={<Dashboard />} />
              <Route path="recommendations" element={<Recommendations />} />
              <Route path="audiences" element={<Audiences />} />
              <Route path="automations" element={<Automations />} />
              <Route path="automations/create" element={<CampaignBuilder />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="email" element={<Email />} />
              <Route path="email/compose" element={<EmailCompose />} />
              <Route path="whatsapp" element={<WhatsApp />} />
              <Route path="whatsapp/compose" element={<WhatsAppCompose />} />
              <Route path="settings" element={<Settings />} />
              <Route path="customers/:id" element={<CustomerProfile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

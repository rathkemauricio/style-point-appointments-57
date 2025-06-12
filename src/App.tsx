import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth Provider
import { AuthProvider } from "./hooks/use-auth";
import { SettingsProvider } from "./hooks/use-settings";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import AgendaPage from "./pages/AgendaPage";
import AppointmentBookingPage from "./pages/AppointmentBookingPage";
import ServicesPage from "./pages/ServicesPage";
import StatsPage from "./pages/StatsPage";
import ConfigPage from "./pages/ConfigPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

// Portal Pages
import PortalPage from "./pages/portal/PortalPage";
import PortalAgendaPage from "./pages/portal/PortalAgendaPage";
import PortalServicesPage from "./pages/portal/PortalServicesPage";
import PortalRevenuePage from "./pages/portal/PortalRevenuePage";
import PortalCustomersPage from "./pages/portal/PortalCustomersPage";
import PortalReviewsPage from "./pages/portal/PortalReviewsPage";

// Admin Pages
import WhiteLabelConfigPage from "./pages/admin/WhiteLabelConfigPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <AuthProvider>
          <SettingsProvider>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/agenda" element={<AgendaPage />} />
              <Route path="/agendar" element={<AppointmentBookingPage />} />
              <Route path="/servicos" element={<ServicesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/config" element={<ConfigPage />} />

              {/* Rotas protegidas - Portal do Profissional */}
              <Route path="/portal" element={
                <ProtectedRoute requiredRole="professional">
                  <PortalPage />
                </ProtectedRoute>
              } />
              <Route path="/portal/agenda" element={
                <ProtectedRoute requiredRole="professional">
                  <PortalAgendaPage />
                </ProtectedRoute>
              } />
              <Route path="/portal/services" element={
                <ProtectedRoute requiredRole="professional">
                  <PortalServicesPage />
                </ProtectedRoute>
              } />
              <Route path="/portal/revenue" element={
                <ProtectedRoute requiredRole="professional">
                  <PortalRevenuePage />
                </ProtectedRoute>
              } />
              <Route path="/portal/customers" element={
                <ProtectedRoute requiredRole="professional">
                  <PortalCustomersPage />
                </ProtectedRoute>
              } />
              <Route path="/portal/reviews" element={
                <ProtectedRoute requiredRole="professional">
                  <PortalReviewsPage />
                </ProtectedRoute>
              } />

              {/* Rotas de administração */}
              <Route path="/admin/white-label" element={
                <ProtectedRoute requiredRole="admin">
                  <WhiteLabelConfigPage />
                </ProtectedRoute>
              } />

              {/* Rotas de estatísticas */}
              <Route path="/estatisticas" element={<StatsPage />} />

              {/* Rota 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

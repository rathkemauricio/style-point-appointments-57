
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth Provider
import { AuthProvider } from "./hooks/use-auth";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import AgendaPage from "./pages/AgendaPage";
import AppointmentBookingPage from "./pages/AppointmentBookingPage";
import ServicesPage from "./pages/ServicesPage";
import StatsPage from "./pages/StatsPage";
import LoginPage from "./pages/LoginPage";
import PortalPage from "./pages/portal/PortalPage";
import NotFound from "./pages/NotFound";

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
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/agendar" element={<AppointmentBookingPage />} />
            <Route path="/servicos" element={<ServicesPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rotas protegidas - Portal do Profissional */}
            <Route path="/portal" element={
              <ProtectedRoute requiredRole="professional">
                <PortalPage />
              </ProtectedRoute>
            } />
            
            {/* Rotas de estatísticas */}
            <Route path="/estatisticas" element={<StatsPage />} />
            
            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

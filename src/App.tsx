
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/use-auth';
import { SettingsProvider } from './hooks/use-settings';
import { Toaster } from './components/ui/sonner';
import ProtectedRoute from './components/ProtectedRoute';
import PermissionGuard from './components/PermissionGuard';

// Pages
import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import ServicesPage from './pages/ServicesPage';
import AppointmentBookingPage from './pages/AppointmentBookingPage';
import AppointmentsPage from './pages/AppointmentsPage';
import AgendaPage from './pages/AgendaPage';
import StatsPage from './pages/StatsPage';
import ConfigPage from './pages/ConfigPage';
import NotFound from './pages/NotFound';

// Portal Pages
import PortalPage from './pages/portal/PortalPage';
import PortalAgendaPage from './pages/portal/PortalAgendaPage';
import PortalCustomersPage from './pages/portal/PortalCustomersPage';
import PortalServicesPage from './pages/portal/PortalServicesPage';
import PortalRevenuePage from './pages/portal/PortalRevenuePage';
import PortalReviewsPage from './pages/portal/PortalReviewsPage';

// Admin Pages
import WhiteLabelConfigPage from './pages/admin/WhiteLabelConfigPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/booking" element={<AppointmentBookingPage />} />
                
                <Route path="/appointments" element={
                  <ProtectedRoute>
                    <AppointmentsPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/agenda" element={
                  <ProtectedRoute>
                    <AgendaPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/stats" element={
                  <ProtectedRoute>
                    <PermissionGuard requiredPermission="view_stats">
                      <StatsPage />
                    </PermissionGuard>
                  </ProtectedRoute>
                } />
                
                <Route path="/config" element={
                  <ProtectedRoute>
                    <ConfigPage />
                  </ProtectedRoute>
                } />
                
                {/* Portal Routes */}
                <Route path="/portal" element={
                  <ProtectedRoute>
                    <PermissionGuard requiredPermission="access_portal">
                      <PortalPage />
                    </PermissionGuard>
                  </ProtectedRoute>
                } />
                
                <Route path="/portal/agenda" element={
                  <ProtectedRoute>
                    <PermissionGuard requiredPermission="access_portal">
                      <PortalAgendaPage />
                    </PermissionGuard>
                  </ProtectedRoute>
                } />
                
                <Route path="/portal/customers" element={
                  <ProtectedRoute>
                    <PermissionGuard requiredPermission="access_portal">
                      <PortalCustomersPage />
                    </PermissionGuard>
                  </ProtectedRoute>
                } />
                
                <Route path="/portal/services" element={
                  <ProtectedRoute>
                    <PermissionGuard requiredPermission="access_portal">
                      <PortalServicesPage />
                    </PermissionGuard>
                  </ProtectedRoute>
                } />
                
                <Route path="/portal/revenue" element={
                  <ProtectedRoute>
                    <PermissionGuard requiredPermission="access_portal">
                      <PortalRevenuePage />
                    </PermissionGuard>
                  </ProtectedRoute>
                } />
                
                <Route path="/portal/reviews" element={
                  <ProtectedRoute>
                    <PermissionGuard requiredPermission="access_portal">
                      <PortalReviewsPage />
                    </PermissionGuard>
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin/white-label" element={
                  <ProtectedRoute>
                    <PermissionGuard requiredPermission="admin_access">
                      <WhiteLabelConfigPage />
                    </PermissionGuard>
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              <Toaster />
            </div>
          </Router>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

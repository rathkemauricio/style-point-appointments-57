
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Settings } from "lucide-react";

import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingActionButton from '../components/FloatingActionButton';
import PermissionGuard from '../components/PermissionGuard';
import ServiceCard from '../components/ServiceCard';
import serviceService from '../services/service.service';
import { usePermissions } from '../hooks/use-permissions';

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { hasPermission, canManageServices } = usePermissions();
  
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceService.getServices(),
    enabled: hasPermission('view_services')
  });

  // Group services by category
  const servicesByCategory: Record<string, typeof services> = {};
  services.forEach(service => {
    const category = service.category || 'Outros';
    if (!servicesByCategory[category]) {
      servicesByCategory[category] = [];
    }
    servicesByCategory[category].push(service);
  });
  
  const handleNewService = () => {
    navigate('/servicos/novo');
  };

  // Check if user has permission to view services
  if (!hasPermission('view_services')) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Serviços" showBackButton={true} />
        <div className="flex-1 page-container flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
            <p className="text-gray-600">Você não tem permissão para visualizar os serviços.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Nossos Serviços" 
        showBackButton={true}
        rightAction={
          <PermissionGuard permission="create_service">
            <button 
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => navigate('/servicos/gerenciar')}
            >
              <Settings size={20} className="text-primary" />
            </button>
          </PermissionGuard>
        }
      />
      
      <div className="flex-1 page-container">
        {Object.keys(servicesByCategory).map(category => (
          <div key={category} className="mb-6">
            <h2 className="text-lg font-semibold text-primary mb-3">{category}</h2>
            
            {servicesByCategory[category].map(service => (
              <ServiceCard 
                key={service.id} 
                service={service}
                selectable={true}
                onSelect={() => navigate(`/servicos/${service.id}`)}
              />
            ))}
          </div>
        ))}
        
        {services.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500">Nenhum serviço cadastrado</p>
            <PermissionGuard permission="create_service">
              <button
                className="mt-4 text-primary hover:text-primary/80 transition-colors"
                onClick={handleNewService}
              >
                Cadastrar serviços
              </button>
            </PermissionGuard>
          </div>
        )}
      </div>
      
      <PermissionGuard permission="create_service">
        <FloatingActionButton
          onClick={handleNewService}
          icon={<Plus size={24} />}
        />
      </PermissionGuard>
      
      <Footer />
    </div>
  );
};

export default ServicesPage;

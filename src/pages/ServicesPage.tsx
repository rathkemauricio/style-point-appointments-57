
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Settings } from "lucide-react";

import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingActionButton from '../components/FloatingActionButton';
import ServiceCard from '../components/ServiceCard';
import serviceService from '../services/service.service';
import { useAuth } from '../hooks/use-auth';
import { Service } from '../models/service.model';

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  // Admins podem gerenciar serviços (ver botões extra); barbeiros podem apenas visualizar, clientes/anônimos só veem listagem
  const isAdmin = user?.role === "admin";
  const isProfessional = user?.role === "professional";

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceService.getServices()
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

  const handleRedirectToBooking = (service: Service) => {
    // Redireciona para a página de agendamento com o serviço pré-selecionado
    navigate('/agendar', {
      state: {
        preselectedService: service
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Nossos Serviços"
        showBackButton={true}
        rightAction={
          isAdmin ? (
            <button
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => navigate('/servicos/gerenciar')}
            >
              <Settings size={20} className="text-primary" />
            </button>
          ) : null
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
                onRedirectToBooking={handleRedirectToBooking}
              />
            ))}
          </div>
        ))}

        {services.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500">Nenhum serviço cadastrado</p>
            {isAdmin && (
              <button
                className="mt-4 text-primary hover:text-primary/80 transition-colors"
                onClick={handleNewService}
              >
                Cadastrar serviços
              </button>
            )}
          </div>
        )}
      </div>

      {isAdmin && (
        <FloatingActionButton
          onClick={handleNewService}
          icon={<Plus size={24} />}
        />
      )}

      <Footer />
    </div>
  );
};

export default ServicesPage;

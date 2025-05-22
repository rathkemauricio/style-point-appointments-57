
import React from 'react';
import { useNavigate } from 'react-router-dom';
import appConfig from '../config/appConfig';
import MapLocation from '../components/MapLocation';
import FloatingActionButton from '../components/FloatingActionButton';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import { useQuery } from '@tanstack/react-query';
import serviceService from '../services/service.service';

const Index = () => {
  const navigate = useNavigate();
  
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceService.getServices()
  });

  const handleNewAppointment = () => {
    navigate('/agendar');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Barbershop Image */}
      <div className="relative w-full h-48">
        <img 
          src={appConfig.business.coverImageUrl} 
          alt={appConfig.business.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h1 className="text-2xl font-bold text-white">{appConfig.business.name}</h1>
          <p className="text-white/90 text-sm">{appConfig.business.address}</p>
        </div>
      </div>
      
      <div className="flex-1 page-container">
        {/* Business Info */}
        <div className="mb-6">
          <p className="text-barber-dark/80">{appConfig.business.description}</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="mr-3 text-barber-dark/70">{appConfig.business.openHours}</span>
            <span className="text-barber-dark/70">{appConfig.business.phone}</span>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            className="btn-primary flex-1"
            onClick={handleNewAppointment}
          >
            Agendar Agora
          </button>
          <button 
            className="btn-secondary flex-1"
            onClick={() => navigate('/servicos')}
          >
            Nossos Serviços
          </button>
        </div>
        
        {/* Featured Services */}
        <div className="section-spacing">
          <h2 className="title-medium mb-3">Serviços Populares</h2>
          {services.slice(0, 2).map(service => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              selectable={true}
              onSelect={() => navigate(`/servicos/${service.id}`)}
            />
          ))}
          {services.length > 2 && (
            <button 
              className="w-full text-center py-2 text-barber-accent hover:underline"
              onClick={() => navigate('/servicos')}
            >
              Ver todos os serviços
            </button>
          )}
        </div>
        
        {/* Location Map */}
        <div className="section-spacing">
          <h2 className="title-medium mb-3">Nossa Localização</h2>
          <MapLocation 
            latitude={appConfig.business.latitude}
            longitude={appConfig.business.longitude}
          />
        </div>
      </div>
      
      {/* Floating Action Button for quick scheduling */}
      <FloatingActionButton onClick={handleNewAppointment} />
      
      {/* Footer Navigation */}
      <Footer />
    </div>
  );
};

export default Index;

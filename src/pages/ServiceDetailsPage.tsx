
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import serviceService from '@/services/service.service';
import { formatCurrency } from '@/utils/formatUtils';

const ServiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', id],
    queryFn: () => serviceService.getServiceById(id!),
    enabled: !!id,
  });

  const handleBookService = () => {
    navigate('/agendar', { state: { preSelectedService: service } });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Carregando..." showBackButton={true} />
        <div className="flex-1 page-container flex items-center justify-center">
          <p>Carregando detalhes do serviço...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Serviço não encontrado" showBackButton={true} />
        <div className="flex-1 page-container flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Serviço não encontrado</p>
            <Button onClick={() => navigate('/servicos')}>
              Voltar aos serviços
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={service.name} showBackButton={true} />
      
      <div className="flex-1 page-container py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-primary mb-2">{service.name}</h1>
              <p className="text-gray-600 mb-2">{service.description}</p>
              {service.category && (
                <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                  {service.category}
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(service.price)}
              </p>
              <p className="text-gray-500 text-sm">{service.duration} min</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Detalhes do Serviço</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Duração:</span>
                <p>{service.duration} minutos</p>
              </div>
              <div>
                <span className="text-gray-500">Preço:</span>
                <p>{formatCurrency(service.price)}</p>
              </div>
              {service.category && (
                <div>
                  <span className="text-gray-500">Categoria:</span>
                  <p>{service.category}</p>
                </div>
              )}
              <div>
                <span className="text-gray-500">Status:</span>
                <p className={service.isActive ? 'text-green-600' : 'text-red-600'}>
                  {service.isActive ? 'Ativo' : 'Inativo'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleBookService}
            className="w-full"
            disabled={!service.isActive}
          >
            {service.isActive ? 'Agendar este Serviço' : 'Serviço Indisponível'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/servicos')}
            className="w-full"
          >
            Ver Todos os Serviços
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ServiceDetailsPage;

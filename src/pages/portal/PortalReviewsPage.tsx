
import React, { useState } from 'react';
import { format, subMonths, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Star, MessageCircle } from 'lucide-react';

import AuthHeader from '../../components/AuthHeader';
import Footer from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

// Mock de avaliações para desenvolvimento
const mockReviews = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Maria Oliveira',
    rating: 5,
    comment: 'Atendimento excelente! O corte ficou perfeito e o ambiente é muito agradável.',
    date: '2025-05-10',
    appointmentId: '101',
    serviceId: '1',
    serviceName: 'Corte de Cabelo'
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'João Paulo',
    rating: 4,
    comment: 'Bom atendimento, recomendo. Só demorou um pouco mais que o esperado.',
    date: '2025-05-08',
    appointmentId: '102',
    serviceId: '3',
    serviceName: 'Corte + Barba'
  },
  {
    id: '3',
    customerId: '1',
    customerName: 'Maria Oliveira',
    rating: 5,
    comment: 'Como sempre, serviço impecável!',
    date: '2025-05-01',
    appointmentId: '103',
    serviceId: '2',
    serviceName: 'Barba'
  },
  {
    id: '4',
    customerId: '3',
    customerName: 'Carlos Silva',
    rating: 3,
    comment: 'O corte ficou bom, mas achei o preço um pouco alto.',
    date: '2025-04-25',
    appointmentId: '104',
    serviceId: '1',
    serviceName: 'Corte de Cabelo'
  },
  {
    id: '5',
    customerId: '4',
    customerName: 'Ana Ferreira',
    rating: 5,
    comment: 'Adorei o resultado! Vou voltar com certeza.',
    date: '2025-04-20',
    appointmentId: '105',
    serviceId: '4',
    serviceName: 'Tingimento'
  }
];

const PortalReviewsPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterRating, setFilterRating] = useState<string>('all');
  
  // Navegação entre meses
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const formatMonth = (date: Date) => {
    return format(date, 'MMMM yyyy', { locale: ptBR });
  };
  
  // Filtrar avaliações por mês
  const filterByMonth = (reviews: typeof mockReviews) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    return reviews.filter(review => {
      const reviewDate = new Date(review.date);
      return reviewDate.getFullYear() === year && reviewDate.getMonth() === month;
    });
  };
  
  // Filtrar avaliações por classificação
  const filterByRating = (reviews: typeof mockReviews) => {
    if (filterRating === 'all') return reviews;
    
    const rating = parseInt(filterRating);
    return reviews.filter(review => review.rating === rating);
  };
  
  // Aplicar todos os filtros
  const filteredReviews = filterByRating(filterByMonth(mockReviews));
  
  // Calcular média de avaliações
  const calculateAverageRating = (reviews: typeof mockReviews) => {
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };
  
  const averageRating = calculateAverageRating(filteredReviews);
  
  // Contagem de avaliações por estrela
  const ratingCounts = filteredReviews.reduce(
    (acc, review) => {
      acc[review.rating - 1]++;
      return acc;
    },
    [0, 0, 0, 0, 0]
  );
  
  // Total de avaliações
  const totalReviews = filteredReviews.length;
  
  // Renderizar estrelas
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader title="Avaliações" />
      
      <div className="flex-1 page-container py-6">
        {/* Controles de navegação e filtro */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={goToPreviousMonth}
            >
              <ChevronLeft size={18} />
            </Button>
            
            <div className="text-lg font-semibold">{formatMonth(currentDate)}</div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={goToNextMonth}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
          
          <Select
            value={filterRating}
            onValueChange={setFilterRating}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estrelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as avaliações</SelectItem>
              <SelectItem value="5">5 estrelas</SelectItem>
              <SelectItem value="4">4 estrelas</SelectItem>
              <SelectItem value="3">3 estrelas</SelectItem>
              <SelectItem value="2">2 estrelas</SelectItem>
              <SelectItem value="1">1 estrela</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Resumo de avaliações */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex flex-col items-center mb-4 md:mb-0">
                <div className="text-4xl font-bold mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex mb-1">
                  {renderStars(Math.round(averageRating))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'}
                </div>
              </div>
              
              <div className="w-full md:w-2/3">
                {[5, 4, 3, 2, 1].map(stars => {
                  const count = ratingCounts[stars - 1];
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  
                  return (
                    <div key={stars} className="flex items-center mb-1">
                      <div className="flex items-center mr-2">
                        <span className="text-sm mr-1">{stars}</span>
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-yellow-400 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="ml-2 text-xs text-muted-foreground w-8 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Lista de avaliações */}
        {filteredReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <MessageCircle size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500">Nenhuma avaliação encontrada para este período</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map(review => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{review.customerName}</h3>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(review.date), 'dd/MM/yyyy')} • {review.serviceName}
                      </p>
                    </div>
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-sm">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default PortalReviewsPage;

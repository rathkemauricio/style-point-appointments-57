import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

import AuthHeader from '../../components/AuthHeader';
import Footer from '../../components/Footer';
import ServiceCard from '../../components/ServiceCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import serviceService from '../../services/service.service';
import { Service } from '../../models/service.model';
import { useToast } from '../../hooks/use-toast';

// Formulário de criação/edição de serviço
const serviceFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Preço deve ser maior ou igual a zero'),
  durationMinutes: z.coerce.number().min(5, 'Duração mínima de 5 minutos'),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean().default(true)
}).required();

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

const PortalServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Buscar serviços
  const { 
    data: services = [], 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['professional-services'],
    queryFn: () => serviceService.getServices()
  });
  
  // Formulário
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      durationMinutes: 30,
      category: '',
      imageUrl: '',
      isActive: true
    },
  });
  
  // Filtrar serviços pela busca
  const filteredServices = searchTerm 
    ? services.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : services;
  
  // Agrupar serviços por categoria
  const servicesByCategory: Record<string, Service[]> = {};
  filteredServices.forEach(service => {
    const category = service.category || 'Outros';
    if (!servicesByCategory[category]) {
      servicesByCategory[category] = [];
    }
    servicesByCategory[category].push(service);
  });
  
  // Abrir modal para editar serviço
  const handleEditService = (service: Service) => {
    setEditingService(service);
    form.reset({
      name: service.name,
      description: service.description || '',
      price: service.price,
      durationMinutes: service.durationMinutes,
      category: service.category || '',
      imageUrl: service.imageUrl || '',
    });
    setIsDialogOpen(true);
  };
  
  // Abrir modal para criar novo serviço
  const handleNewService = () => {
    setEditingService(null);
    form.reset({
      name: '',
      description: '',
      price: 0,
      durationMinutes: 30,
      category: '',
      imageUrl: '',
    });
    setIsDialogOpen(true);
  };
  
  // Salvar serviço
  const onSubmit = async (data: ServiceFormValues) => {
    try {
      if (editingService) {
        // Atualizar serviço existente
        await serviceService.updateService(editingService.id, data);
        toast({
          title: "Serviço atualizado",
          description: "Serviço foi atualizado com sucesso",
        });
      } else {
        // Criar novo serviço
        const serviceData = {
          name: data.name,
          price: data.price,
          durationMinutes: data.durationMinutes,
          isActive: true,
          description: data.description,
          imageUrl: data.imageUrl,
          category: data.category
        };
        await serviceService.createService(serviceData);
        toast({
          title: "Serviço criado",
          description: "Novo serviço foi criado com sucesso",
        });
      }
      
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o serviço",
        variant: "destructive",
      });
    }
  };
  
  // Excluir serviço
  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await serviceService.deleteService(serviceId);
        toast({
          title: "Serviço excluído",
          description: "Serviço foi excluído com sucesso",
        });
        refetch();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir o serviço",
          variant: "destructive",
        });
      }
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader title="Meus Serviços" />
      
      <div className="flex-1 page-container py-6">
        {/* Barra de pesquisa e botão de adicionar */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input 
              placeholder="Buscar serviços..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button onClick={handleNewService}>
            <Plus size={16} className="mr-2" /> Novo Serviço
          </Button>
        </div>
        
        {/* Lista de serviços agrupados por categoria */}
        {isLoading ? (
          <div className="flex justify-center p-8">
            <p>Carregando serviços...</p>
          </div>
        ) : Object.keys(servicesByCategory).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500">Nenhum serviço encontrado</p>
          </div>
        ) : (
          Object.keys(servicesByCategory).map(category => (
            <div key={category} className="mb-6">
              <h2 className="text-lg font-semibold mb-3">{category}</h2>
              
              <div className="space-y-4">
                {servicesByCategory[category].map(service => (
                  <div key={service.id} className="flex items-center">
                    <div className="flex-1">
                      <ServiceCard 
                        service={service}
                        selectable={false}
                      />
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEditService(service)}
                      >
                        <Edit size={16} />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Modal de criação/edição de serviço */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Editar Serviço' : 'Novo Serviço'}
            </DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para {editingService ? 'editar o' : 'criar um novo'} serviço.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do serviço" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Descrição do serviço" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Duração (minutos)</FormLabel>
                      <FormControl>
                        <Input type="number" min="5" step="5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Input placeholder="Categoria do serviço" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da imagem</FormLabel>
                    <FormControl>
                      <Input placeholder="URL da imagem" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default PortalServicesPage;


import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Search, UserPlus, Phone, Calendar, User, MoreHorizontal } from 'lucide-react';

import AuthHeader from '../../components/AuthHeader';
import Footer from '../../components/Footer';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';

import customerService from '../../services/customer.service';
import appointmentService from '../../services/appointment.service';
import { Customer } from '../../models/customer.model';
import { Appointment } from '../../models/appointment.model';
import { useToast } from '../../hooks/use-toast';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Validação para o formulário de cliente
const customerFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  birthdate: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

const PortalCustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  
  // Buscar todos os clientes
  const { 
    data: customers = [], 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customerService.getCustomers()
  });
  
  // Buscar agendamentos do cliente selecionado
  const { data: customerAppointments = [] } = useQuery({
    queryKey: ['customer-appointments', selectedCustomer?.id],
    queryFn: () => appointmentService.getAppointmentsByCustomer(selectedCustomer?.id || ''),
    enabled: !!selectedCustomer,
  });
  
  // Formulário
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      birthdate: '',
      notes: '',
    },
  });
  
  // Filtrar clientes
  const filteredCustomers = searchTerm
    ? customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : customers;
  
  // Filtrar clientes por lealdade
  const filterCustomersByLoyalty = () => {
    switch (selectedTab) {
      case 'new':
        return filteredCustomers.filter(c => c.totalAppointments && c.totalAppointments <= 1);
      case 'regular':
        return filteredCustomers.filter(c => c.totalAppointments && c.totalAppointments >= 2 && c.totalAppointments <= 5);
      case 'loyal':
        return filteredCustomers.filter(c => c.totalAppointments && c.totalAppointments > 5);
      default:
        return filteredCustomers;
    }
  };
  
  const displayedCustomers = filterCustomersByLoyalty();
  
  // Abrir modal para editar cliente
  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    form.reset({
      name: customer.name,
      phone: customer.phone || '',
      email: customer.email || '',
      birthdate: customer.birthdate || '',
      notes: customer.notes || '',
    });
    setIsDialogOpen(true);
  };
  
  // Abrir modal para criar novo cliente
  const handleNewCustomer = () => {
    setSelectedCustomer(null);
    form.reset({
      name: '',
      phone: '',
      email: '',
      birthdate: '',
      notes: '',
    });
    setIsDialogOpen(true);
  };
  
  // Ver detalhes do cliente
  const handleViewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
  };
  
  // Salvar cliente
  const onSubmit = async (data: CustomerFormValues) => {
    try {
      if (selectedCustomer) {
        // Atualizar cliente existente
        await customerService.updateCustomer(selectedCustomer.id, data);
        toast({
          title: "Cliente atualizado",
          description: "Cliente foi atualizado com sucesso",
        });
      } else {
        // Criar novo cliente
        await customerService.createCustomer(data);
        toast({
          title: "Cliente criado",
          description: "Novo cliente foi criado com sucesso",
        });
      }
      
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o cliente",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader title="Clientes" />
      
      <div className="flex-1 page-container py-6">
        {/* Controles de busca e adição */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input 
              placeholder="Buscar clientes..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button onClick={handleNewCustomer}>
            <UserPlus size={16} className="mr-2" /> Novo Cliente
          </Button>
        </div>
        
        {/* Filtros de clientes */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="new">Novos</TabsTrigger>
            <TabsTrigger value="regular">Regulares</TabsTrigger>
            <TabsTrigger value="loyal">Fiéis</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Lista de clientes */}
        {isLoading ? (
          <div className="flex justify-center p-8">
            <p>Carregando clientes...</p>
          </div>
        ) : displayedCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500">Nenhum cliente encontrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedCustomers.map(customer => (
              <Card key={customer.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      {customer.phone && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone size={12} className="mr-1" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">Atendimentos</span>
                      <p className="font-medium">{customer.totalAppointments || 0}</p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewCustomerDetails(customer)}>
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/agendar?customerId=${customer.id}`)}>
                          Agendar serviço
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {selectedCustomer?.id === customer.id && (
                  <div className="mt-4 border-t pt-4">
                    <h3 className="text-sm font-semibold mb-3">Histórico de Atendimentos</h3>
                    
                    {customerAppointments.length > 0 ? (
                      <div className="space-y-2 max-h-56 overflow-y-auto">
                        {customerAppointments.map(appointment => (
                          <div key={appointment.id} className="flex items-center justify-between p-2 border rounded-md">
                            <div>
                              <div className="flex items-center">
                                <Calendar size={14} className="mr-1 text-muted-foreground" />
                                <span className="text-sm">
                                  {format(new Date(appointment.date), 'dd/MM/yyyy')} às {appointment.startTime}
                                </span>
                              </div>
                              <p className="text-sm font-medium">
                                {appointment.services.map(s => s.name).join(', ')}
                              </p>
                            </div>
                            <span className="text-sm font-bold">
                              R$ {appointment.totalPrice.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Nenhum atendimento registrado.
                      </p>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal de criação/edição de cliente */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCustomer ? 'Editar Cliente' : 'Novo Cliente'}
            </DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para {selectedCustomer ? 'editar o' : 'adicionar um novo'} cliente.
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
                      <Input placeholder="Nome do cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento (opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Preferências, observações..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{selectedCustomer ? 'Atualizar' : 'Criar'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default PortalCustomersPage;

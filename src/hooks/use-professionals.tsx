import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Professional } from '../models/professional.model';
import professionalService from '../services/professional.service';
import { useToast } from './use-toast';

export const useProfessionals = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: professionals = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['professionals'],
    queryFn: () => professionalService.getAllProfessionals(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const createProfessionalMutation = useMutation({
    mutationFn: (professionalData: Omit<Professional, 'id'>) => 
      professionalService.createProfessional(professionalData),
    onSuccess: (newProfessional) => {
      queryClient.setQueryData(['professionals'], (oldProfessionals: Professional[] = []) => 
        [...oldProfessionals, newProfessional]
      );
      toast({
        title: "Profissional criado",
        description: "Novo profissional foi criado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar profissional: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateProfessionalMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Professional> }) => 
      professionalService.updateProfessional(id, data),
    onSuccess: (updatedProfessional) => {
      queryClient.setQueryData(['professionals'], (oldProfessionals: Professional[] = []) =>
        oldProfessionals.map(professional => 
          professional.id === updatedProfessional.id ? updatedProfessional : professional
        )
      );
      toast({
        title: "Profissional atualizado",
        description: "Profissional foi atualizado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar profissional: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProfessionalMutation = useMutation({
    mutationFn: (id: string) => professionalService.deleteProfessional(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['professionals'], (oldProfessionals: Professional[] = []) =>
        oldProfessionals.filter(professional => professional.id !== deletedId)
      );
      toast({
        title: "Profissional removido",
        description: "Profissional foi removido com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao remover profissional: " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    professionals,
    isLoading,
    error,
    refetch,
    createProfessional: createProfessionalMutation.mutate,
    updateProfessional: updateProfessionalMutation.mutate,
    deleteProfessional: deleteProfessionalMutation.mutate,
    isCreating: createProfessionalMutation.isPending,
    isUpdating: updateProfessionalMutation.isPending,
    isDeleting: deleteProfessionalMutation.isPending,
  };
};

export const useActiveProfessionals = () => {
  return useQuery({
    queryKey: ['professionals', 'active'],
    queryFn: () => professionalService.getActiveProfessionals(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useProfessionalById = (id: string) => {
  return useQuery({
    queryKey: ['professionals', id],
    queryFn: () => professionalService.getProfessionalById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
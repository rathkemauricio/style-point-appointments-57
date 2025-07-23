import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Appointment } from '../models/appointment.model';
import { CreateAppointmentDTO, UpdateAppointmentDTO } from '../models/dto/appointment.dto';
import appointmentService from '../services/appointment.service';
import { useToast } from './use-toast';

export const useAppointments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: appointments = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentService.getAllAppointments(),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  const createAppointmentMutation = useMutation({
    mutationFn: (appointmentData: CreateAppointmentDTO) => 
      appointmentService.createAppointment(appointmentData),
    onSuccess: (newAppointment) => {
      queryClient.setQueryData(['appointments'], (oldAppointments: Appointment[] = []) => 
        [...oldAppointments, newAppointment]
      );
      toast({
        title: "Agendamento criado",
        description: "Novo agendamento foi criado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar agendamento: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentDTO }) => 
      appointmentService.updateAppointment(id, data),
    onSuccess: (updatedAppointment) => {
      queryClient.setQueryData(['appointments'], (oldAppointments: Appointment[] = []) =>
        oldAppointments.map(apt => apt.id === updatedAppointment.id ? updatedAppointment : apt)
      );
      toast({
        title: "Agendamento atualizado",
        description: "Agendamento foi atualizado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar agendamento: " + error.message,
        variant: "destructive",
      });
    },
  });

  const confirmAppointmentMutation = useMutation({
    mutationFn: (id: string) => appointmentService.confirmAppointment(id),
    onSuccess: (updatedAppointment) => {
      queryClient.setQueryData(['appointments'], (oldAppointments: Appointment[] = []) =>
        oldAppointments.map(apt => apt.id === updatedAppointment.id ? updatedAppointment : apt)
      );
      toast({
        title: "Agendamento confirmado",
        description: "Agendamento foi confirmado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao confirmar agendamento: " + error.message,
        variant: "destructive",
      });
    },
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => 
      appointmentService.cancelAppointment(id, reason),
    onSuccess: (updatedAppointment) => {
      queryClient.setQueryData(['appointments'], (oldAppointments: Appointment[] = []) =>
        oldAppointments.map(apt => apt.id === updatedAppointment.id ? updatedAppointment : apt)
      );
      toast({
        title: "Agendamento cancelado",
        description: "Agendamento foi cancelado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao cancelar agendamento: " + error.message,
        variant: "destructive",
      });
    },
  });

  const completeAppointmentMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => 
      appointmentService.completeAppointment(id, notes),
    onSuccess: (updatedAppointment) => {
      queryClient.setQueryData(['appointments'], (oldAppointments: Appointment[] = []) =>
        oldAppointments.map(apt => apt.id === updatedAppointment.id ? updatedAppointment : apt)
      );
      toast({
        title: "Agendamento concluído",
        description: "Agendamento foi concluído com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao concluir agendamento: " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    appointments,
    isLoading,
    error,
    refetch,
    createAppointment: createAppointmentMutation.mutate,
    updateAppointment: updateAppointmentMutation.mutate,
    confirmAppointment: confirmAppointmentMutation.mutate,
    cancelAppointment: cancelAppointmentMutation.mutate,
    completeAppointment: completeAppointmentMutation.mutate,
    isCreating: createAppointmentMutation.isPending,
    isUpdating: updateAppointmentMutation.isPending,
    isConfirming: confirmAppointmentMutation.isPending,
    isCancelling: cancelAppointmentMutation.isPending,
    isCompleting: completeAppointmentMutation.isPending,
  };
};

export const useAppointmentsByDate = (date: string) => {
  return useQuery({
    queryKey: ['appointments', 'by-date', date],
    queryFn: () => appointmentService.getAppointmentsByDate(date),
    enabled: !!date,
    staleTime: 2 * 60 * 1000,
  });
};

export const useAppointmentsByProfessional = (professionalId: string) => {
  return useQuery({
    queryKey: ['appointments', 'by-professional', professionalId],
    queryFn: () => appointmentService.getAppointmentsByProfessional(professionalId),
    enabled: !!professionalId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useAvailableSlots = (professionalId: string, date: string, serviceId: string) => {
  return useQuery({
    queryKey: ['available-slots', professionalId, date, serviceId],
    queryFn: () => appointmentService.getAvailableSlots(professionalId, date, serviceId),
    enabled: !!(professionalId && date && serviceId),
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};
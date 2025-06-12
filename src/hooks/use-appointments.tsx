import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services/appointment.service';
import { AppointmentDTO } from '../models/dto/appointment.dto';
import { toast } from 'sonner';

export const useAppointments = () => {
    const queryClient = useQueryClient();

    // Query para listar todos os agendamentos
    const { data: appointments = [], isLoading } = useQuery({
        queryKey: ['appointments'],
        queryFn: () => appointmentService.listAppointments(),
    });

    // Mutation para criar agendamento
    const createAppointment = useMutation({
        mutationFn: (data: Partial<AppointmentDTO>) => appointmentService.createAppointment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast.success('Agendamento criado com sucesso!');
        },
        onError: () => {
            toast.error('Erro ao criar agendamento');
        },
    });

    // Mutation para atualizar agendamento
    const updateAppointment = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<AppointmentDTO> }) =>
            appointmentService.updateAppointment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast.success('Agendamento atualizado com sucesso!');
        },
        onError: () => {
            toast.error('Erro ao atualizar agendamento');
        },
    });

    // Mutation para deletar agendamento
    const deleteAppointment = useMutation({
        mutationFn: (id: string) => appointmentService.deleteAppointment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast.success('Agendamento removido com sucesso!');
        },
        onError: () => {
            toast.error('Erro ao remover agendamento');
        },
    });

    // Query para buscar agendamentos por data
    const getAppointmentsByDate = (date: string) => {
        return useQuery({
            queryKey: ['appointments', 'date', date],
            queryFn: () => appointmentService.getAppointmentsByDate(date),
        });
    };

    // Query para buscar agendamentos por cliente
    const getAppointmentsByCustomer = (customerId: string) => {
        return useQuery({
            queryKey: ['appointments', 'customer', customerId],
            queryFn: () => appointmentService.getAppointmentsByCustomer(customerId),
        });
    };

    // Query para buscar agendamentos por profissional
    const getAppointmentsByProfessional = (professionalId: string) => {
        return useQuery({
            queryKey: ['appointments', 'professional', professionalId],
            queryFn: () => appointmentService.getAppointmentsByProfessional(professionalId),
        });
    };

    return {
        appointments,
        isLoading,
        createAppointment,
        updateAppointment,
        deleteAppointment,
        getAppointmentsByDate,
        getAppointmentsByCustomer,
        getAppointmentsByProfessional,
    };
}; 
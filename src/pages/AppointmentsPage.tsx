import React from 'react';
import { useAppointments } from '../hooks/use-appointments';
import { AppointmentsTable } from '../components/AppointmentsTable';
import { AppointmentForm } from '../components/AppointmentForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { AppointmentDTO } from '../models/dto/appointment.dto';
import { toast } from 'sonner';

export const AppointmentsPage: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedAppointment, setSelectedAppointment] = React.useState<AppointmentDTO | null>(null);
    const {
        appointments,
        isLoading,
        createAppointment,
        updateAppointment,
        deleteAppointment,
    } = useAppointments();

    const handleSubmit = async (data: Partial<AppointmentDTO>) => {
        try {
            if (selectedAppointment) {
                await updateAppointment.mutateAsync({
                    id: selectedAppointment.id,
                    data,
                });
            } else {
                await createAppointment.mutateAsync(data);
            }
            setIsOpen(false);
            setSelectedAppointment(null);
        } catch (error) {
            toast.error('Erro ao salvar agendamento');
        }
    };

    const handleEdit = (appointment: AppointmentDTO) => {
        setSelectedAppointment(appointment);
        setIsOpen(true);
    };

    const handleDelete = async (appointment: AppointmentDTO) => {
        if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
            try {
                await deleteAppointment.mutateAsync(appointment.id);
                toast.success('Agendamento excluído com sucesso!');
            } catch (error) {
                toast.error('Erro ao excluir agendamento');
            }
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Agendamentos</h1>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Novo Agendamento
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {selectedAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
                            </DialogTitle>
                        </DialogHeader>
                        <AppointmentForm
                            onSubmit={handleSubmit}
                            initialData={selectedAppointment || undefined}
                            isLoading={createAppointment.isPending || updateAppointment.isPending}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="text-center">Carregando...</div>
            ) : (
                <AppointmentsTable
                    appointments={appointments}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}; 